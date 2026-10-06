import { NextRequest, NextResponse } from 'next/server';
import { runSalesCloserAI } from '@/lib/gemini';

const META_VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || 'segar_marketing_meta_verify_token_2026';
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

// 1. Verificación obligatoria de Meta para activar el Webhook
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === META_VERIFY_TOKEN) {
    console.log('✅ Webhook de Meta (WhatsApp / Instagram / FB) verificado con éxito');
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Token de verificación inválido' }, { status: 403 });
}

// 2. Recepción de mensajes entrantes de WhatsApp Cloud API e Instagram Direct
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('📩 Mensaje recibido en Webhook Meta:', JSON.stringify(body).slice(0, 300));

    // Detección de mensaje de WhatsApp Cloud API
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0]?.value;
    const message = changes?.messages?.[0];

    if (message && message.type === 'text') {
      const fromNumber = message.from;
      const text = message.text.body;

      console.log(`💬 WhatsApp de ${fromNumber}: "${text}"`);

      // Generar respuesta con el Closer de Ventas
      const respuestaCloser = await runSalesCloserAI({
        mensajeCliente: text,
        nombreNegocio: 'Segar AI Cliente',
        catalogoYPrecios: 'Productos con garantía y envíos rápidos a todo Chile.',
      });

      // Si hay credenciales de WhatsApp Cloud API, enviar respuesta directa
      if (WHATSAPP_ACCESS_TOKEN && WHATSAPP_PHONE_NUMBER_ID) {
        await fetch(`https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: fromNumber,
            type: 'text',
            text: { body: respuestaCloser },
          }),
        });
      }
    }

    return NextResponse.json({ status: 'EVENT_RECEIVED' }, { status: 200 });
  } catch (error: any) {
    console.error('Error procesando webhook de Meta:', error);
    return NextResponse.json({ status: 'ERROR', error: error.message }, { status: 200 });
  }
}
