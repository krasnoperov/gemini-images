# Examples

Demonstrating core primitives and the reference sheet methodology.

## Setup

```bash
export GEMINI_API_KEY="your-key-here"
npm run build
chmod +x examples/*.sh
```

## Examples

### 01 - Core Primitives
Basic usage of `generate`, `edit`, and `compose`.

```bash
bash examples/01-primitives.sh
```

### 02 - Reference Sheet Methodology
Character sheets → Accessory sheets → Structured prompts → Visual anchors → Small deltas

```bash
bash examples/02-consistency-pipeline.sh
```

Demonstrates:
1. Character sheet (multiple views)
2. Separate accessory sheet
3. Structured prompt composition ("Image 1:", "Image 2:", "Scene:", etc.)
4. Visual anchor repetition (exact phrases)
5. Small deltas (one change per step)
6. Explicit state changes


## Output

```
output/
├── hero.png
├── hero-sword.png
├── hero-equipped.png
└── consistency/
    ├── 1_character_sheet.png
    ├── 2_accessories.png
    ├── scene_01.png
    ├── scene_02_sitting.png
    └── scene_03_map.png
```

## Key Concepts

**Gemini has spatial understanding** - it generates different views/poses while preserving visual features when given specific references.

**Consistency techniques:**
- Character sheets (front/back/side views)
- Separate accessory sheets (attachment details)
- Structured prompts (Image 1:, Image 2:, Scene:, Character:, etc.)
- Visual anchors (repeat exact color/material/lighting phrases)
- Small deltas (change one thing per step)
- Explicit state changes (say what to add/remove)
- Specific entity references ("from image 1")