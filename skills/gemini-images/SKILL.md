---
name: gemini-images
description: Generate images from text, transform existing images with natural language, and combine multiple image references for visual consistency. Use when creating images, editing visuals, or maintaining consistent characters/objects across multiple generations. Supports reference sheets, structured prompts, and visual anchor repetition.
allowed-tools: Bash
---

# Gemini Image Generation

Local CLI: `./scripts/gemini-images.js <command> [args] [options]`

## Core Primitives

Three operations that compose into any workflow:

```bash
generate "<prompt>"                          # Text → Image
edit <image> "<prompt>"                      # Image + Instructions → Image
compose <img1> <img2> ... "<prompt>"         # Images + Instructions → Image
```

## When to Use

- Generate images from text descriptions
- Transform existing images with instructions
- Maintain consistent characters/objects across multiple generations
- Create variations while preserving visual features
- Compose multiple reference images into new scenes

## Prerequisites

```bash
export GEMINI_API_KEY="your-key"  # Get at https://aistudio.google.com/app/apikey
npm run build
```

## Examples

### Basic Operations

```bash
# Generate
./scripts/gemini-images.js generate \
  "pixel art tree, white background" \
  --output tree.png

# Edit (transform with reference)
./scripts/gemini-images.js edit tree.png \
  "add glowing runes" \
  --output tree-magic.png

# Compose (combine references)
./scripts/gemini-images.js compose hero.png sword.png \
  "character holding sword" \
  --output hero-armed.png
```

### Reference Sheet Methodology

**Key Insight:** Gemini has spatial understanding - it can generate different views/poses while preserving visual features when given specific references.

#### 1. Start with Character Sheet

Create reference sheet with multiple views and key accessories:

```bash
./scripts/gemini-images.js generate \
  "Character sheet: front view, back view, side view. Character: forest ranger, auburn hair, green jerkin. Materials: leather, cloth. Include brief captions for text placement." \
  --output 1_character_sheet.png
```

Fix materials, colors, proportions, eyes, key textures in this foundational asset.

#### 2. Separate Accessory Sheets

Generate accessory variants separately with attachment details:

```bash
./scripts/gemini-images.js generate \
  "Accessory sheet: backpack variants (felt, leather, canvas). Show straps, buckles, attachment points. Brief captions." \
  --output 2_accessories.png
```

#### 3. Use Structured Prompts

Reference specific images and maintain consistent structure:

```bash
./scripts/gemini-images.js compose 1_character_sheet.png 2_accessories.png \
  "Image 1: Character sheet
Image 2: Accessory sheet
Scene: Forest clearing
Character: Ranger from image 1, front-facing
Action: Standing with backpack from image 2
Lighting: Soft natural light, top-left
Camera: Eye level, medium shot
Background: Blurred forest, bokeh
Items: Backpack from image 2 worn on back
Constraints: Maintain felt textures, leather straps visible" \
  --output scene.png
```

#### 4. Maintain Visual Anchors

Repeat **exact phrases** across prompts:
- Colors/materials: "auburn hair", "green leather jerkin", "felt textures"
- Lighting: "soft natural light, top-left"
- Camera: "eye level, medium shot"
- Setting: "studio light" or "macro diorama"

#### 5. Be Explicit About State Changes

Say what to add/remove/relocate to avoid unintended carryover:

```bash
# Clear state changes
./scripts/gemini-images.js edit scene.png \
  "Remove backpack. Character holds map in both hands. Backpack not visible." \
  --output new_scene.png
```

#### 6. Iterate in Small Deltas

Change **one major thing per step** (pose OR location OR accessory):

```bash
# Good: Change only pose
edit "Character from image 1, now sitting. Same lighting, camera, background."

# Bad: Change everything at once
edit "Character sitting in cave at night with torch"
```

#### 7. Reference Specific Entities

Use "entity from image N" to disambiguate:

```bash
compose 1_char.png 2_char.png "The robot from image 1 talks to the human from image 2"
```

Not just "the robot talks to the human" (ambiguous if multiple instances).

## Options

```
--model <model>           gemini-3-pro-image-preview (default) or gemini-2.5-flash-image
--aspect-ratio <ratio>    1:1, 16:9, 9:16, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 21:9
--image-size <size>       1K (default), 2K, 4K (Pro required for 2K/4K)
--output <path>           File or directory (default: ./output/)
```

## Model Selection

**gemini-3-pro-image-preview:**
- Higher quality, 2K/4K support
- Up to 14 reference images
- Best for production assets

**gemini-2.5-flash-image:**
- Faster, 1K max, 1 reference
- Quick iterations and testing

