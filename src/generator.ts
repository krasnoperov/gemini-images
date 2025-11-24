/**
 * Core Gemini Image Generator
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import { readFile, writeFile } from 'node:fs/promises'
import { extname, basename, dirname, join } from 'node:path'
import type {
  GeminiGeneratorOptions,
  ImageGenerationConfig,
  TextToImageRequest,
  ImageEditRequest,
  MultiImageRequest,
  ImageGenerationResult,
  ImageInput,
  ImageMetadata,
} from './types.ts'
import { mergeConfig, validateConfig, MODEL_CAPABILITIES } from './config.ts'

/**
 * Gemini Image Generator class
 */
export class GeminiImageGenerator {
  private genAI: GoogleGenerativeAI
  private defaultConfig: ImageGenerationConfig
  private maxRetries: number
  private initialDelay: number
  private backoffMultiplier: number

  constructor (options: GeminiGeneratorOptions) {
    if (!options.apiKey) {
      throw new Error('Gemini API key is required')
    }

    this.genAI = new GoogleGenerativeAI(options.apiKey)
    this.defaultConfig = options.defaultConfig || {}

    // Configure retry settings
    const retryConfig = options.retryConfig || {}
    this.maxRetries = retryConfig.maxRetries ?? 3
    this.initialDelay = retryConfig.initialDelay ?? 2000
    this.backoffMultiplier = retryConfig.backoffMultiplier ?? 2
  }

