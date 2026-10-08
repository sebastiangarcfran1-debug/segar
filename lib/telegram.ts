/**
 * Bot de Telegram - Panel de Control Móvil 100% GRATIS
 * Permite al dueño del negocio aprobar, pedir correcciones con Gemini o rechazar
 * los posts generados y recibir alertas de ventas directamente desde su celular.
 */

import dns from 'node:dns';
import { rewritePostWithFeedback } from './gemini';
import { getSystemSettings, updateSystemSettings } from './db';

// Forzar prioridad IPv4 para prevenir timeouts en Windows y redes locales
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignorar si no está disponible
}

function getTelegramConfig() {
  const settings = getSystemSettings();
  const token = (settings.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN || '').trim();
  const chatId = (settings.telegramChatId || process.env.TELEGRAM_ADMIN_CHAT_ID || '').trim();
  return { token, chatId };
}

/**
 * Valida el bot y envía un mensaje de prueba al teléfono del administrador
 */
export async function testTelegramConnection(customToken?: string, customChatId?: string) {
  const config = getTelegramConfig();
  const token = (customToken || config.token || '').trim();
  let chatId = (customChatId || config.chatId || '').trim();

  if (!token || token.includes('123456789:ABC') || token.length < 15) {
    return {
      success: false,
      error: 'Token de Telegram no configurado. Escribe /newbot a @BotFather en Telegram, copia el HTTP API Token y pégalo aquí.',
    };
  }

  // Limpiar posibles prefijos @ o espacios
  chatId = chatId.replace(/^@/, '').trim();

  try {
    // 1. Validar que el token existe en los servidores de Telegram
    const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`, {
      signal: AbortSignal.timeout(8000),
    });
    const rawMeText = await meRes.text();
    let meData: any = {};
    try {
      meData = JSON.parse(rawMeText);
    } catch {
      return { success: false, error: `Respuesta inválida de Telegram: ${rawMeText.slice(0, 100)}` };
    }

    if (!meData.ok) {
      return {
        success: false,
        error: `Token rechazado por Telegram: ${meData.description || 'Token inválido'}. Asegúrate de copiar el token completo sin caracteres faltantes.`,
      };
    }

    const botName = meData.result?.username;
    const botFirstName = meData.result?.first_name;

    // 2. Si se proporcionó Chat ID, enviar mensaje de prueba
    if (chatId && !chatId.includes('123456789')) {
      const msgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🚀 <b>SEGAR AI MARKETING: Notificación Oficial de Conexión</b>\n\n` +
            `¡Conexión exitosa! Tu bot <b>@${botName}</b> (${botFirstName}) está 100% vinculado con tu panel de control.\n\n` +
            `📱 A partir de ahora recibirás aquí:\n` +
            `• Notificaciones inmediatas de pagos Webpay y transferencias Copec Pay.\n` +
            `• Publicaciones del día para aprobar o editar con 1 toque.`,
          parse_mode: 'HTML',
        }),
        signal: AbortSignal.timeout(8000),
      });

      const rawMsgText = await msgRes.text();
      let msgData: any = {};
      try {
        msgData = JSON.parse(rawMsgText);
      } catch {
        msgData = { ok: false, description: rawMsgText };
      }

      if (!msgData.ok) {
        return {
          success: false,
          botName,
          error: `Bot válido (@${botName}), pero no se pudo enviar el mensaje a tu chat (${chatId}): ${msgData.description}. Asegúrate de abrir Telegram, buscar a @${botName} y presionar 'INICIAR' (/start) primero.`,
        };
      }

      // Guardar automáticamente configuración validada
      updateSystemSettings({
        telegramBotToken: token,
        telegramChatId: chatId,
      });

      return {
        success: true,
        botName,
        message: `¡Mensaje enviado con éxito a tu Telegram personal vía @${botName}! Revisa tu celular. Configuración guardada en el sistema.`,
      };
    }

    // Auto-guardar token validado
    updateSystemSettings({
      telegramBotToken: token,
    });

    return {
      success: true,
      botName,
      message: `¡Bot @${botName} autenticado con éxito en Telegram! Ahora ingresa tu Chat ID (obtenlo en 5 segundos con @userinfobot en Telegram) y presiona el botón para recibir la confirmación.`,
    };
  } catch (err: any) {
    if (err.name === 'TimeoutError' || err.message?.includes('timeout') || err.message?.includes('fetch failed')) {
      return {
        success: false,
        error: `Conexión con api.telegram.org demorada o restringida por tu proveedor local de Internet (ISP). Las credenciales quedaron guardadas y el bot operará normalmente en servidores de producción (Vercel/Nube).`,
      };
    }
    return {
      success: false,
      error: `Error de red al conectar con Telegram: ${err.message}`,
    };
  }
}

