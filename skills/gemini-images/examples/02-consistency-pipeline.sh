#!/bin/bash
# Reference Sheet Methodology
#
# Problem: AI generators create different faces/features from the same text prompt
# Solution: Use Gemini's spatial understanding with structured references
#
# Key techniques:
# 1. Character sheets (multiple views establish spatial relationships)
# 2. Separate accessory sheets (modular composition)
# 3. Structured prompts (explicit "Image 1:", "Image 2:" references)
# 4. Visual anchors (repeat EXACT color/material/lighting phrases)
# 5. Small deltas (change ONE thing per step)
# 6. Explicit state changes (say what to add/remove)
#
# Why it works: Gemini preserves visual features across views when given
# specific references, unlike text-only which re-interprets each time.

set -e
mkdir -p ./output/consistency

# 1. Character sheet with multiple views
npx -y @krasnoperov/gemini-images@latest generate \
  "Watercolor illustration character sheet: front view, back view, side view. Character: experienced forest ranger with weathered but kind face, auburn hair in practical braid, emerald green eyes, moss-green leather jerkin with brass buttons, confident and alert posture. Materials: worn leather, forest-dyed cloth, brass accents. Soft natural lighting. Include brief captions." \
  --output ./output/consistency/1_character_sheet.png

# 2. Accessory sheet with variants
npx -y @krasnoperov/gemini-images@latest generate \
  "Watercolor illustration accessory sheet: weathered backpack variants (forest-green felt with leather trim, full leather, canvas with brass buckles). Show leather straps, brass buckles, attachment points, rolled bedroll. Soft natural lighting. Brief captions." \
  --output ./output/consistency/2_accessories.png

# Find generated files (any extension)
CHAR_SHEET=$(find ./output/consistency -name "1_character_sheet.*" ! -name "*.md" | head -1)
ACCESSORIES=$(find ./output/consistency -name "2_accessories.*" ! -name "*.md" | head -1)

# 3. Compose with structured prompt
npx -y @krasnoperov/gemini-images@latest compose \
  "$CHAR_SHEET" \
  "$ACCESSORIES" \
  "Image 1: Character sheet
Image 2: Accessory sheet
Style: Watercolor illustration
Scene: Forest clearing with dappled sunlight
Character: Ranger from image 1, front-facing (auburn braid, emerald eyes, moss-green jerkin, weathered face)
Action: Standing alert with backpack from image 2
Lighting: Soft natural light, top-left, golden hour warmth
Camera: Eye level, medium shot
Background: Blurred forest, bokeh effect with green tones
Items: Felt backpack with leather trim from image 2 worn on back
Constraints: Maintain watercolor textures, brass buckles visible, forest-green tones" \
  --output ./output/consistency/scene_01.png

# 4. Small delta: change only pose
SCENE_01=$(find ./output/consistency -name "scene_01.*" ! -name "*.md" | head -1)
npx -y @krasnoperov/gemini-images@latest edit \
  "$SCENE_01" \
  "Character from image 1, now sitting on fallen log. Same watercolor style. Same lighting: soft natural light, top-left, golden hour. Same camera: eye level, medium shot. Same background. Maintain auburn braid, emerald eyes, moss-green jerkin with brass buttons, felt textures, weathered face." \
  --output ./output/consistency/scene_02_sitting.png

# 5. Explicit state change: remove item
SCENE_02=$(find ./output/consistency -name "scene_02_sitting.*" ! -name "*.md" | head -1)
npx -y @krasnoperov/gemini-images@latest edit \
  "$SCENE_02" \
  "Remove backpack. Character holds weathered parchment map in both hands, studying it carefully. Backpack not visible. Same watercolor style, same lighting with golden hour warmth, same camera, auburn braid, emerald eyes, moss-green jerkin with brass buttons." \
  --output ./output/consistency/scene_03_map.png