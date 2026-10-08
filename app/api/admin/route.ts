import { NextRequest, NextResponse } from 'next/server';
import {
  readLocalDb,
  writeLocalDb,
  upsertClient,
  deleteClient,
  adjustCredits,
  activateUserSubscription,
  extendUserSubscription,
  setUserSubscriptionStatus,
  checkSubscriptionsExpiration,
  getSystemSettings,
  updateSystemSettings,
  ClientRecord,
} from '@/lib/db';
import { PlanType, PLANES } from '@/lib/credits';
import { llamarGemini } from '@/lib/gemini';
import {
  testTelegramConnection,
  sendTelegramMessage,
  notifyTelegramSubscriptionExpiredOrCancelled,
} from '@/lib/telegram';
import { testFlowConnection } from '@/lib/flow';
import { getSessionFromRequest } from '@/lib/auth';

function verifyAdminAuth(req: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_PASSWORD || 'segar2026';
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();
  const customKey = req.headers.get('x-admin-key') || '';

  if (token === adminSecret || customKey === adminSecret) {
    return true;
  }

  // Verificar sesión JWT con rol 'admin'
  const session = getSessionFromRequest(req);
  if (session && session.role === 'admin') {
    return true;
  }

  return false;
}

export async function GET(req: NextRequest) {
  // Verificación de seguridad estricta
  if (!verifyAdminAuth(req)) {
    return NextResponse.json(
      { error: 'Acceso denegado: Se requiere rol de Administrador o clave maestra de Super Admin' },
      { status: 401 }
    );
  }

  const db = readLocalDb();

  // Calcular MRR real
  let mrrCLP = 0;
  Object.values(db.users).forEach((u) => {
    if (u.activo) {
      mrrCLP += PLANES[u.plan]?.precioCLP || 0;
    }
  });

  return NextResponse.json({
    authorized: true,
    users: Object.values(db.users),
    teamMembers: db.teamMembers,
    transactions: db.transactions,
    settings: getSystemSettings(),
    metrics: {
      ...db.metrics,
      mrrCLP,
      mrrUSD: Math.round(mrrCLP / 900),
      totalUsuariosActivos: Object.values(db.users).filter((u) => u.activo).length,
      totalClientes: Object.keys(db.users).length,
      geminiFreeTierRestante: Math.max(0, 1500 - db.metrics.totalGeminiCalls),
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, key } = body;

    const adminSecret = process.env.ADMIN_PASSWORD || 'segar2026';

    // Acción de inicio de sesión / validación de credencial maestra
    if (action === 'login') {
      if (key === adminSecret) {
        const db = readLocalDb();
        return NextResponse.json({
          success: true,
          token: adminSecret,
          message: 'Autenticación exitosa como Super Administrador',
          teamMembers: db.teamMembers,
        });
      }
      return NextResponse.json(
        { error: 'Clave maestra incorrecta. Solo personal autorizado de Segar AI.' },
        { status: 401 }
      );
    }

    // Activación de suscripción post-checkout (llamado desde checkout/success)
    if (action === 'activar_transferencia') {
      const { userId = 'demo_user', plan = 'pro' } = body;
      const planInfo = PLANES[plan as PlanType] || PLANES.pro;
      const client = activateUserSubscription(
        userId,
        plan as PlanType,
        'transferencia',
        planInfo.precioCLP,
        { estadoPago: 'al_dia', activo: true }
      );
      return NextResponse.json({ success: true, client, message: 'Transferencia activada con éxito' });
    }

    // Para todas las demás acciones de administración, verificar autenticación
    if (!verifyAdminAuth(req) && body.adminKey !== adminSecret) {
      return NextResponse.json(
        { error: 'Acceso no autorizado: Token de Super Admin inválido o expirado' },
        { status: 401 }
      );
    }

    // 1. Crear nuevo cliente manual o por transferencia
    if (action === 'crear_cliente') {
      const {
        userId,
        nombre,
        email,
        telefono,
        rubro,
        instagram,
        plan,
        metodoPago,
        montoCLP,
        notasEquipo,
        estrategiaPersonalizada,
      } = body;

      if (!userId || !nombre) {
        return NextResponse.json({ error: 'Faltan campos obligatorios (userId, nombre)' }, { status: 400 });
      }

      const client = upsertClient({
        userId: userId.trim().toLowerCase().replace(/\s+/g, '_'),
        nombre: nombre.trim(),
        email: email?.trim(),
        telefono: telefono?.trim(),
        rubro: rubro?.trim(),
        instagram: instagram?.trim(),
        plan: (plan as PlanType) || 'emprendedor',
        origenPago: metodoPago || 'copec_pay',
        notasEquipo: notasEquipo || 'Cliente agregado manualmente por el Super Administrador.',
        estrategiaPersonalizada: estrategiaPersonalizada || '',
        activo: true,
        estadoPago: 'al_dia',
        postsUsados: 0,
        closerRespuestasUsadas: 0,
        anunciosUsados: 0,
      });

      // Registrar transacción si aplica
      const db = readLocalDb();
      if (montoCLP && Number(montoCLP) > 0) {
        db.transactions.push({
          id: `trx_manual_${Date.now()}`,
          userId: client.userId,
          plan: client.plan,
          montoCLP: Number(montoCLP),
          metodo: metodoPago || 'copec_pay',
          estado: 'approved',
          fecha: new Date().toISOString(),
        });
        db.metrics.totalRevenueCLP += Number(montoCLP);
        writeLocalDb(db);
      }

      return NextResponse.json({ success: true, client, message: 'Cliente registrado exitosamente' });
    }

    // 2. Modificar cliente existente
    if (action === 'modificar_cliente') {
      const { userId, updates } = body;
      if (!userId || !updates) {
        return NextResponse.json({ error: 'Faltan parámetros de actualización' }, { status: 400 });
      }

      const updated = upsertClient({
        ...updates,
        userId,
      });

      return NextResponse.json({ success: true, client: updated, message: 'Cliente actualizado' });
    }

    // 3. Eliminar cliente
    if (action === 'eliminar_cliente') {
      const { userId } = body;
      const deleted = deleteClient(userId);
      if (!deleted) {
        return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: `Cliente ${userId} eliminado` });
    }

    // 4. Ajustar créditos (sumar o restar posts y closer)
    if (action === 'ajustar_creditos') {
      const { userId, postsDelta, closerDelta } = body;
      const updated = adjustCredits(userId, Number(postsDelta) || 0, Number(closerDelta) || 0);
      if (!updated) {
        return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
      }
      return NextResponse.json({ success: true, client: updated, message: 'Créditos ajustados correctamente' });
    }

    // 5. Generar Estrategia VIP Personalizada con IA (Modo Concierge)
    if (action === 'generar_estrategia_ia') {
      const { userId, rubro, nombre, focoVentas, tono } = body;
      const prompt = `Actúa como Director Senior de Estrategia de Segar AI Marketing. Diseña una ESTRATEGIA MAESTRA VIP de 30 días para un cliente prioritario de nuestro servicio concierge:
- Negocio: ${nombre || 'Negocio Pyme'}
- Rubro: ${rubro || 'Comercio'}
- Foco de ventas solicitado: ${focoVentas || 'Aumentar ventas de ticket medio y conseguir leads calificados'}
- Tono de marca: ${tono || 'Cercano, profesional y persuasivo'}

Genera un plan accionable estructurado en:
1. PROPUESTA DE VALOR Y GANCHO VIRAL ÚNICO.
2. LOS 4 PILARES DE CONTENIDO DEL MES (Educación, Demostración de producto, Prueba social/Testimonios, Ofertas de escasez).
3. GUION DE OFERTA IRRESISTIBLE PARA WHATSAPP (Especial para el Closer IA).
4. RECOMENDACIÓN DE PAUTA / ANUNCIO FLASH EN META ADS (Presupuesto sugerido de bajo costo para Chile/LATAM).

Responde en español de Chile, directo, altamente profesional y sin rodeos.`;

      const estrategia = await llamarGemini(prompt, 'gemini-2.0-flash');

      // Guardar automáticamente en la ficha del cliente
      if (userId) {
        upsertClient({
          userId,
          estrategiaPersonalizada: estrategia,
        });
      }

      return NextResponse.json({ success: true, estrategia });
    }

    // 6a. Activar cuenta manualmente (+30 Días)
    if (action === 'activar_cuenta') {
      const { userId } = body;
      const updated = extendUserSubscription(userId, 30);
      if (!updated) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
      }
      return NextResponse.json({ success: true, client: updated, message: 'Cuenta activada por 30 días adicionales' });
    }

    // 6b. Pausar cuenta
    if (action === 'pausar_cuenta') {
      const { userId } = body;
      const updated = setUserSubscriptionStatus(userId, false, 'inactivo');
      if (!updated) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
      }
      try {
        await notifyTelegramSubscriptionExpiredOrCancelled({
          email: updated.email || userId,
          nombre: updated.nombre,
          plan: updated.plan,
          reason: 'suspendida',
        });
      } catch (tgErr) {
        console.error('Error notificando suspensión Telegram:', tgErr);
      }
      return NextResponse.json({ success: true, client: updated, message: 'Cuenta pausada exitosamente' });
    }

    // 6c. Suspender / Expirar cuenta
    if (action === 'suspender_cuenta') {
      const { userId } = body;
      const updated = setUserSubscriptionStatus(userId, false, 'expirado');
      if (!updated) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
      }
      try {
        await notifyTelegramSubscriptionExpiredOrCancelled({
          email: updated.email || userId,
          nombre: updated.nombre,
          plan: updated.plan,
          reason: 'expirada',
        });
      } catch (tgErr) {
        console.error('Error notificando expiración Telegram:', tgErr);
      }
      return NextResponse.json({ success: true, client: updated, message: 'Cuenta marcada como expirada' });
    }

    // 6d. Alternar estado activo / pausado
    if (action === 'toggle_activo') {
      const { userId } = body;
      const db = readLocalDb();
      const user = db.users[userId];
      if (user) {
        user.activo = !user.activo;
        user.estadoPago = user.activo ? 'al_dia' : 'inactivo';
        writeLocalDb(db);
        if (!user.activo) {
          try {
            await notifyTelegramSubscriptionExpiredOrCancelled({
              email: user.email || userId,
              nombre: user.nombre,
              plan: user.plan,
              reason: 'suspendida',
            });
          } catch {}
        }
        return NextResponse.json({ success: true, estado: user.activo, client: user });
      }
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // 6e. Revisar expiraciones automáticas y alertar por Telegram
    if (action === 'revisar_expiraciones') {
      const { expiredUsers } = checkSubscriptionsExpiration();
      for (const u of expiredUsers) {
        try {
          await notifyTelegramSubscriptionExpiredOrCancelled({
            email: u.email || u.userId,
            nombre: u.nombre,
            plan: u.plan,
            reason: 'expirada',
          });
        } catch (tgErr) {
          console.error('Error notificando expiración por Telegram:', tgErr);
        }
      }
      return NextResponse.json({
        success: true,
        expirados: expiredUsers.length,
        users: expiredUsers,
        message: `${expiredUsers.length} cuentas procesadas como expiradas y notificadas a Telegram.`,
      });
    }

    // 7. Guardar Configuración de Integraciones (Telegram & Flow)
    if (action === 'guardar_config') {
      const { settings } = body;
      if (!settings) {
        return NextResponse.json({ error: 'Faltan parámetros de configuración' }, { status: 400 });
      }
      const updated = updateSystemSettings(settings);
      return NextResponse.json({ success: true, settings: updated, message: 'Configuración guardada exitosamente' });
    }

    // 8. Probar conexión en vivo con Telegram
    if (action === 'probar_telegram') {
      const { token, chatId } = body;
      const result = await testTelegramConnection(token, chatId);
      return NextResponse.json(result);
    }

    // 9. Probar conexión en vivo con Flow.cl
    if (action === 'probar_flow') {
      const { apiKey, secretKey, env } = body;
      const result = await testFlowConnection(apiKey, secretKey, env);
      return NextResponse.json(result);
    }

    // 10. Simular notificación de venta por Telegram
    if (action === 'simular_venta_telegram') {
      const { chatId } = body;
      const settings = getSystemSettings();
      const targetChatId = chatId || settings.telegramChatId;
      if (!targetChatId) {
        return NextResponse.json({ success: false, error: 'Configura y guarda tu Chat ID primero.' });
      }
      const tgRes = await sendTelegramMessage(
        targetChatId,
        `💰 <b>[PRUEBA EN VIVO] ¡NUEVA VENTA EN SEGAR AI!</b>\n\n` +
        `👤 <b>Cliente:</b> Camila Vergara (Boutique Santiago)\n` +
        `💎 <b>Membresía:</b> Plan Pro Mensual ($29.900 CLP)\n` +
        `💳 <b>Pasarela:</b> Flow.cl / Webpay Plus (Aprobado)\n` +
        `📱 <b>WhatsApp Cliente:</b> +56 9 9184 2110\n\n` +
        `🚀 <i>¡Tu bot de Telegram está 100% operativo y conectado a tu celular!</i>`
      );
      const isOk = tgRes && tgRes.ok !== false;
      return NextResponse.json({
        success: isOk,
        message: isOk
          ? '¡Mensaje simulado enviado con éxito a tu Telegram! Revisa tu celular.'
          : (tgRes?.description || 'Error al enviar a Telegram'),
      });
    }

    return NextResponse.json({ error: 'Acción no reconocida en el Super Panel' }, { status: 400 });
  } catch (err: any) {
    console.error('Error en API Super Admin:', err);
    return NextResponse.json({ error: err.message || 'Error interno del servidor' }, { status: 500 });
  }
}
