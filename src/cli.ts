/**
 * Gemini Images CLI
 *
 * Usage:
 *   npx gemini-images generate "prompt" [options]
 *   npx gemini-images edit <image> "prompt" [options]
 *   npx gemini-images compose <image1> <image2> ... "prompt" [options]
 *   npx gemini-images series <reference-image> "character description" "scenario1" "scenario2" ... [options]
 */

import { parseArgs } from 'node:util'
import { readFile, mkdir } from 'node:fs/promises'
import { basename, dirname, extname, join } from 'node:path'
import { GeminiImageGenerator } from './generator.ts'
import type { ImageInput, GeminiModel, AspectRatio, ImageSize } from './types.ts'

const COMMANDS = ['generate', 'edit', 'compose'] as const
type Command = typeof COMMANDS[number]

interface CliOptions {
  model?: GeminiModel;
  aspectRatio?: AspectRatio;
  imageSize?: ImageSize;
  output?: string;
  apiKey?: string;
}

function printUsage () {
  console.log(`
Gemini Images - Core AI Image Generation Primitives

Usage:
  gemini-images <command> [arguments...] [options]

CORE COMMANDS:
  generate "<prompt>"                          Generate image from text description
  edit <image> "<prompt>"                      Transform existing image with instructions
  compose <img1> <img2> ... "<prompt>"         Combine multiple images with instructions

Options:
  --model <model>           gemini-3-pro-image-preview (default) or gemini-2.5-flash-image
  --aspect-ratio <ratio>    1:1 (default), 16:9, 9:16, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 21:9
  --image-size <size>       1K (default), 2K, 4K (Pro model required for 2K/4K)
  --output <path>           Output file or directory (default: ./output/)
  --api-key <key>           Gemini API key (or set GEMINI_API_KEY env var)
  --help                    Show this help message

Examples:
  # Generate from text
  gemini-images generate "pixel art tree, white background" --output tree.png

  # Transform image
  gemini-images edit tree.png "add glowing blue runes" --output tree-magic.png

  # Combine multiple images
  gemini-images compose hero.png sword.png "character holding sword" --output hero-armed.png

Build Complex Workflows:
  All game dev workflows (isometric, animation, equipment, etc.) can be built by
  composing these three primitives. See examples/ for bash scripts showing how to:
  - Generate animation frames (loop edit with frame numbers)
  - Create 8-directional sprites (loop edit with directions)
  - Add equipment cumulatively (chain edit calls)
  - Generate consistent character series (compose with references)

Environment Variables:
  GEMINI_API_KEY    Your API key from https://aistudio.google.com/app/apikey

See examples/ directory for composition patterns and game asset workflows.
`)
}