  /**
   * Execute an API call with retry logic for handling service overload
   */
  private async withRetry<T> (
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    let lastError: Error | undefined

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error: any) {
        lastError = error

        // Check if this is a retryable error (503 Service Unavailable)
        const isServiceOverloaded =
          error?.message?.includes('503') ||
          error?.message?.includes('Service Unavailable') ||
          error?.message?.includes('overloaded')

        const isLastAttempt = attempt === this.maxRetries

        if (isServiceOverloaded && !isLastAttempt) {
          const delay = this.initialDelay * Math.pow(this.backoffMultiplier, attempt)

          console.error(`⚠️  ${operationName}: Service overloaded (attempt ${attempt + 1}/${this.maxRetries + 1})`)
          console.error(`   Retrying in ${(delay / 1000).toFixed(1)}s...`)

          await this.sleep(delay)
          continue
        }

        // Non-retryable error or last attempt - throw immediately
        if (!isServiceOverloaded) {
          throw error
        }

        // Last attempt for service overload error
        if (isLastAttempt) {
          console.error(`❌ ${operationName}: Failed after ${this.maxRetries + 1} attempts`)
          throw new Error(
            `Service overloaded after ${this.maxRetries + 1} attempts. ` +
            'Please try again later or use a different model. ' +
            `Original error: ${error.message}`
          )
        }
      }
    }

    throw lastError!
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep (ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Generate an image from a text prompt
   */
  async generateFromText (request: TextToImageRequest): Promise<ImageGenerationResult> {
    const config = mergeConfig(this.defaultConfig, request.config)
    validateConfig(config.model, config)

    const model = this.genAI.getGenerativeModel({
      model: config.model,
    })

    const result = await this.withRetry(
      async () => model.generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: this.enhancePrompt(request.prompt, config) }],
        }],
      }),
      'Generate image from text'
    )

    return this.parseResult(result)
  }

  /**
   * Edit an existing image
   */
  async editImage (request: ImageEditRequest): Promise<ImageGenerationResult> {
    const config = mergeConfig(this.defaultConfig, request.config)
    validateConfig(config.model, config)

    const model = this.genAI.getGenerativeModel({
      model: config.model,
    })

    const result = await this.withRetry(
      async () => model.generateContent({
        contents: [{
          role: 'user',
          parts: [
            {
              inlineData: {
                data: request.image.data,
                mimeType: request.image.mimeType,
              },
            },
            { text: request.prompt },
          ],
        }],
      }),
      'Edit image'
    )

    return this.parseResult(result)
  }

  /**
   * Generate image from multiple reference images
   */
  async composeFromMultipleImages (request: MultiImageRequest): Promise<ImageGenerationResult> {
    const config = mergeConfig(this.defaultConfig, request.config)
    validateConfig(config.model, config)

    const capabilities = MODEL_CAPABILITIES[config.model]
    if (request.images.length > capabilities.maxReferenceImages) {
      throw new Error(
        `Model ${config.model} supports maximum ${capabilities.maxReferenceImages} reference images. ` +
        `You provided ${request.images.length}.`
      )
    }

    const model = this.genAI.getGenerativeModel({
      model: config.model,
    })

    const parts: any[] = []

    // Add all images
    for (const image of request.images) {
      parts.push({
        inlineData: {
          data: image.data,
          mimeType: image.mimeType,
        },
      })
    }

    // Add prompt
    parts.push({ text: request.prompt })

    const result = await this.withRetry(
      async () => model.generateContent({
        contents: [{
          role: 'user',
          parts,
        }],
      }),
      'Compose from multiple images'
    )

    return this.parseResult(result)
  }

  /**
   * Start a multi-turn conversation for iterative refinement
   */
  async startRefinementSession (initialRequest: TextToImageRequest) {
    const config = mergeConfig(this.defaultConfig, initialRequest.config)
    validateConfig(config.model, config)

    const model = this.genAI.getGenerativeModel({
      model: config.model,
    })

    const chat = model.startChat()

    const result = await this.withRetry(
      async () => chat.sendMessage(
        this.enhancePrompt(initialRequest.prompt, config)
      ),
      'Start refinement session'
    )

    return {
      result: await this.parseResult(result),
      chat,
      refine: async (feedbackPrompt: string): Promise<ImageGenerationResult> => {
        const refinementResult = await this.withRetry(
          async () => chat.sendMessage(feedbackPrompt),
          'Refine image'
        )
        return this.parseResult(refinementResult)
      },
    }
  }

  /**
   * Enhance prompt with configuration details
   */
  private enhancePrompt (prompt: string, config: Required<ImageGenerationConfig>): string {
    const enhancements: string[] = []

    // Add aspect ratio guidance
    if (config.aspectRatio !== '1:1') {
      enhancements.push(`Aspect ratio: ${config.aspectRatio}`)
    }

    // Add resolution guidance for high-quality outputs
    if (config.imageSize === '4K') {
      enhancements.push('Ultra high quality, 4K resolution, highly detailed')
    } else if (config.imageSize === '2K') {
      enhancements.push('High quality, 2K resolution, detailed')
    }

    if (enhancements.length === 0) {
      return prompt
    }

    return `${prompt}\n\n[${enhancements.join(', ')}]`
  }

  /**
   * Parse generation result
   */
  private async parseResult (result: any): Promise<ImageGenerationResult> {
    const response = await result.response
    const candidates = response.candidates

    if (!candidates || candidates.length === 0) {
      return {
        raw: result,
      }
    }

    const candidate = candidates[0]
    const parts = candidate.content?.parts || []

    let imageData: string | undefined
    let mimeType: string | undefined
    let text: string | undefined

    for (const part of parts) {
      if (part.inlineData) {
        imageData = part.inlineData.data
        mimeType = part.inlineData.mimeType
      } else if (part.text) {
        text = (text || '') + part.text
      }
    }

    return {
      imageData,
      mimeType,
      text,
      raw: result,
    }
  }

  /**
   * Helper: Load image from file path (Node.js)
   */
  static async loadImageFromFile (filePath: string): Promise<ImageInput> {
    const data = await readFile(filePath)
    const ext = extname(filePath).toLowerCase()

    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    }

    const mimeType = mimeTypes[ext] || 'image/jpeg'

    return {
      data: data.toString('base64'),
      mimeType,
    }
  }

  /**
   * Helper: Save generated image to file (Node.js)
   */
  static async saveImageToFile (
    result: ImageGenerationResult,
    outputPath: string,
    metadata?: ImageMetadata
  ): Promise<void> {
    if (!result.imageData) {
      throw new Error('No image data in result')
    }

    const buffer = Buffer.from(result.imageData, 'base64')

    // Detect actual image format
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47
    const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF
    const isWebp = buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50

    // Determine correct extension
    let actualExt = '.jpg'
    if (isPng) actualExt = '.png'
    else if (isWebp) actualExt = '.webp'
    else if (isJpeg) actualExt = '.jpg'

    // Replace extension with actual format
    const dir = dirname(outputPath)
    const base = basename(outputPath, extname(outputPath))
    const correctPath = join(dir, `${base}${actualExt}`)

    // Save image
    await writeFile(correctPath, buffer)

    // Save metadata to .md file
    if (metadata) {
      const mdPath = join(dir, `${base}.md`)

      const lines = ['# Image Metadata', '']

      if (metadata.prompt) {
        lines.push('## Prompt', '', metadata.prompt, '')
      }

      if (metadata.model) {
        lines.push(`**Model:** ${metadata.model}`)
      }

      if (metadata.aspectRatio || metadata.imageSize) {
        const specs = []
        if (metadata.aspectRatio) specs.push(`Aspect Ratio: ${metadata.aspectRatio}`)
        if (metadata.imageSize) specs.push(`Size: ${metadata.imageSize}`)
        lines.push(`**Settings:** ${specs.join(', ')}`)
      }

      if (metadata.sourceIds && metadata.sourceIds.length > 0) {
        lines.push('', '**Source Images:**')
        metadata.sourceIds.forEach(id => lines.push(`- \`${id}\``))
      }

      if (metadata.timestamp) {
        const date = new Date(metadata.timestamp)
        lines.push('', `**Generated:** ${date.toLocaleString()}`)
      }

      await writeFile(mdPath, lines.join('\n'))
    }
  }
}
