import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';
import { generatePollinationsImageUrl } from '@/lib/pollinations';
import { publishToInstagram, publishToFacebookPage } from '@/lib/metaPublisher';
import { sendTelegramMessage } from '@/lib/telegram';

export async function GET(req: NextRequest) {
  return handleAutoPromotion();
}

export async function POST(req: NextRequest) {
  return handleAutoPromotion();
}

async function handleAutoPromotion() {
  try {
    const ahora = new Date();
    const fechaChile = ahora.toLocaleDateString('es-CL');

    // 1. Gemini genera el tip de alto valor y venta del día
    const prompt = `Eres el Director de Crecimiento de SEGAR AI MARKETING (Asistente de Marketing Digital para pymes en Chile y Latinoamérica por $15.000 a $29.900 CLP/mes).
Genera un post persuasivo para publicar HOY en el Instagram y Facebook oficial de Segar AI Marketing.
Requisitos:
- Gancho potente en los primeros 2 segundos (ataca el dolor de pagar sueldos de agencia de $350.000 CLP o perder ventas por responder tarde en WhatsApp).
- Entrega 1 tip real de marketing digital aplicable de inmediato.
- Cierra con llamado a la acción claro para probar Segar AI con link en bio o comentando 'PROBAR'.
- Incluye 5 hashtags chilenos y latam (#PymesChile #EmprendedoresChile #MarketingDigitalChile #VentasChile #SegarAI).

Devuelve SOLO un JSON con este formato exacto sin markdown:
{
  "tema": "Título del tip",
  "copy": "Texto completo del post con emojis y saltos de línea...",
  "promptImagen": "modern commercial photography of entrepreneur smiling looking at mobile phone receiving sales, cinematic lighting, 8k"
}`;

    const geminiRes = await callGemini(prompt);
    let postData: { tema: string; copy: string; promptImagen: string };

    try {
      const cleanJson = geminiRes.replace(/```json/g, '').replace(/```/g, '').trim();
      postData = JSON.parse(cleanJson);
    } catch {
      postData = {
        tema: '¿Por qué las pymes pierden el 70% de sus ventas en WhatsApp?',
        copy: `¿Sabías que responder un mensaje después de 15 minutos reduce tus posibilidades de venta en un 80%? 🚨\n\nEn Chile la gente compra por impulso. Si tu prospecto pregunta precio a las 23:00 hrs y le respondes a las 10:00 am del día siguiente, ya le compró a tu competencia.\n\n💡 EL TIP DE HOY: Automatiza tu primer contacto. No necesitas contratar un vendedor de noche.\n\nCon SEGAR AI activas un Closer de Ventas que atiende tu WhatsApp e Instagram 24/7, conoce tus precios y pasa el link de pago al instante.\n\nTodo desde solo $15.000 CLP al mes. Sin amarras.\n\n👉 Comenta 'VENTAS' o toca el enlace en nuestra bio para probar la auditoría gratis de tu negocio.\n\n#PymesChile #EmprendedoresChile #MarketingChile #Santiago #SegarAI`,
        promptImagen: 'modern sleek smartphone showing message notification, high end minimalist studio lighting, 8k'
      };
    }

    // 2. Generar imagen publicitaria con Pollinations.ai (Flux)
    const seed = Math.floor(Math.random() * 999999);
    const imageUrl = generatePollinationsImageUrl(postData.promptImagen, {
      seed,
      width: 1080,
      height: 1080,
      model: 'flux',
    });

    // 3. Publicar automáticamente en Instagram y Facebook
    const igResult = await publishToInstagram({
      imageUrl,
      caption: postData.copy,
    });

    const fbResult = await publishToFacebookPage({
      imageUrl,
      message: postData.copy,
    });

    // 4. Notificar al dueño por Telegram del post autopromocionado
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (adminChatId) {
      await sendTelegramMessage(
        adminChatId,
        `🤖 <b>[PILOTO AUTOMÁTICO SEGAR AI] Post Publicado Hoy</b>\n\n` +
        `📌 <b>Tema:</b> ${postData.tema}\n` +
        `📅 <b>Fecha:</b> ${fechaChile}\n\n` +
        `📷 <b>Instagram:</b> ${igResult.mock ? 'Modo Simulado (Configura credenciales en .env)' : '✅ Publicado'}\n` +
        `📘 <b>Facebook:</b> ${fbResult.mock ? 'Modo Simulado' : '✅ Publicado'}\n\n` +
        `<i>El sistema continuará publicando todos los días para atraer las 250 membresías de Segar AI.</i>`
      );
    }

    return NextResponse.json({
      success: true,
      fecha: fechaChile,
      tema: postData.tema,
      copy: postData.copy,
      imageUrl,
      publicaciones: {
        instagram: igResult,
        facebook: fbResult,
      },
    });
  } catch (error: any) {
    console.error('Error en autopromoción automática:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error en piloto automático' },
      { status: 500 }
    );
  }
}
