import { NextRequest, NextResponse } from 'next/server';
import { handleMercadoPagoWebhook } from '@/lib/mercadopago';

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const body = await req.json().catch(() => ({}));
    
    // Mercado Pago envía parámetros tanto en query string (?topic=payment&id=123) como en body
    const topic = url.searchParams.get('topic') || url.searchParams.get('type') || body.type || body.topic;
    const paymentId = url.searchParams.get('id') || url.searchParams.get('data.id') || body.data?.id || body.id;

    const payload = {
      type: topic,
      id: paymentId,
      ...body,
    };

    const processed = await handleMercadoPagoWebhook(payload);
    return NextResponse.json({ received: true, processed });
  } catch (error: any) {
    console.error('Error en webhook de Mercado Pago:', error);
    // Mercado Pago exige responder 200 para no reenviar infinitamente la notificación
    return NextResponse.json({ received: true, error: error.message }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Mercado Pago Webhook endpoint online' });
}
