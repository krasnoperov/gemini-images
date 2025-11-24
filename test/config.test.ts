/**
 * Tests for configuration and validation
 */

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  DEFAULT_CONFIG,
  MODEL_CAPABILITIES,
  validateConfig,
  mergeConfig,
  ASPECT_RATIO_DIMENSIONS,
  IMAGE_SIZE_PIXELS,
} from '../src/config.ts'
import type { ImageGenerationConfig } from '../src/types.ts'

describe('Configuration', () => {
  describe('DEFAULT_CONFIG', () => {
    it('should have correct default values', () => {
      assert.equal(DEFAULT_CONFIG.model, 'gemini-3-pro-image-preview')
      assert.equal(DEFAULT_CONFIG.aspectRatio, '1:1')
      assert.equal(DEFAULT_CONFIG.imageSize, '1K')
      assert.deepEqual(DEFAULT_CONFIG.responseModalities, ['TEXT', 'IMAGE'])
      assert.equal(DEFAULT_CONFIG.enableSearchGrounding, false)
    })
  })

  describe('MODEL_CAPABILITIES', () => {
    it('should define Flash model capabilities', () => {
      const flash = MODEL_CAPABILITIES['gemini-2.5-flash-image']
      assert.equal(flash.alias, 'Flash')
      assert.equal(flash.maxResolution, '1K')
      assert.deepEqual(flash.supportedSizes, ['1K'])
      assert.equal(flash.maxReferenceImages, 1)
      assert.equal(flash.supportsSearchGrounding, false)
      assert.equal(flash.supportsTextRendering, false)
    })

    it('should define Pro model capabilities', () => {
      const pro = MODEL_CAPABILITIES['gemini-3-pro-image-preview']
      assert.equal(pro.alias, 'Pro')
      assert.equal(pro.maxResolution, '4K')
      assert.deepEqual(pro.supportedSizes, ['1K', '2K', '4K'])
      assert.equal(pro.maxReferenceImages, 14)
      assert.equal(pro.supportsSearchGrounding, true)
      assert.equal(pro.supportsTextRendering, true)
    })
  })

  describe('ASPECT_RATIO_DIMENSIONS', () => {
    it('should have correct dimensions for all aspect ratios', () => {
      assert.deepEqual(ASPECT_RATIO_DIMENSIONS['1:1'], { width: 1, height: 1 })
      assert.deepEqual(ASPECT_RATIO_DIMENSIONS['16:9'], { width: 16, height: 9 })
      assert.deepEqual(ASPECT_RATIO_DIMENSIONS['9:16'], { width: 9, height: 16 })
    })
  })

  describe('IMAGE_SIZE_PIXELS', () => {
    it('should map sizes to pixel dimensions', () => {
      assert.equal(IMAGE_SIZE_PIXELS['1K'], 1024)
      assert.equal(IMAGE_SIZE_PIXELS['2K'], 2048)
      assert.equal(IMAGE_SIZE_PIXELS['4K'], 4096)
    })
  })

  describe('validateConfig', () => {
    it('should pass validation for valid Flash config', () => {
      const config: ImageGenerationConfig = {
        model: 'gemini-2.5-flash-image',
        imageSize: '1K',
      }
      assert.doesNotThrow(() => validateConfig('gemini-2.5-flash-image', config))
    })

    it('should pass validation for valid Pro config', () => {
      const config: ImageGenerationConfig = {
        model: 'gemini-3-pro-image-preview',
        imageSize: '4K',
        enableSearchGrounding: true,
      }
      assert.doesNotThrow(() => validateConfig('gemini-3-pro-image-preview', config))
    })

    it('should throw error for unsupported image size on Flash', () => {
      const config: ImageGenerationConfig = {
        model: 'gemini-2.5-flash-image',
        imageSize: '2K',
      }
      assert.throws(
        () => validateConfig('gemini-2.5-flash-image', config),
        /does not support 2K resolution/
      )
    })

    it('should throw error for search grounding on Flash', () => {
      const config: ImageGenerationConfig = {
        model: 'gemini-2.5-flash-image',
        enableSearchGrounding: true,
      }
      assert.throws(
        () => validateConfig('gemini-2.5-flash-image', config),
        /does not support Google Search grounding/
      )
    })

    it('should throw error for search grounding with image-only response', () => {
      const config: ImageGenerationConfig = {
        model: 'gemini-3-pro-image-preview',
        enableSearchGrounding: true,
        responseModalities: ['IMAGE'],
      }
      assert.throws(
        () => validateConfig('gemini-3-pro-image-preview', config),
        /incompatible with image-only response mode/
      )
    })
  })

  describe('mergeConfig', () => {
    it('should merge configs with override taking precedence', () => {
      const base: ImageGenerationConfig = {
        model: 'gemini-2.5-flash-image',
        aspectRatio: '1:1',
      }
      const override: ImageGenerationConfig = {
        aspectRatio: '16:9',
        imageSize: '1K',
      }
      const result = mergeConfig(base, override)

      assert.equal(result.model, 'gemini-2.5-flash-image')
      assert.equal(result.aspectRatio, '16:9')
      assert.equal(result.imageSize, '1K')
    })

    it('should use defaults when no configs provided', () => {
      const result = mergeConfig(undefined, undefined)
      assert.deepEqual(result, DEFAULT_CONFIG)
    })

    it('should handle partial configs', () => {
      const result = mergeConfig({ aspectRatio: '16:9' }, undefined)
      assert.equal(result.aspectRatio, '16:9')
      assert.equal(result.model, DEFAULT_CONFIG.model)
    })
  })
})
