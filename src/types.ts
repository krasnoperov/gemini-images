/**
 * Type definitions for Gemini Image Generation
 */

/**
 * Supported Gemini models for image generation
 */
export type GeminiModel =
  | 'gemini-2.5-flash-image'
  | 'gemini-3-pro-image-preview'

/**
 * Aspect ratio options for generated images
 */
export type AspectRatio =
  | '1:1'    // Square
  | '2:3'    // Portrait
  | '3:2'    // Landscape
  | '3:4'    // Portrait
  | '4:3'    // Landscape
  | '4:5'    // Portrait
  | '5:4'    // Landscape
  | '9:16'   // Portrait (mobile)
  | '16:9'   // Landscape (widescreen)
  | '21:9'  // Ultra-wide

/**
 * Image size/resolution options
 */
export type ImageSize = '1K' | '2K' | '4K'

/**
 * Response modalities
 */
export type ResponseModality = 'TEXT' | 'IMAGE'

/**
 * Configuration for image generation
 */
export interface ImageGenerationConfig {
  /**
   * Model to use for generation
   * @default 'gemini-3-pro-image-preview'
   */
  model?: GeminiModel;

  /**
   * Desired aspect ratio
   * @default '1:1'
   */
  aspectRatio?: AspectRatio;

  /**
   * Image size/resolution
   * Note: 2K and 4K require Pro model
   * @default '1K'
   */
  imageSize?: ImageSize;

  /**
   * Response modalities to request
   * @default ['TEXT', 'IMAGE']
   */
  responseModalities?: ResponseModality[];

  /**
   * Enable Google Search grounding (Pro only)
   * Note: Incompatible with image-only responses
   * @default false
   */
  enableSearchGrounding?: boolean;
}

/**
 * Image input for editing or reference
 */
export interface ImageInput {
  /**
   * Base64-encoded image data
   */
  data: string;

  /**
   * MIME type (e.g., 'image/jpeg', 'image/png')
   */
  mimeType: string;
}

/**
 * Text-to-image generation request
 */
export interface TextToImageRequest {
  /**
   * Text prompt describing the desired image
   */
  prompt: string;

  /**
   * Optional configuration overrides
   */
  config?: ImageGenerationConfig;
}

/**
 * Image editing request
 */
export interface ImageEditRequest {
  /**
   * Reference image to edit
   */
  image: ImageInput;

  /**
   * Prompt describing desired edits
   */
  prompt: string;

  /**
   * Optional configuration overrides
   */
  config?: ImageGenerationConfig;
}

/**
 * Multi-image composition request
 */
export interface MultiImageRequest {
  /**
   * Reference images to compose (max 14 for Pro model)
   */
  images: ImageInput[];

  /**
   * Prompt describing desired composition
   */
  prompt: string;

  /**
   * Optional configuration overrides
   */
  config?: ImageGenerationConfig;
}

/**
 * Image generation result
 */
export interface ImageGenerationResult {
  /**
   * Generated image data (base64)
   */
  imageData?: string;

  /**
   * MIME type of generated image
   */
  mimeType?: string;

  /**
   * Text response from the model
   */
  text?: string;

  /**
   * Raw response from the model
   */
  raw: any;
}

/**
 * Retry configuration for handling service overload
 */
export interface RetryConfig {
  /**
   * Maximum number of retry attempts
   * @default 3
   */
  maxRetries?: number;

  /**
   * Initial delay in milliseconds before first retry
   * @default 2000
   */
  initialDelay?: number;

  /**
   * Multiplier for exponential backoff
   * @default 2
   */
  backoffMultiplier?: number;
}

/**
 * Generator options
 */
export interface GeminiGeneratorOptions {
  /**
   * Gemini API key
   */
  apiKey: string;

  /**
   * Default configuration for all requests
   */
  defaultConfig?: ImageGenerationConfig;

  /**
   * Retry configuration for handling transient errors
   */
  retryConfig?: RetryConfig;
}

/**
 * Game development specific types
 */

/**
 * Isometric direction for game sprites
 */
export type IsometricDirection = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW'

/**
 * Parallax layer depth
 */
export type ParallaxLayer = 'far' | 'mid' | 'near'

/**
 * Animation state for characters
 */
export type AnimationState = 'idle' | 'walk' | 'run' | 'jump' | 'attack' | 'hurt' | 'die'

/**
 * Metadata embedded in generated PNG files
 */
export interface ImageMetadata {
  /**
   * The prompt used to generate the image
   */
  prompt?: string;

  /**
   * The model used for generation
   */
  model?: string;

  /**
   * Aspect ratio used
   */
  aspectRatio?: string;

  /**
   * Image size used
   */
  imageSize?: string;

  /**
   * Source image IDs (for edit and compose operations)
   */
  sourceIds?: string[];

  /**
   * Generation timestamp
   */
  timestamp?: string;
}
