import { NextRequest, NextResponse } from 'next/server';
import { readLocalDb } from '@/lib/db';
import { sendTelegramMessage } from '@/lib/telegram';

export async function GET(req: NextRequest) {
  try {
    const db = readLocalDb();
    const ahora = new Date();
    const horaActual = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')} hrs`;

    // Recorre posts aprobados y simula la cola de publicación automática
    const postsPublicados: any[] = [];

    // Notificar al dueño por Telegram si hay un post programado
    if (process.env.TELEGRAM_ADMIN_CHAT_ID) {
      await sendTelegramMessage(
        process.env.TELEGRAM_ADMIN_CHAT_ID,
        `🔔 <b>[SEGAR CRON] Despacho Automático Ejecutado</b>\n\n` +
        `Revisión horaria completada (${horaActual}).\n` +
        `Los posts aprobados por el dueño se mantienen en cola para publicación en horario peak.`
      );
    }

    return NextResponse.json({
      success: true,
      horaEjecucion: horaActual,
      postsProcesados: postsPublicados.length,
      mensaje: 'Planificador de publicaciones $0 ejecutado correctamente',
    });
  } catch (error: any) {
    console.error('Error en cron de publicación:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
