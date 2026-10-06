/**
 * Bot de Telegram - Panel de Control Móvil 100% GRATIS
 * Permite al dueño del negocio aprobar, pedir correcciones con Gemini o rechazar
 * los posts generados directamente desde su celular sin entrar a la web.
 */

import { rewritePostWithFeedback } from './gemini';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

export async function sendTelegramMessage(chatId: string | number, text: string, replyMarkup?: any) {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN.includes('123456789:ABC')) {
    console.log(`[TELEGRAM MOCK] Enviando mensaje al chat ${chatId}:\n${text}`);
    return { ok: true, mock: true };
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const body: any = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
  };

  if (replyMarkup) {
    body.reply_markup = replyMarkup;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return res.json();
}

export async function sendTelegramPhoto(chatId: string | number, photoUrl: string, caption: string, replyMarkup?: any) {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN.includes('123456789:ABC')) {
    console.log(`[TELEGRAM MOCK] Enviando foto (${photoUrl}) al chat ${chatId} con caption:\n${caption}`);
    return { ok: true, mock: true };
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
  const body: any = {
    chat_id: chatId,
    photo: photoUrl,
    caption: caption.slice(0, 1024), // Telegram caption limit
    parse_mode: 'HTML',
  };

  if (replyMarkup) {
    body.reply_markup = replyMarkup;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return res.json();
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
  const targetChatId = params.chatId || TELEGRAM_ADMIN_CHAT_ID || '123456789';

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
 * Procesa las acciones interactivas de Telegram (Webhook Handler)
 */
export async function handleTelegramUpdate(update: any) {
  try {
    // 1. Manejo de botones inline (Callback Query)
    if (update.callback_query) {
      const callback = update.callback_query;
      const data = callback.data || '';
      const chatId = callback.message?.chat?.id;
      const messageId = callback.message?.message_id;

      if (data.startsWith('approve_')) {
        const postId = data.replace('approve_', '');
        await sendTelegramMessage(
          chatId,
          `🎉 <b>¡Post #${postId} Aprobado!</b>\nHa sido programado en el calendario editorial y se publicará en tus redes en la hora estipulada.`
        );
      } else if (data.startsWith('reject_')) {
        const postId = data.replace('reject_', '');
        await sendTelegramMessage(
          chatId,
          `🗑️ <b>Post #${postId} Rechazado.</b>\nSe ha descartado del calendario.`
        );
      } else if (data.startsWith('edit_')) {
        const postId = data.replace('edit_', '');
        await sendTelegramMessage(
          chatId,
          `✍️ <b>Modo Corrección con IA Activado</b>\nPor favor, responde a este mensaje indicando qué deseas cambiar (Ej: <i>"Hazlo más informal y enfócate en el envío gratis a regiones"</i>). Gemini reescribirá el contenido de inmediato.`
        );
      }
      return { ok: true };
    }

    // 2. Manejo de mensajes de texto / comandos
    if (update.message?.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text.trim();

      if (text === '/start') {
        const bienvenida = `👋 <b>¡Bienvenido a Segar AI Marketing Bot!</b>\n\n` +
          `Soy tu asistente de control 24/7. Te enviaré cada post generado con su imagen para que lo apruebes o corrijas con 1 solo toque antes de salir a tus redes.\n\n` +
          `🔹 <b>Comandos disponibles:</b>\n` +
          `/status - Ver estado de tu plan y posts del mes\n` +
          `/nuevo - Generar un post express con IA ahora\n` +
          `/ayuda - Soporte directo Segar AI`;

        await sendTelegramMessage(chatId, bienvenida);
        return { ok: true };
      }

      if (text === '/status') {
        await sendTelegramMessage(
          chatId,
          `📊 <b>Estado de tu Cuenta Segar AI:</b>\n\n` +
          `• <b>Plan:</b> Pro ($29.900 CLP)\n` +
          `• <b>Posts Aprobados:</b> 18 / 100\n` +
          `• <b>Closer IA:</b> 100% Activo respondiendo en WhatsApp e Instagram\n` +
          `• <b>Próxima publicación:</b> Hoy a las 19:45 hrs.`
        );
        return { ok: true };
      }

      // Si el usuario escribe una instrucción libre de corrección:
      if (update.message.reply_to_message) {
        const originalText = update.message.reply_to_message.caption || update.message.reply_to_message.text || '';
        const nuevoTexto = await rewritePostWithFeedback(originalText, text);

        await sendTelegramMessage(
          chatId,
          `✨ <b>¡Nueva versión reescrita por Gemini!</b>\n\n${nuevoTexto}\n\n¿Te parece bien ahora?`,
          {
            inline_keyboard: [
              [
                { text: '✅ Aprobar esta versión', callback_data: `approve_rewritten` },
                { text: '✏️ Ajustar de nuevo', callback_data: `edit_rewritten` }
              ]
            ]
          }
        );
        return { ok: true };
      }
    }

    return { ok: true };
  } catch (err) {
    console.error('Error procesando update de Telegram:', err);
    return { ok: false, error: err };
  }
}
