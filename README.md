# Gemini Images

**Minimal AI image generation toolkit** with three core primitives: `generate`, `edit`, `compose`. Build any workflow by composition.

## Quick Start

```bash
export GEMINI_API_KEY="your-key-here"

# Generate from text
npx @krasnoperov/gemini-images generate "pixel art tree" --output tree.png

# Transform image
npx @krasnoperov/gemini-images edit tree.png "add glowing runes" --output tree-magic.png

# Combine references
npx @krasnoperov/gemini-images compose hero.png sword.png "character holding sword" --output hero-armed.png
```

Get your API key: [Google AI Studio](https://aistudio.google.com/app/apikey)

## Core Primitives

```
generate "<prompt>"                          Text → Image
edit <image> "<prompt>"                      Image + Instructions → Image
compose <img1> <img2> ... "<prompt>"         Images + Instructions → Image
```

That's it. These three operations compose into any workflow.

## Philosophy

**Minimal but Sufficient:**
- No built-in "animation" command - loop `edit` with frame numbers
- No built-in "isometric" command - loop `edit` with directions
- No built-in "equipment" command - chain `edit` cumulatively

**Why?** Composition is more powerful than presets. Build what you need.

## Examples

See [`skills/gemini-images/examples/`](skills/gemini-images/examples/) directory:

1. **01-primitives.sh** - Basic usage of all three operations
2. **02-consistency-pipeline.sh** - Reference sheet methodology step-by-step

## Reference Sheet Methodology

Gemini has spatial understanding - it preserves visual features when given specific references.

### Character Sheets
```bash
npx @krasnoperov/gemini-images generate \
  "Character sheet: front view, back view, side view. Character: ranger, auburn hair, green jerkin." \
  --output character_sheet.png
```

### Structured Prompts
```bash
npx @krasnoperov/gemini-images compose character_sheet.png accessories.png \
  "Image 1: Character sheet
Image 2: Accessories
Character: From image 1, front-facing
Items: Backpack from image 2
Lighting: Soft natural light, top-left
Camera: Eye level, medium shot" \
  --output scene.png
```
me
## Options

```
--model <model>           gemini-3-pro-image-preview (default) or gemini-2.5-flash-image
--aspect-ratio <ratio>    1:1 (default), 16:9, 9:16, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 21:9
--image-size <size>       1K (default), 2K, 4K (Pro model required for 2K/4K)
--output <path>           Output file or directory (default: ./output/)
--api-key <key>           Gemini API key (or set GEMINI_API_KEY env var)
```

## Model Selection

| Feature | Flash | Pro |
|---------|-------|-----|
| Max Resolution | 1K | 4K |
| Reference Images | 1 | 14 |
| Speed | Fast | Moderate |
| Best For | Quick iterations | Production assets |

## Development

```bash
npm run build      # Build TypeScript
npm run typecheck  # Type checking
npm run dev        # Dev mode with type stripping
```

## Claude Code Plugin

Install from marketplace:

```bash
/plugin marketplace add krasnoperov/claude-plugins
/plugin install gemini-images@krasnoperov-plugins
```

See [`skills/gemini-images/SKILL.md`](skills/gemini-images/SKILL.md) for skill documentation.

## Acknowledgments

Reference sheet methodology based on [Towards Data Science](https://towardsdatascience.com/generating-consistent-imagery-with-gemini/).

## License

MIT License - Copyright (c) 2025 Aleksei Krasnoperov

See [LICENSE](LICENSE) file for details.
