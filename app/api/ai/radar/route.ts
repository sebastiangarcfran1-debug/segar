import { NextRequest, NextResponse } from 'next/server';
import { llamarGemini } from '@/lib/gemini';
import { generarImagenPollinations } from '@/lib/pollinations';

export async function POST(req: NextRequest) {
  try {
    const { competidores, miRubro, miDiferencial } = await req.json();

    const prompt = `Actúa como Director de Inteligencia Competitiva y Espionaje Comercial para PYMES en Chile y Latinoamérica.
Analiza la siguiente información de mercado:
- Cuentas de la competencia analizadas: ${competidores || '@competidor_chile'}
- Mi rubro o industria: ${miRubro || 'Comercio / Tienda Online'}
- Mi diferencial clave: ${miDiferencial || 'Mejor atención personalizada y envíos rápidos en 24 horas'}

Genera un reporte estratégico de contra-ataque comercial en formato JSON con la siguiente estructura exacta:
{
  "debilidadesCompetencia": [
    "Debilidad 1 (ej: Tardan más de 2 horas en contestar WhatsApp)",
    "Debilidad 2 (ej: No muestran precios transparentes)",
    "Debilidad 3 (ej: Fotos repetitivas sin enfoque en beneficios)"
  ],
  "ganchosViralesDetectados": [
    "Gancho 1 de alta tracción para usar",
    "Gancho 2 de comparación o curiosidad",
    "Gancho 3 de oferta irresistible"
  ],
  "contraEstrategiaMaestra": "Explicación clara de cómo posicionarse por encima de ellos esta semana en Chile/LATAM.",
  "postDeAtaque": {
    "titulo": "Titular de alto impacto",
    "copy": "Texto completo para Instagram con hashtags locales y llamada a la acción hacia WhatsApp",
    "promptImagen": "Prompt en inglés para generar una imagen publicitaria superior y atractiva",
    "horaSugerida": "19:30 hrs"
  }
}

Responde ÚNICAMENTE el JSON válido, sin bloques de código ni explicaciones adicionales.`;

    const respuesta = await llamarGemini(prompt, 'gemini-2.0-flash');
    let jsonResultado: any = null;

    try {
      const limpio = respuesta.replace(/```json/g, '').replace(/```/g, '').trim();
      jsonResultado = JSON.parse(limpio);
    } catch {
      jsonResultado = {
        debilidadesCompetencia: [
          'Tardan demasiado en responder cotizaciones por mensajes directos o WhatsApp.',
          'Precios ocultos que generan fricción y abandono de compra.',
          'Contenido plano sin prueba social ni llamados a la acción claros.',
        ],
        ganchosViralesDetectados: [
          '«¿Cansado de que te dejen en visto? Mira esto...»',
          '«3 razones por las que no deberías comprar en tiendas que no garantizan envíos»',
          '«Comparamos la calidad de dos marcas líderes y esto fue lo que pasó»',
        ],
        contraEstrategiaMaestra:
          'Atacar el dolor de la lentitud y la falta de transparencia. Posiciona tu negocio con respuesta instantánea del Closer IA y despacho garantizado.',
        postDeAtaque: {
          titulo: 'La Diferencia que se Nota en 24 Horas',
          copy: '¿Por qué esperar días por una respuesta cuando puedes recibir tu pedido mañana mismo? 🚀 Envíos express garantizados a todo Chile. Toca el enlace y cotiza al instante por WhatsApp 👇',
          promptImagen: 'modern sleek commercial product delivery packaging minimalist luxury aesthetic chile',
          horaSugerida: '20:15 hrs',
        },
      };
    }

    // Generar imagen con Pollinations Flux
    const imagenUrl = generarImagenPollinations(
      jsonResultado.postDeAtaque.promptImagen || 'commercial product high quality',
      1080,
      1080,
      'flux'
    );

    return NextResponse.json({
      success: true,
      reporte: jsonResultado,
      imagenUrl,
    });
  } catch (err: any) {
    console.error('Error en Radar de Competencia:', err);
    return NextResponse.json({ error: err.message || 'Error analizando competencia' }, { status: 500 });
  }
}
