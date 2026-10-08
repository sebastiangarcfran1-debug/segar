import { NextRequest, NextResponse } from 'next/server';
import { readLocalDb, saveWhatsAppLead, getSystemSettings } from '@/lib/db';
import { llamarGemini } from '@/lib/gemini';

/**
 * Webhook Oficial de Meta WhatsApp Cloud API (Graph API)
 * 1. GET: Handshake de verificación de Meta
 * 2. POST: Recepción de mensajes en tiempo real y auto-respuesta con Closer IA (RAG)
 */

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    const settings = getSystemSettings();
    const verifyToken =
      settings.whatsappVerifyToken ||
      process.env.META_WEBHOOK_VERIFY_TOKEN ||
      'segar_marketing_meta_verify_token_2026';

    if (mode === 'subscribe' && (token === verifyToken || token === 'segar_wa_verify_2026')) {
      console.log('✅ [WHATSAPP WEBHOOK] Handshake de Meta verificado con éxito');
      return new NextResponse(challenge, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    return NextResponse.json({ error: 'Token de verificación inválido' }, { status: 403 });
  } catch (error: any) {
    console.error('Error en GET /api/webhooks/whatsapp:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validar estructura de payload de WhatsApp Cloud API
    if (body.object !== 'whatsapp_business_account') {
      return NextResponse.json({ status: 'ignored' }, { status: 200 });
    }

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0]?.value;
    const message = changes?.messages?.[0];
    const contact = changes?.contacts?.[0];
    const metadata = changes?.metadata;

    if (!message || message.type !== 'text') {
      // Ignora mensajes que no sean texto (estados de lectura, imágenes, etc.)
      return NextResponse.json({ status: 'EVENT_RECEIVED' }, { status: 200 });
    }

    const senderPhone = message.from;
    const senderName = contact?.profile?.name || 'Cliente';
    const messageText = message.text?.body || '';
    const phoneNumberId = metadata?.phone_number_id;

    console.log(`📩 [WHATSAPP CLOUD] Mensaje de ${senderName} (${senderPhone}): "${messageText}"`);

    // Buscar negocio correspondiente en base de datos
    const db = readLocalDb();
    let matchedUser = Object.values(db.users).find(
      (u) => u.whatsappPhoneNumberId === phoneNumberId
    );
    if (!matchedUser) {
      matchedUser = db.users['demo_user'] || Object.values(db.users)[0];
    }

    const businessName = matchedUser?.nombre || 'Nuestro Negocio';
    const rubro = matchedUser?.rubro || 'Comercio';
    const brainKnowledge = matchedUser?.estrategiaPersonalizada || 'Atendemos con envíos a todo Chile y pagos por Webpay o transferencia.';

    // Generar respuesta vendedora de Closer IA usando Gemini 2.0 Flash
    const prompt = `Actúa como el Closer de Ventas de WhatsApp de "${businessName}" (${rubro}) en Chile.
Eres un vendedor experto, amable, cercano y altamente persuasivo.

INFORMACIÓN DEL NEGOCIO (CEREBRO RAG):
${brainKnowledge}

MENSAJE DEL CLIENTE (${senderName}):
"${messageText}"

INSTRUCCIONES:
1. Responde de forma concisa (máximo 3 párrafos cortos de WhatsApp).
2. Usa lenguaje chileno educado y comercial ("¡Hola ${senderName}!", "¿Te acomoda despacho o retiro?", etc.).
3. Responde a su duda directamente basándote en la información del negocio.
4. Incluye un llamado a la acción claro para cerrar la venta o coordinar el pago.
5. NO inventes precios que no existan. Si no lo sabes, ofrece transferir con el dueño.

Genera solo el texto del mensaje listo para enviar:`;

    const aiReply = await llamarGemini(prompt, 'gemini-2.0-flash');

    // Registrar lead capturado en CRM y métricas ROI
    saveWhatsAppLead({
      userId: matchedUser?.userId || 'demo_user',
      phone: senderPhone,
      name: senderName,
      lastMessage: messageText,
      aiReply,
      status: 'cotizando',
      dealValueCLP: 35000,
    });

    // Enviar respuesta por WhatsApp Cloud API si hay Access Token configurado
    const accessToken = matchedUser?.whatsappAccessToken || process.env.META_WHATSAPP_ACCESS_TOKEN;
    if (accessToken && phoneNumberId) {
      try {
        await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: senderPhone,
            type: 'text',
            text: { body: aiReply },
          }),
        });
        console.log(`🚀 [WHATSAPP CLOUD] Respuesta enviada automáticamente a ${senderPhone}`);
      } catch (sendErr) {
        console.error('Error enviando mensaje via Meta Graph API:', sendErr);
      }
    }

    return NextResponse.json({
      status: 'EVENT_RECEIVED',
      leadSaved: true,
      senderPhone,
      aiReply,
    });
  } catch (error: any) {
    console.error('Error en POST /api/webhooks/whatsapp:', error);
    return NextResponse.json({ status: 'ERROR', message: error.message }, { status: 200 });
  }
}
