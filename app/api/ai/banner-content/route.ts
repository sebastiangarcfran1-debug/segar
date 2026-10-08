import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';
import { generatePollinationsImageUrl } from '@/lib/pollinations';

function extractJson(raw: string): any {
  if (!raw) return null;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    try {
      return JSON.parse(raw.substring(start, end + 1));
    } catch {
      return null;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { rubro, producto, oferta, estilo, formato } = await req.json();

    const prompt = `Actúa como el director de arte y redactor publicitario número 1 de agencias como AdCreative.ai y Ogilvy.
Diseña los elementos de texto y la composición visual para un ANUNCIO GRÁFICO DE ALTO IMPACTO (Banner publicitario para pymes en Chile y Latinoamérica).

DATOS:
- Rubro: ${rubro || 'General'}
- Producto: ${producto || 'Oferta principal'}
- Oferta o Descuento: ${oferta || 'Precios especiales por tiempo limitado'}
- Estilo: ${estilo || 'Moderno, audaz y premium'}
- Formato: ${formato || '1:1'}

Devuelve ÚNICAMENTE un objeto JSON con esta estructura exacta:
{
  "badge": "TEXTO CORTO EN MAYÚSCULAS (ej: -30% HOY / ENVÍO GRATIS / OFERTA EXCLUSIVA)",
  "titular": "TITULAR PRINCIPAL DE MÁXIMO IMPACTO (máximo 6 palabras potentes)",
  "subtitulo": "Subtítulo o beneficio irresistible que resuelve la objeción principal (máximo 12 palabras)",
  "precio": "Precio con formato local (ej: $19.900 CLP o Desde $9.990)",
  "ctaTexto": "COMPRAR AHORA o PEDIR POR WHATSAPP o RESERVAR MI CUPO",
  "promptImagen": "Ultra-detailed commercial photography in English of the product in a clean, modern studio setting with dramatic lighting, luxury atmosphere, photorealistic 8k",
  "conversionScore": 97
}

Responde SOLO el JSON.`;

    const respuestaIA = await callGemini(prompt);
    let bannerData = extractJson(respuestaIA);

    if (!bannerData) {
      bannerData = {
        badge: oferta ? 'OFERTA DESTACADA' : 'ENVÍO GRATIS A TODO CHILE',
        titular: `${(producto || 'PRODUCTO ESTRELLA').toUpperCase()} DE ALTA CALIDAD`,
        subtitulo: 'Aprovecha precio especial de lanzamiento por tiempo limitado.',
        precio: '$29.900 CLP',
        ctaTexto: 'PEDIR POR WHATSAPP AHORA',
        promptImagen: `commercial product photography of ${producto || 'luxury item'} modern studio lighting luxury atmosphere 8k`,
        conversionScore: 97,
      };
    }

    // Generar imagen de fondo con Pollinations Flux
    const width = formato === '9:16' ? 1080 : formato === '16:9' ? 1920 : 1080;
    const height = formato === '9:16' ? 1920 : formato === '16:9' ? 1080 : 1080;

    const imageUrl = generatePollinationsImageUrl(bannerData.promptImagen, {
      width,
      height,
      seed: Math.floor(Math.random() * 999999),
    });

    return NextResponse.json({
      success: true,
      banner: {
        ...bannerData,
        imageUrl,
      },
    });
  } catch (error: any) {
    console.error('Error generando contenido de banner:', error);
    return NextResponse.json(
      { error: 'Error al generar creatividad para banner.', detalle: error.message },
      { status: 500 }
    );
  }
}