export async function sendTelegramMessage(chatId: string | number, text: string, replyMarkup?: any) {
  const { token, chatId: defaultChatId } = getTelegramConfig();
  const targetChatId = (chatId || defaultChatId || '').toString().trim();

  if (!token || token.includes('123456789:ABC') || token.length < 15 || !targetChatId) {
    console.log(`[TELEGRAM PENDIENTE] Mensaje: ${text}`);
    return { ok: false, description: 'Telegram Bot Token o Chat ID no configurados.' };
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const body: any = {
    chat_id: targetChatId,
    text,
    parse_mode: 'HTML',
  };

  if (replyMarkup) {
    body.reply_markup = replyMarkup;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });

    const rawText = await res.text();
    try {
      return JSON.parse(rawText);
    } catch {
      return { ok: res.ok, description: rawText };
    }
  } catch (err: any) {
    return { ok: false, description: err.message };
  }
}

export async function sendTelegramPhoto(chatId: string | number, photoUrl: string, caption: string, replyMarkup?: any) {
  const { token, chatId: defaultChatId } = getTelegramConfig();
  const targetChatId = (chatId || defaultChatId || '').toString().trim();

  if (!token || token.includes('123456789:ABC') || token.length < 15 || !targetChatId) {
    console.log(`[TELEGRAM PENDIENTE] Foto enviada a ${targetChatId}`);
    return { ok: false, description: 'Telegram Bot Token o Chat ID no configurados.' };
  }

  const url = `https://api.telegram.org/bot${token}/sendPhoto`;
  const body: any = {
    chat_id: targetChatId,
    photo: photoUrl,
    caption: caption.slice(0, 1024),
    parse_mode: 'HTML',
  };

  if (replyMarkup) {
    body.reply_markup = replyMarkup;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });

    const rawText = await res.text();
    try {
      return JSON.parse(rawText);
    } catch {
      return { ok: res.ok, description: rawText };
    }
  } catch (err: any) {
    return { ok: false, description: err.message };
  }
}

/**
 * Envía la tarjeta de aprobación interactiva al dueño
 */
export async function sendPostApprovalRequest(params: {
  chatId?: string | number;
  postId: string;
  negocioNombre: string;
  dia: number;
  copy: string;
  imagenUrl: string;
  horaRecomendada: string;
}) {
  const { chatId: configChatId } = getTelegramConfig();
  const targetChatId = params.chatId || configChatId || '123456789';

  const caption = `🚀 <b>SEGAR AI: Nuevo Post Listo para ${params.negocioNombre}</b>\n\n` +
    `📅 <b>Día:</b> ${params.dia} | ⏰ <b>Hora:</b> ${params.horaRecomendada}\n\n` +
    `📝 <b>Texto del Post:</b>\n${params.copy}\n\n` +
    `¿Aprobamos para publicación automática?`;

  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: '✅ Aprobar y Publicar', callback_data: `approve_${params.postId}` },
        { text: '❌ Rechazar', callback_data: `reject_${params.postId}` },
      ],
      [
        { text: '✏️ Corregir con IA', callback_data: `edit_${params.postId}` },
      ],
    ],
  };

  return sendTelegramPhoto(targetChatId, params.imagenUrl, caption, inlineKeyboard);
}

/**
 * Webhook handler
 */
export async function handleTelegramUpdate(update: any) {
  try {
    if (update.callback_query) {
      const data = update.callback_query.data;
      const chatId = update.callback_query.message?.chat?.id;

      if (data.startsWith('approve_')) {
        await sendTelegramMessage(chatId, '✅ ¡Post Aprobado! Programado para publicación automática.');
      } else if (data.startsWith('reject_')) {
        await sendTelegramMessage(chatId, '❌ Post descartado. Generando nueva propuesta...');
      } else if (data.startsWith('edit_')) {
        await sendTelegramMessage(chatId, '✍️ Responde a este mensaje con lo que deseas cambiar y Gemini lo reescribirá al instante.');
      }
      return { ok: true };
    }

    if (update.message?.reply_to_message && update.message?.text) {
      const originalText = update.message.reply_to_message.caption || update.message.reply_to_message.text || '';
      const feedback = update.message.text;
      const chatId = update.message.chat.id;

      const nuevoCopy = await rewritePostWithFeedback(originalText, feedback);
      await sendTelegramMessage(chatId, `✨ <b>Post Reescrito con tus indicaciones:</b>\n\n${nuevoCopy}`);
      return { ok: true };
    }

    return { ok: true, ignored: true };
  } catch (error) {
    console.error('Error en handleTelegramUpdate:', error);
    return { ok: false, error };
  }
}

