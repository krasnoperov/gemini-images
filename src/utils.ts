export const PromptTemplates = {
  photorealistic: (subject: string, details: string) =>
    `Photorealistic image of ${subject}. ${details}. Shot with professional camera, natural lighting, high dynamic range, sharp focus, 8k quality.`,

  illustration: (subject: string, style: string) =>
    `${style} illustration of ${subject}. Professional digital art, clean lines, vibrant colors, detailed rendering.`,

  portrait: (subject: string, mood: string) =>
    `Portrait photograph of ${subject}. ${mood} mood. Professional portrait photography, bokeh background, natural skin tones, emotional depth.`,

  landscape: (location: string, time: string) =>
    `Landscape photograph of ${location} during ${time}. Wide angle shot, dramatic lighting, rich colors, professional landscape photography.`,

  gameSprite: (description: string, style: string) =>
    `${description}, ${style} game sprite art. Clean silhouette, centered composition, game-ready asset.`,

  tileable: (description: string) =>
    `Seamlessly tileable texture: ${description}. All four edges must connect perfectly when tiled. Consistent lighting, no directional elements.`,
}
