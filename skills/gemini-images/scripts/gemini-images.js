#!/usr/bin/env node

/**
 * Gemini Images - Skill wrapper script
 * Calls the main CLI from the plugin root
 */

import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Navigate from skills/gemini-images/scripts/ to plugin root
const cliPath = join(__dirname, '../../../dist/cli.js')

// Dynamic import and run
import(cliPath).catch((error) => {
  console.error('Error loading CLI:', error.message)
  console.error('\nPlugin may not be properly installed.')
  console.error('Expected CLI at:', cliPath)
  process.exit(1)
})
