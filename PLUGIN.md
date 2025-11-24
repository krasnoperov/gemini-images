# Gemini Images Plugin for Claude Code

A Claude Code plugin providing minimal AI image generation primitives using Google's Gemini API.

## Installation

### From Marketplace (Recommended)

```bash
/plugin install gemini-images@krasnoperov/claude-plugins
```

Marketplace: https://github.com/krasnoperov/claude-plugins.git

### Manual Installation

1. Clone this repository to your Claude plugins directory:
   ```bash
   cd ~/.claude/plugins/
   git clone <repository-url> gemini-images
   cd gemini-images
   ```

2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

3. Restart Claude Code or reload plugins

## Setup

1. Get your Gemini API key from https://aistudio.google.com/app/apikey

2. Set the environment variable:
   ```bash
   export GEMINI_API_KEY="your-api-key-here"
   ```

   Or add to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):
   ```bash
   echo 'export GEMINI_API_KEY="your-api-key-here"' >> ~/.zshrc
   ```

## Usage

Once installed, Claude will automatically use this skill when you request image generation tasks:

- "Generate an image of a sunset over mountains"
- "Edit this photo to make it look like a watercolor painting"
- "Combine these two character images into one scene"

### Core Primitives

```bash
# Generate: Text → Image
./script/gemini-images.js generate "pixel art tree" --output tree.png

# Edit: Image + Instructions → Image
./script/gemini-images.js edit tree.png "add glowing runes" --output tree-magic.png

# Compose: Images + Instructions → Image
./script/gemini-images.js compose hero.png sword.png "character holding sword" --output hero-armed.png
```

## Philosophy

**Minimal but Sufficient** - Three core primitives compose into any workflow:
- No built-in "animation" command - loop `edit` with frame numbers
- No built-in "isometric" command - loop `edit` with directions
- No built-in "equipment" command - chain `edit` cumulatively

Build complex workflows by composing these primitives. See `examples/` directory for patterns.

## Models

**gemini-3-pro-image-preview** (Default)
- High quality, up to 4K resolution
- Supports 14 reference images
- Best for professional work

**gemini-2.5-flash-image** (Fast)
- Quick generation, 1K max
- Use with `--model gemini-2.5-flash-image`

## Examples

- **01-primitives.sh**: Basic usage of `generate`, `edit`, `compose`
- **02-consistency-pipeline.sh**: Reference Sheet Methodology for consistent character generation

See [examples/README.md](examples/README.md) for details and [skills/gemini-images/SKILL.md](skills/gemini-images/SKILL.md) for Reference Sheet Methodology.

## Project Structure

```
gemini-images/
├── .claude-plugin/
│   └── plugin.json          # Plugin metadata
├── skills/
│   └── gemini-images/
│       └── SKILL.md         # Skill definition for Claude
├── examples/                # Workflow examples
│   ├── 01-primitives.sh
│   ├── 02-consistency-pipeline.sh
│   └── README.md
├── script/
│   └── gemini-images.js     # Executable entry point
├── dist/                    # Built distribution
│   ├── cli.js              # CLI implementation
│   └── index.js            # Library exports
├── src/                     # TypeScript source
│   ├── cli.ts              # CLI with 3 primitives
│   ├── generator.ts        # Core Gemini integration
│   ├── utils.ts            # Prompt templates only
│   ├── config.ts           # Model configurations
│   └── types.ts            # Type definitions
├── PLUGIN.md               # Plugin installation guide
├── README.md               # Library usage guide
└── package.json            # No runtime dependencies
```

## Development

### Build

```bash
npm run build
```

### Type Check

```bash
npm run typecheck
```

### Dev Mode

```bash
npm run dev
```

## License

MIT License - see [LICENSE](LICENSE) file

## Links

- Gemini API Documentation: https://ai.google.dev/docs
- Get API Key: https://aistudio.google.com/app/apikey
- Claude Code Docs: https://code.claude.com/docs
