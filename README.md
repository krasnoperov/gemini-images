# Gemini Images

**AI image generation skill for Claude Code** - Generate consistent game sprites, character sheets, and visual assets using Gemini's spatial understanding and reference sheet methodology.

## Use in Claude Code

This is a Claude Code skill. Install it from the marketplace:

```bash
/plugin marketplace add krasnoperov/claude-plugins
/plugin install gemini-images@krasnoperov-plugins
```

Once installed, use the `/gemini-images` skill in your conversations:

```
/gemini-images generate a pixel art character sheet with front, back, and side views
/gemini-images edit character.png "add armor and sword"
/gemini-images compose character.png background.png "place character in forest scene"
```

See [`skills/gemini-images/SKILL.md`](skills/gemini-images/SKILL.md) for complete skill documentation.

## Command Line Usage

You can also use this package directly via npx:

```bash
export GEMINI_API_KEY="your-key-here"

# Generate from text
npx -y @krasnoperov/gemini-images@latest generate "pixel art tree" --output tree.png

# Transform image
npx -y @krasnoperov/gemini-images@latest edit tree.png "add glowing runes" --output tree-magic.png

# Combine references
npx -y @krasnoperov/gemini-images@latest compose hero.png sword.png "character holding sword" --output hero-armed.png
```

Get your API key: [Google AI Studio](https://aistudio.google.com/app/apikey)

## Core Operations

```
generate "<prompt>"                          Text → Image
edit <image> "<prompt>"                      Image + Instructions → Image
compose <img1> <img2> ... "<prompt>"         Images + Instructions → Image
```

These three operations compose into any workflow you need.

## Examples

See [`skills/gemini-images/examples/`](skills/gemini-images/examples/) directory:

1. **01-primitives.sh** - Basic usage of all three operations
2. **02-consistency-pipeline.sh** - Reference sheet methodology step-by-step

## Reference Sheet Methodology

Gemini has spatial understanding - it preserves visual features when given specific references.

### Character Sheets
```bash
npx -y @krasnoperov/gemini-images@latest generate \
  "Character sheet: front view, back view, side view. Character: ranger, auburn hair, green jerkin." \
  --output character_sheet.png
```

### Structured Prompts
```bash
npx -y @krasnoperov/gemini-images@latest compose character_sheet.png accessories.png \
  "Image 1: Character sheet
Image 2: Accessories
Character: From image 1, front-facing
Items: Backpack from image 2
Lighting: Soft natural light, top-left
Camera: Eye level, medium shot" \
  --output scene.png
```

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

## Acknowledgments

Reference sheet methodology based on [Towards Data Science](https://towardsdatascience.com/generating-consistent-imagery-with-gemini/).

## License

MIT License - Copyright (c) 2025 Aleksei Krasnoperov

See [LICENSE](LICENSE) file for details.
