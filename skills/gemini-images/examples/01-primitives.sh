#!/bin/bash
# Core Primitives: generate, edit, compose

set -e
mkdir -p ./output

# Generate: Text → Image
./scripts/gemini-images.js generate \
  "hand-drawn fantasy illustration of a knight with determined expression and confident stance, wearing shiny silver armor with blue cape, front view, neutral pose, no sword, no shield, empty hands, white background" \
  --output ./output/hero.png

# Edit: Transform image with instructions
./scripts/gemini-images.js edit ./output/hero.png \
  "add iron sword in right hand, blade pointing down" \
  --output ./output/hero-sword.png

# Compose: Combine multiple references
./scripts/gemini-images.js generate \
  "hand-drawn fantasy illustration of an iron shield with griffon coat of arms emblem, round shape, silver metallic finish, white background" \
  --output ./output/shield.png

./scripts/gemini-images.js compose \
  ./output/hero-sword.png \
  ./output/shield.png \
  "add shield to left arm, maintain both art styles" \
  --output ./output/hero-equipped.png