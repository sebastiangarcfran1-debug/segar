import { NextRequest, NextResponse } from 'next/server';
import { handleTelegramUpdate } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    const result = await handleTelegramUpdate(update);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error en webhook de Telegram:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Telegram Bot Webhook online' });
}