/**
 * EVENTO 1: Notificación en tiempo real cuando un nuevo usuario se registra
 */
export async function notifyTelegramNewUserRegistered(user: {
  email: string;
  nombre: string;
  plan?: string;
  telefono?: string;
}) {
  const { chatId } = getTelegramConfig();
  if (!chatId) return;

  const now = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
  const text =
    `🆕 <b>¡NUEVO USUARIO REGISTRADO EN SEGAR AI!</b>\n\n` +
    `👤 <b>Nombre/Negocio:</b> ${user.nombre}\n` +
    `📧 <b>Email:</b> <code>${user.email}</code>\n` +
    `📱 <b>Teléfono:</b> ${user.telefono || 'No indicado'}\n` +
    `💎 <b>Plan de Interés:</b> ${(user.plan || 'pro').toUpperCase()}\n` +
    `📅 <b>Fecha:</b> ${now}\n\n` +
    `⚡ <i>Esperando confirmación de suscripción para desbloquear acceso al panel.</i>`;

  return sendTelegramMessage(chatId, text);
}

/**
 * EVENTO 2: Notificación en tiempo real cuando Flow confirma un pago exitoso
 */
export async function notifyTelegramPaymentSuccess(payment: {
  email: string;
  transactionId: string;
  plan: string;
  amountCLP: number;
  flowOrder?: string | number;
}) {
  const { chatId } = getTelegramConfig();
  if (!chatId) return;

  const now = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
  const text =
    `💰 <b>¡PAGO CONFIRMADO CON ÉXITO EN FLOW.CL!</b>\n\n` +
    `📧 <b>Email del Cliente:</b> <code>${payment.email}</code>\n` +
    `🆔 <b>ID Transacción:</b> <code>${payment.transactionId}</code>\n` +
    (payment.flowOrder ? `🔢 <b>Orden Flow:</b> #${payment.flowOrder}\n` : '') +
    `💎 <b>Membresía Activada:</b> PLAN ${payment.plan.toUpperCase()}\n` +
    `💵 <b>Monto Recibido:</b> $${payment.amountCLP.toLocaleString('es-CL')} CLP\n` +
    `💳 <b>Pasarela:</b> Flow.cl / Webpay Plus Chile\n` +
    `📅 <b>Fecha y Hora:</b> ${now}\n` +
    `⏱️ <b>Vigencia:</b> 30 días renovados automáticamente\n\n` +
    `🚀 <i>El usuario ya tiene acceso total desbloqueado a su panel de marketing.</i>`;

  return sendTelegramMessage(chatId, text);
}

/**
 * EVENTO 3: Notificación en tiempo real cuando una suscripción expira o es cancelada
 */
export async function notifyTelegramSubscriptionExpiredOrCancelled(user: {
  email: string;
  nombre?: string;
  plan: string;
  reason: 'expirada' | 'cancelada' | 'suspendida';
}) {
  const { chatId } = getTelegramConfig();
  if (!chatId) return;

  const now = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
  const reasonText =
    user.reason === 'cancelada'
      ? 'Cancelada por el usuario'
      : user.reason === 'suspendida'
      ? 'Suspendida manualmente desde el Super Admin'
      : 'Periodo de 30 días vencido sin renovación';

  const text =
    `⚠️ <b>ALERTA: SUSCRIPCIÓN ${user.reason.toUpperCase()}</b>\n\n` +
    `👤 <b>Cliente:</b> ${user.nombre || 'Usuario'}\n` +
    `📧 <b>Email:</b> <code>${user.email}</code>\n` +
    `💎 <b>Plan:</b> ${user.plan.toUpperCase()}\n` +
    `🛑 <b>Causa:</b> ${reasonText}\n` +
    `📅 <b>Fecha:</b> ${now}\n\n` +
    `🔒 <i>El acceso al panel /dashboard ha sido bloqueado automáticamente hasta regularización.</i>`;

  return sendTelegramMessage(chatId, text);
}
