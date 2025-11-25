#!/usr/bin/env node

/**
 * Gemini Images - Local executable script
 * Run directly from the repo: ./scripts/gemini-images.js <command> [args]
 */

import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Import the CLI from the built dist
const cliPath = join(__dirname, '../../../dist/cli.js')

// Dynamic import and run
import(cliPath).catch((error) => {
  console.error('Error loading CLI:', error.message)
  console.error('\nMake sure to build the project first:')
  console.error('  npm run build')
  process.exit(1)
})
