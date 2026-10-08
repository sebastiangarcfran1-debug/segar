import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';
import { verificarCreditos, descontarCreditos } from '@/lib/credits';

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
    const creds = await verificarCreditos('posts');
    if (!creds.permitido) {
      return NextResponse.json(
        { error: 'Has alcanzado el límite de créditos de contenido de tu plan.' },
        { status: 403 }
      );
    }

    const { rubro, producto, objetivo, estilo, publico } = await req.json();

    const prompt = `Actúa como el mejor director creativo de anuncios de video verticales (Reels, TikTok, YouTube Shorts) del mundo, especializado en marketing directo, psicología de retención y ventas para PYMEs.

INFORMACIÓN DEL NEGOCIO:
- Rubro: ${rubro || 'General'}
- Producto o Servicio Estrella: ${producto || 'Oferta Principal'}
- Objetivo: ${objetivo || 'Generar ventas inmediatas y mensajes en WhatsApp'}
- Estilo: ${estilo || 'Dinámico, directo y de alto impacto'}
- Público Objetivo: ${publico || 'Dueños de casa, profesionales y compradores locales en Chile/Latinoamérica'}

Crea un GUION DE VIDEO VERTICAL (9:16) DE ALTA CONVERSIÓN (duración 30 a 45 segundos).
Debes responder ESTRICTAMENTE en formato JSON válido con la siguiente estructura:
{
  "titulo": "Título de la campaña",
  "duracionEstimada": "35 segundos",
  "ganchoVisual": "Descripción exacta de los primeros 3 segundos en pantalla",
  "ganchoAuditivo": "Frase de impacto que detiene el scroll de inmediato",
  "escenas": [
    {
      "numero": 1,
      "segundos": "0-3s",
      "visual": "Qué se ve en pantalla (ángulo de cámara, expresión, acción)",
      "textoPantalla": "PALABRAS EN AMARILLO/BLANCO ESTILO HORMOZI",
      "locucion": "Texto exacto que dice la voz en off",
      "emocion": "Curiosidad extrema"
    },
    {
      "numero": 2,
      "segundos": "4-12s",
      "visual": "Muestra del problema o dolor común del cliente",
      "textoPantalla": "EL ERROR QUE TODOS COMETEN",
      "locucion": "Explicación del dolor sin rodeos",
      "emocion": "Frustración / Identificación"
    },
    {
      "numero": 3,
      "segundos": "13-25s",
      "visual": "Presentación del producto resolviendo el problema con demostración",
      "textoPantalla": "LA SOLUCIÓN EXACTA",
      "locucion": "Por qué este producto es diferente y cómo cambia su vida",
      "emocion": "Alivio y Deseo de compra"
    },
    {
      "numero": 4,
      "segundos": "26-35s",
      "visual": "Llamado a la acción claro con indicación de tocar el enlace o enviar WhatsApp",
      "textoPantalla": "OFERTA VÁLIDA HOY • COMENTA O ENVÍA WHATSAPP",
      "locucion": "Llamado a la acción directo con escasez o garantía",
      "emocion": "Urgencia y Acción"
    }
  ],
  "promptImagenEscenaPrincipal": "Prompt en inglés para generar la miniatura del video con IA (estilo cinematográfico hiperrealista)",
  "consejosProduccion": [
    "Consejo 1 de iluminación o audio",
    "Consejo 2 de música de fondo en tendencia",
    "Consejo 3 de llamada a la acción en descripción"
  ]
}

Responde ÚNICAMENTE con el objeto JSON, sin comentarios ni markdown adicional.`;

    const respuestaIA = await callGemini(prompt);
    let data = extractJson(respuestaIA);

    if (!data) {
      data = {
        titulo: `Campaña de Alta Retención: ${producto || 'Oferta Estrella'}`,
        duracionEstimada: '35 segundos',
        ganchoVisual: 'Primer plano dinámico en cámara lenta mostrando el problema cotidiano que todos sufren.',
        ganchoAuditivo: `¡Si estás en Chile y buscas ${producto || 'la mejor opción'}, detén el scroll 30 segundos!`,
        escenas: [
          {
            numero: 1,
            segundos: '0-3s',
            visual: 'Toma rápida de impacto deteniendo el dedo del usuario con zoom dinámico.',
            textoPantalla: '¡DETÉN EL SCROLL! 🛑',
            locucion: `Si buscas ${producto || 'el mejor servicio'} garantizado, mira esto antes de comprar.`,
            emocion: 'Curiosidad extrema',
          },
          {
            numero: 2,
            segundos: '4-12s',
            visual: 'Muestra del dolor común y la frustración que viven las personas con otras alternativas.',
            textoPantalla: 'EL ERROR MÁS COSTOSO',
            locucion: 'La mayoría de la gente gasta de más y recibe una mala experiencia.',
            emocion: 'Frustración y empatía',
          },
          {
            numero: 3,
            segundos: '13-25s',
            visual: 'Demostración de nuestro producto en acción resolviendo el problema con facilidad.',
            textoPantalla: 'LA SOLUCIÓN DEFINITIVA',
            locucion: 'Con nosotros tienes atención inmediata, calidad premium y garantía real.',
            emocion: 'Deseo de compra',
          },
          {
            numero: 4,
            segundos: '26-35s',
            visual: 'Pantalla con botón de WhatsApp y oferta de tiempo limitado.',
            textoPantalla: 'PIDE POR WHATSAPP HOY 📲',
            locucion: 'Cupos limitados con precio especial. Toca el enlace y escríbenos directamente a WhatsApp ahora mismo.',
            emocion: 'Urgencia y acción',
          },
        ],
        promptImagenEscenaPrincipal: `cinematic vertical commercial of ${producto || 'product'} high budget studio lighting 8k`,
        consejosProduccion: [
          'Mantén la cámara estable o usa paneos rápidos en los primeros 3 segundos.',
          'Usa música con beat marcado de fondo para mantener el ritmo.',
          'Coloca el llamado a la acción tanto en pantalla como en el pie del video.',
        ],
      };
    }

    await descontarCreditos('posts', 1);

    return NextResponse.json({ success: true, guion: data });
  } catch (error: any) {
    console.error('Error generando guion de video:', error);
    return NextResponse.json(
      { error: 'Error al generar guion de video. Intenta nuevamente.', detalle: error.message },
      { status: 500 }
    );
  }
}
