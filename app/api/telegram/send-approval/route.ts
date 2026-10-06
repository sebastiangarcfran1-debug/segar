import { NextRequest, NextResponse } from 'next/server';
import { sendPostApprovalRequest } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, negocioNombre, dia, copy, imagenUrl, horaRecomendada, chatId } = body;

    const result = await sendPostApprovalRequest({
      postId: postId || 'post_demo_1',
      negocioNombre: negocioNombre || 'Mi Tienda Chile',
      dia: dia || 1,
      copy: copy || 'Nuevo post generado con Segar AI',
      imagenUrl: imagenUrl || 'https://image.pollinations.ai/prompt/chilean%20coffee%20shop%20commercial%20product?width=1080&height=1080',
      horaRecomendada: horaRecomendada || '19:30 hrs',
      chatId,
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Error enviando aprobación a Telegram:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
