/**
 * Tests for type definitions and exports
 */

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import type {
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
} from '../src/types.ts'

describe('Type Definitions', () => {
  describe('Type exports', () => {
    it('should export all required types', () => {
      const config: ImageGenerationConfig = {
        model: 'gemini-3-pro-image-preview',
        aspectRatio: '16:9',
        imageSize: '1K',
      }
      assert.ok(config)

      const imageInput: ImageInput = {
        data: 'base64data',
        mimeType: 'image/jpeg',
      }
      assert.ok(imageInput)

      const textRequest: TextToImageRequest = {
        prompt: 'test prompt',
        config,
      }
      assert.ok(textRequest)

      const editRequest: ImageEditRequest = {
        image: imageInput,
        prompt: 'edit prompt',
        config,
      }
      assert.ok(editRequest)

      const multiRequest: MultiImageRequest = {
        images: [imageInput],
        prompt: 'compose prompt',
        config,
      }
      assert.ok(multiRequest)

      const result: ImageGenerationResult = {
        imageData: 'base64',
        mimeType: 'image/jpeg',
        text: 'description',
        raw: {},
      }
      assert.ok(result)

      const options: GeminiGeneratorOptions = {
        apiKey: 'test',
        defaultConfig: config,
      }
      assert.ok(options)
    })
  })

  describe('Type constraints', () => {
    it('should accept valid GeminiModel values', () => {
      const model1: GeminiModel = 'gemini-2.5-flash-image'
      const model2: GeminiModel = 'gemini-3-pro-image-preview'
      assert.ok(model1)
      assert.ok(model2)
    })

    it('should accept valid AspectRatio values', () => {
      const ratios: AspectRatio[] = [
        '1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'
      ]
      assert.equal(ratios.length, 10)
    })

    it('should accept valid ImageSize values', () => {
      const sizes: ImageSize[] = ['1K', '2K', '4K']
      assert.equal(sizes.length, 3)
    })

    it('should accept valid ResponseModality values', () => {
      const modalities: ResponseModality[] = ['TEXT', 'IMAGE']
      assert.equal(modalities.length, 2)
    })
  })
})
