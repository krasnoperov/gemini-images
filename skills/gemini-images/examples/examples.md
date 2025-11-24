# Examples

Demonstrating core primitives and the reference sheet methodology.

```bash
export GEMINI_API_KEY="your-key-here"
```

## 01 - Core Primitives

Three operations that compose into any workflow.

```bash
bash examples/01-primitives.sh
```

**Workflow:**

1. **Generate** - Create base character from text description
   ```bash
   generate "knight with silver armor, blue cape, front view, white background" \
     --output hero.png
   ```

2. **Edit** - Transform with instructions (preserves original features)
   ```bash
   edit hero.png "add iron sword in right hand" --output hero-sword.png
   ```

3. **Compose** - Combine multiple reference images
   ```bash
   generate "iron shield with griffon emblem, white background" --output shield.png
   compose hero-sword.png shield.png "add shield to left arm" --output hero-equipped.png
   ```

**Key insight:** Edit and compose preserve visual features from source images, unlike generating from scratch each time.

## 02 - Reference Sheet Methodology

Maintain consistent characters across multiple scenes and poses.

```bash
bash examples/02-consistency-pipeline.sh
```

**Problem:** Text-only generation creates different faces/features each time.

**Solution:** Use Gemini's spatial understanding with reference images.

### Step 1: Character Sheet

Generate multiple views to establish visual identity:

```bash
generate "Character sheet: front view, back view, side view.
Character: forest ranger, auburn hair, emerald eyes, moss-green jerkin.
Materials: worn leather, brass accents. Include brief captions." \
  --output 1_character_sheet.png
```

### Step 2: Accessory Sheet

Generate items separately with attachment details:

```bash
generate "Accessory sheet: backpack variants (felt, leather, canvas).
Show straps, buckles, attachment points." \
  --output 2_accessories.png
```

### Step 3: Structured Composition

Combine references with explicit labels:

```bash
compose 1_character_sheet.png 2_accessories.png \
  "Image 1: Character sheet
Image 2: Accessory sheet
Scene: Forest clearing
Character: Ranger from image 1, front-facing
Lighting: Soft natural light, top-left
Camera: Eye level, medium shot
Items: Backpack from image 2 worn on back
Constraints: Maintain watercolor textures, brass buckles visible" \
  --output scene_01.png
```

### Step 4: Small Deltas

Change ONE thing per step:

```bash
edit scene_01.png "now sitting on fallen log. Same lighting, camera, background.
Maintain auburn braid, emerald eyes, moss-green jerkin." \
  --output scene_02_sitting.png
```

### Step 5: Explicit State Changes

Say what to add AND what to remove:

```bash
edit scene_02.png "Remove backpack. Character holds map in both hands.
Backpack not visible." \
  --output scene_03_map.png
```

## Why This Works

**Gemini has spatial understanding** - it preserves visual features across views when given specific reference images, unlike text-only generation which re-interprets the prompt each time.

**Visual anchors** create consistency:
- Repeat exact phrases: "auburn braid", "emerald eyes", "moss-green jerkin"
- Repeat lighting: "soft natural light, top-left"
- Repeat camera: "eye level, medium shot"

**Entity references** prevent ambiguity:
- Use "ranger from image 1" not just "the ranger"
- Use "backpack from image 2" not just "a backpack"
