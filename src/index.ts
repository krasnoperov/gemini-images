/**
 * Gemini Image Generation - Main Entry Point
 */

// Export main generator class
export { GeminiImageGenerator } from './generator.ts'

// Export all types
export type {
  GeminiModel,
  AspectRatio,
  ImageSize,
  ResponseModality,
  ImageGenerationConfig,
  ImageInput,
  TextToImageRequest,
  ImageEditRequest,
  MultiImageRequest,
  ImageGenerationResult,
  GeminiGeneratorOptions,
  ImageMetadata,
} from './types.ts'

// Import for local use
import type { ImageGenerationConfig } from './types.ts'

// Export configuration utilities
export {
  DEFAULT_CONFIG,
  MODEL_CAPABILITIES,
  ASPECT_RATIO_DIMENSIONS,
  IMAGE_SIZE_PIXELS,
  validateConfig,
  mergeConfig,
} from './config.ts'

export { PromptTemplates } from './utils.ts'

/**
 * Convenience function to create a generator instance
 */
export async function createGenerator (apiKey?: string, defaultConfig?: ImageGenerationConfig) {
  const key = apiKey || process.env.GEMINI_API_KEY

  if (!key) {
    throw new Error(
      'Gemini API key is required. Provide it as a parameter or set GEMINI_API_KEY environment variable.'
    )
  }

  const { GeminiImageGenerator } = await import('./generator.ts')
  return new GeminiImageGenerator({
    apiKey: key,
    defaultConfig,
  })
}

// Re-export for convenience
export default {
  createGenerator,
}
