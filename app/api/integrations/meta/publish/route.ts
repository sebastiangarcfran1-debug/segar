import { NextRequest, NextResponse } from 'next/server';
import { publishToMeta } from '@/lib/autopublisher';
import { getAutoPublishLogs, readLocalDb, writeLocalDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  const userId = session?.userId || 'demo_user';
  const logs = getAutoPublishLogs(userId);

  const db = readLocalDb();
  const user = db.users[userId] || {};

  return NextResponse.json({
    logs,
    config: {
      autoPublishEnabled: user.autoPublishEnabled || false,
      hasMetaToken: Boolean(user.metaAccessToken),
      instagramAccountId: user.metaInstagramAccountId || '',
      facebookPageId: user.metaPageId || '',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    const userId = session?.userId || 'demo_user';

    const body = await req.json();
    const { action, platform = 'instagram', caption, imageUrl, settings } = body;

    // Acción de guardar configuración
    if (action === 'guardar_config') {
      const db = readLocalDb();
      if (!db.users[userId]) {
        db.users[userId] = {
          userId,
          plan: 'pro',
          postsUsados: 0,
          anunciosUsados: 0,
          closerRespuestasUsadas: 0,
          periodoInicio: new Date().toISOString(),
          activo: true,
          origenPago: 'flow_webpay',
        };
      }

      db.users[userId] = {
        ...db.users[userId],
        autoPublishEnabled: settings?.autoPublishEnabled,
        metaAccessToken: settings?.metaAccessToken?.trim(),
        metaInstagramAccountId: settings?.metaInstagramAccountId?.trim(),
        metaPageId: settings?.metaPageId?.trim(),
      };

      writeLocalDb(db);
      return NextResponse.json({ success: true, message: 'Configuración de Meta guardada exitosamente' });
    }

    // Acción de publicar post en vivo
    if (!caption) {
      return NextResponse.json({ error: 'El caption o copy del post es requerido' }, { status: 400 });
    }

    const result = await publishToMeta({
      userId,
      platform,
      caption,
      imageUrl: imageUrl || 'https://image.pollinations.ai/prompt/chilean%20boutique%20product%20commercial%20advertising?width=1080&height=1080&nologo=true',
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error en /api/integrations/meta/publish:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
