/**
 * Configuration constants and defaults
 */

import type { ImageGenerationConfig, GeminiModel, AspectRatio, ImageSize } from './types.ts'

/**
 * Default image generation configuration
 */
export const DEFAULT_CONFIG: Required<ImageGenerationConfig> = {
  model: 'gemini-3-pro-image-preview',
  aspectRatio: '1:1',
  imageSize: '1K',
  responseModalities: ['TEXT', 'IMAGE'],
  enableSearchGrounding: false,
}

/**
 * Model capabilities and constraints
 */
export const MODEL_CAPABILITIES = {
  'gemini-2.5-flash-image': {
    alias: 'Flash',
    maxResolution: '1K',
    supportedSizes: ['1K'] as ImageSize[],
    maxReferenceImages: 1,
    supportsSearchGrounding: false,
    supportsTextRendering: false,
  },
  'gemini-3-pro-image-preview': {
    alias: 'Pro',
    maxResolution: '4K',
    supportedSizes: ['1K', '2K', '4K'] as ImageSize[],
    maxReferenceImages: 14,
    supportsSearchGrounding: true,
    supportsTextRendering: true,
  },
} as const

/**
 * Aspect ratio dimensions mapping
 */
export const ASPECT_RATIO_DIMENSIONS: Record<AspectRatio, { width: number; height: number }> = {
  '1:1': { width: 1, height: 1 },
  '2:3': { width: 2, height: 3 },
  '3:2': { width: 3, height: 2 },
  '3:4': { width: 3, height: 4 },
  '4:3': { width: 4, height: 3 },
  '4:5': { width: 4, height: 5 },
  '5:4': { width: 5, height: 4 },
  '9:16': { width: 9, height: 16 },
  '16:9': { width: 16, height: 9 },
  '21:9': { width: 21, height: 9 },
}

/**
 * Image size to pixel dimension mapping (for longest edge)
 */
export const IMAGE_SIZE_PIXELS: Record<ImageSize, number> = {
  '1K': 1024,
  '2K': 2048,
  '4K': 4096,
}

/**
 * Validate model supports requested configuration
 */
export function validateConfig (model: GeminiModel, config: ImageGenerationConfig): void {
  const capabilities = MODEL_CAPABILITIES[model]

  // Check image size support
  if (config.imageSize && !capabilities.supportedSizes.includes(config.imageSize)) {
    throw new Error(
      `Model ${model} does not support ${config.imageSize} resolution. ` +
      `Supported sizes: ${capabilities.supportedSizes.join(', ')}`
    )
  }

  // Check search grounding
  if (config.enableSearchGrounding && !capabilities.supportsSearchGrounding) {
    throw new Error(
      `Model ${model} does not support Google Search grounding. Use gemini-3-pro-image-preview instead.`
    )
  }

  // Check search grounding with image-only responses
  if (
    config.enableSearchGrounding &&
    config.responseModalities?.length === 1 &&
    config.responseModalities[0] === 'IMAGE'
  ) {
    throw new Error(
      'Google Search grounding is incompatible with image-only response mode. ' +
      'Include TEXT in responseModalities or disable search grounding.'
    )
  }
}

/**
 * Merge configurations with defaults
 */
export function mergeConfig (
  baseConfig: ImageGenerationConfig | undefined,
  overrideConfig: ImageGenerationConfig | undefined
): Required<ImageGenerationConfig> {
  return {
    ...DEFAULT_CONFIG,
    ...baseConfig,
    ...overrideConfig,
  }
}
