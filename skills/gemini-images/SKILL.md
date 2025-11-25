---
name: gemini-images
description: Generate images from text, transform existing images with natural language, and combine multiple image references for visual consistency. Use when creating images, editing visuals, or maintaining consistent characters/objects across multiple generations. Supports reference sheets, structured prompts, and visual anchor repetition.
allowed-tools: Bash
---

# Gemini Image Generation

CLI: `npx @krasnoperov/gemini-images <command> [args] [options]`

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
```

## Quick Examples

```bash
npx @krasnoperov/gemini-images generate "pixel art tree, white background" --output tree.png
npx @krasnoperov/gemini-images edit tree.png "add glowing runes" --output tree-magic.png
npx @krasnoperov/gemini-images compose hero.png sword.png "character holding sword" --output hero-armed.png
```

See `examples/` for complete working scripts.

**Note:** Output extension may differ from requested (e.g., `.webp` instead of `.png`) based on Gemini's response. Match by filename pattern when chaining operations.

## Reference Sheet Methodology

**Key Insight:** Gemini has spatial understanding - it generates different views/poses while preserving visual features when given specific references.

### Consistency Techniques

1. **Character sheets** - Generate front/back/side views to establish visual identity
2. **Accessory sheets** - Generate items separately with attachment details
3. **Structured prompts** - Use labels: `Image 1:`, `Scene:`, `Character:`, `Lighting:`
4. **Visual anchors** - Repeat exact phrases: "auburn hair", "soft natural light, top-left"
5. **Small deltas** - Change ONE thing per step (pose OR location OR accessory)
6. **Explicit state changes** - Say what to add/remove: "Remove backpack. Backpack not visible."
7. **Entity references** - Use "robot from image 1" not just "the robot"

### Structured Prompt Template

```
Image 1: [description]
Image 2: [description]
Scene: [setting]
Character: [entity] from image [N], [pose]
Lighting: [direction, quality]
Camera: [angle, shot type]
Constraints: [what to preserve]
```

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
