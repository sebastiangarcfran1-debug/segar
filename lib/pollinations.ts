/**
 * Generador de imágenes 100% GRATIS utilizando Pollinations.ai (Sin API Key, sin costo).
 * Produce URLs directas con modelos Flux / SDXL optimizadas para redes sociales.
 */

export interface PollinationsOptions {
  width?: number;
  height?: number;
  seed?: number;
  model?: 'flux' | 'flux-realism' | 'turbo';
  nologo?: boolean;
}

export function generatePollinationsImageUrl(
  prompt: string,
  options: PollinationsOptions = {}
): string {
  const {
    width = 1080,
    height = 1080,
    seed = Math.floor(Math.random() * 1000000),
    model = 'flux',
    nologo = true,
  } = options;

  // Enriquecer el prompt para maximizar calidad comercial y publicitaria
  const enhancedPrompt = `${prompt}, commercial advertising photography, high resolution, clean studio lighting, 8k, modern marketing style`;
  const encodedPrompt = encodeURIComponent(enhancedPrompt.trim());

  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=${model}&seed=${seed}&nologo=${nologo}`;
}
