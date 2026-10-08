import { NextRequest, NextResponse } from 'next/server';
import { checkSubscriptionsExpiration } from '@/lib/db';
import { notifyTelegramSubscriptionExpiredOrCancelled } from '@/lib/telegram';

export async function GET(req: NextRequest) {
  try {
    const { expiredUsers } = checkSubscriptionsExpiration();

    for (const user of expiredUsers) {
      try {
        await notifyTelegramSubscriptionExpiredOrCancelled({
          email: user.email || user.userId,
          nombre: user.nombre,
          plan: user.plan,
          reason: 'expirada',
        });
      } catch (tgErr) {
        console.error('Error enviando notificación de expiración por Telegram:', tgErr);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      usuariosExpirados: expiredUsers.length,
      detalle: expiredUsers.map((u) => ({ userId: u.userId, email: u.email })),
      mensaje: 'Auditoría automática de suscripciones completada con éxito',
    });
  } catch (error: any) {
    console.error('Error en cron de expiración de suscripciones:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
