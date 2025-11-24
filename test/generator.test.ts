/**
 * Tests for GeminiImageGenerator class
 */

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { GeminiImageGenerator } from '../src/generator.ts'

describe('GeminiImageGenerator', () => {
  describe('constructor', () => {
    it('should throw error when API key is missing', () => {
      assert.throws(
        () => new GeminiImageGenerator({ apiKey: '' }),
        /Gemini API key is required/
      )
    })

    it('should create instance with valid API key', () => {
      const generator = new GeminiImageGenerator({ apiKey: 'test-key' })
      assert.ok(generator)
    })

    it('should accept default config', () => {
      const generator = new GeminiImageGenerator({
        apiKey: 'test-key',
        defaultConfig: {
          model: 'gemini-2.5-flash-image',
          aspectRatio: '16:9',
        },
      })
      assert.ok(generator)
    })
  })

  describe('loadImageFromFile', () => {
    it('should throw error for non-existent file', async () => {
      await assert.rejects(
        async () => await GeminiImageGenerator.loadImageFromFile('/non/existent/file.jpg'),
        /ENOENT/
      )
    })

    it('should have correct method signature', () => {
      assert.equal(typeof GeminiImageGenerator.loadImageFromFile, 'function')
    })
  })

  describe('saveImageToFile', () => {
    it('should throw error when no image data in result', async () => {
      await assert.rejects(
        async () => await GeminiImageGenerator.saveImageToFile(
          { raw: {} },
          '/tmp/test.jpg'
        ),
        /No image data in result/
      )
    })

    it('should have correct method signature', () => {
      assert.equal(typeof GeminiImageGenerator.saveImageToFile, 'function')
    })
  })

  describe('validation', () => {
    it('should create generator successfully', () => {
      const generator = new GeminiImageGenerator({ apiKey: 'test-key' })
      assert.ok(generator)
    })
  })
})
