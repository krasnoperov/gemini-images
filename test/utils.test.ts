/**
 * Tests for utility functions
 */

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { PromptTemplates } from '../src/utils.ts'

describe('Utility Functions', () => {
  describe('PromptTemplates', () => {
    describe('photorealistic', () => {
      it('should create photorealistic prompt', () => {
        const prompt = PromptTemplates.photorealistic(
          'a mountain landscape',
          'golden hour, dramatic clouds'
        )
        assert.ok(prompt.includes('Photorealistic'))
        assert.ok(prompt.includes('a mountain landscape'))
        assert.ok(prompt.includes('golden hour, dramatic clouds'))
        assert.ok(prompt.includes('professional camera'))
      })
    })

    describe('illustration', () => {
      it('should create illustration prompt', () => {
        const prompt = PromptTemplates.illustration(
          'a fantasy castle',
          'watercolor'
        )
        assert.ok(prompt.includes('watercolor'))
        assert.ok(prompt.includes('illustration'))
        assert.ok(prompt.includes('a fantasy castle'))
      })
    })

    describe('portrait', () => {
      it('should create portrait prompt', () => {
        const prompt = PromptTemplates.portrait(
          'a young woman',
          'contemplative'
        )
        assert.ok(prompt.includes('Portrait photograph'))
        assert.ok(prompt.includes('a young woman'))
        assert.ok(prompt.includes('contemplative'))
        assert.ok(prompt.includes('bokeh'))
      })
    })

    describe('landscape', () => {
      it('should create landscape prompt', () => {
        const prompt = PromptTemplates.landscape(
          'coastal cliffs',
          'sunset'
        )
        assert.ok(prompt.includes('Landscape photograph'))
        assert.ok(prompt.includes('coastal cliffs'))
        assert.ok(prompt.includes('sunset'))
      })
    })

    describe('gameSprite', () => {
      it('should create game sprite prompt', () => {
        const prompt = PromptTemplates.gameSprite(
          'fantasy knight character',
          'pixel art'
        )
        assert.ok(prompt.includes('fantasy knight character'))
        assert.ok(prompt.includes('pixel art'))
        assert.ok(prompt.includes('game sprite'))
      })
    })

    describe('tileable', () => {
      it('should create tileable texture prompt', () => {
        const prompt = PromptTemplates.tileable('grass with small flowers')
        assert.ok(prompt.includes('Seamlessly tileable'))
        assert.ok(prompt.includes('grass with small flowers'))
        assert.ok(prompt.includes('four edges'))
      })
    })
  })
})
