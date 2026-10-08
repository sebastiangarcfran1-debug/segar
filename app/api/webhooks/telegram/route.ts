import { NextRequest, NextResponse } from 'next/server';
import { handleTelegramUpdate } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const result = await handleTelegramUpdate(body);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Error en webhook de Telegram:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Telegram Webhook endpoint online' });
}