async function loadImageFromPath (path: string): Promise<ImageInput> {
  const data = await readFile(path)
  const ext = extname(path).toLowerCase()

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

async function ensureOutputDir (path: string): Promise<void> {
  await mkdir(path, { recursive: true })
}

/**
 * Determine if output path is a file or directory
 * Returns { isFile, dir, filename }
 */
function parseOutputPath (output: string | undefined, defaultFilename: string): {
  isFile: boolean;
  dir: string;
  filename: string;
} {
  if (!output) {
    return { isFile: false, dir: './output', filename: defaultFilename }
  }

  const ext = extname(output)
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

  if (imageExtensions.includes(ext.toLowerCase())) {
    // It's a file path
    return {
      isFile: true,
      dir: dirname(output),
      filename: basename(output),
    }
  } else {
    // It's a directory path
    return {
      isFile: false,
      dir: output,
      filename: defaultFilename,
    }
  }
}

async function main () {
  const args = process.argv.slice(2)

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printUsage()
    process.exit(0)
  }

  const command = args[0] as Command

  if (!COMMANDS.includes(command)) {
    console.error(`Unknown command: ${command}`)
    printUsage()
    process.exit(1)
  }

  const { values } = parseArgs({
    args: args.slice(1),
    options: {
      model: { type: 'string' },
      'aspect-ratio': { type: 'string' },
      'image-size': { type: 'string' },
      output: { type: 'string' },
      'api-key': { type: 'string' },
    },
    allowPositionals: true,
  })

  const options: CliOptions = {
    model: values.model as GeminiModel,
    aspectRatio: values['aspect-ratio'] as AspectRatio,
    imageSize: values['image-size'] as ImageSize,
    output: values.output as string,
    apiKey: values['api-key'] as string,
  }

  const positionals = args.slice(1).filter(arg => !arg.startsWith('--') && !isOption(arg, args))

  const apiKey = options.apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_STUDIO_KEY
  if (!apiKey) {
    console.error('Error: GEMINI_API_KEY is required. Set it as an environment variable or use --api-key')
    process.exit(1)
  }

  // Initialize generator
  const generator = new GeminiImageGenerator({
    apiKey,
    defaultConfig: {
      model: options.model || 'gemini-3-pro-image-preview',
      aspectRatio: options.aspectRatio || '1:1',
      imageSize: options.imageSize || '1K',
    },
  })

  try {
    switch (command) {
      case 'generate': {
        const prompt = positionals[0]
        if (!prompt) {
          console.error('Error: prompt is required')
          process.exit(1)
        }

        const outputInfo = parseOutputPath(options.output, 'generated.png')
        await ensureOutputDir(outputInfo.dir)

        console.log(`Generating: "${this.summarizePrompt(prompt)}"`)
        const result = await generator.generateFromText({ prompt })

        if (result.imageData) {
          const outputPath = join(outputInfo.dir, outputInfo.filename)
          await GeminiImageGenerator.saveImageToFile(result, outputPath, {
            prompt,
            model: options.model || 'gemini-3-pro-image-preview',
            aspectRatio: options.aspectRatio || '1:1',
            imageSize: options.imageSize || '1K',
            timestamp: new Date().toISOString(),
          })
          console.log(`✓ Image saved to ${outputPath}`)
          if (result.text) {
            console.log(`\nModel response: ${result.text}`)
          }
        } else {
          console.error('Error: No image data received')
          process.exit(1)
        }
        break
      }

      case 'edit': {
        const [imagePath, prompt] = positionals
        if (!imagePath || !prompt) {
          console.error('Error: image path and prompt are required')
          process.exit(1)
        }

        const outputInfo = parseOutputPath(options.output, `edited-${basename(imagePath, extname(imagePath))}.png`)
        await ensureOutputDir(outputInfo.dir)

        const image = await loadImageFromPath(imagePath)

        console.log(`Editing: "${summarizePrompt(prompt)}"`)
        const result = await generator.editImage({ image, prompt })

        if (result.imageData) {
          const outputPath = join(outputInfo.dir, outputInfo.filename)
          await GeminiImageGenerator.saveImageToFile(result, outputPath, {
            prompt,
            model: options.model || 'gemini-3-pro-image-preview',
            aspectRatio: options.aspectRatio || '1:1',
            imageSize: options.imageSize || '1K',
            sourceIds: [imagePath],
            timestamp: new Date().toISOString(),
          })
          console.log(`✓ Image saved to ${outputPath}`)
          if (result.text) {
            console.log(`\nModel response: ${result.text}`)
          }
        } else {
          console.error('Error: No image data received')
          process.exit(1)
        }
        break
      }

      case 'compose': {
        if (positionals.length < 3) {
          console.error('Error: at least 2 images and a prompt are required')
          process.exit(1)
        }

        const prompt = positionals[positionals.length - 1]
        const imagePaths = positionals.slice(0, -1)

        const outputInfo = parseOutputPath(options.output, 'composed.png')
        await ensureOutputDir(outputInfo.dir)

        const images = await Promise.all(imagePaths.map(loadImageFromPath))

        console.log(`Composing (${imagePaths.length} images): "${summarizePrompt(prompt)}"`)
        const result = await generator.composeFromMultipleImages({ images, prompt })

        if (result.imageData) {
          const outputPath = join(outputInfo.dir, outputInfo.filename)
          await GeminiImageGenerator.saveImageToFile(result, outputPath, {
            prompt,
            model: options.model || 'gemini-3-pro-image-preview',
            aspectRatio: options.aspectRatio || '1:1',
            imageSize: options.imageSize || '1K',
            sourceIds: imagePaths,
            timestamp: new Date().toISOString(),
          })
          console.log(`✓ Image saved to ${outputPath}`)
          if (result.text) {
            console.log(`\nModel response: ${result.text}`)
          }
        } else {
          console.error('Error: No image data received')
          process.exit(1)
        }
        break
      }
    }

    console.log('\n✓ Done!')
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

function isOption (arg: string, allArgs: string[]): boolean {
  const idx = allArgs.indexOf(arg)
  if (idx === 0) return false
  const prev = allArgs[idx - 1]
  return prev?.startsWith('--') && !prev.includes('=')
}

function summarizePrompt (prompt: string): string {
  const lines = prompt.split('\n').map(l => l.trim()).filter(l => l)

  if (lines.length === 1) {
    return lines[0].length > 60 ? lines[0].substring(0, 57) + '...' : lines[0]
  }

  const keyLines = lines.filter(l =>
    l.match(/^(Action|Direction|Scene|Character|Style):/i)
  )

  if (keyLines.length > 0) {
    const summary = keyLines.slice(0, 2).join(', ')
    return summary.length > 60 ? summary.substring(0, 57) + '...' : summary
  }

  const summary = lines.slice(0, 2).join(', ')
  return summary.length > 60 ? summary.substring(0, 57) + '...' : summary
}

main()
