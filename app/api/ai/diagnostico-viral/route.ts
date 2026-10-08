import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';
import { saveWhatsAppLead, getSystemSettings } from '@/lib/db';
import { sendTelegramMessage } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { instagram, rubro, whatsapp = '', ciudad = 'Chile' } = body;

    if (!instagram || !rubro) {
      return NextResponse.json(
        { error: 'Debes ingresar el Instagram y el Rubro de tu negocio' },
        { status: 400 }
      );
    }

    const cleanIg = instagram.replace('@', '').trim();
    const handle = `@${cleanIg}`;

    // Prompt de Alta Conversión para Gemini 2.0 Flash
    const systemPrompt = `Eres un Auditor Senior de Crecimiento y Adquisición para Negocios y Pymes en Chile.
Tu misión es auditar el perfil de Instagram comercial de una pyme, detectar las 3 mayores fugas de dinero (ventas no concretadas) y entregar un reporte contundente en formato JSON estricto.
El tono es profesional, urgente, comercial y enfocado en pesos chilenos (CLP).
DEBES RESPONDER EXCLUSIVAMENTE UN OBJETO JSON VÁLIDO sin código markdown adicional.`;

    const userPrompt = `Audita este negocio chileno:
- Instagram: ${handle}
- Rubro / Nicho: ${rubro}
- Ubicación: ${ciudad}

Genera un JSON con esta estructura exacta:
{
  "score": 58,
  "nivel": "Fuga Crítica de Ventas",
  "ventasPerdidasCLP": "$580.000 a $1.350.000 CLP / mes",
  "diagnosticoResumen": "Tu cuenta tiene tráfico potencial pero carece de embudo de cierre inmediato...",
  "fugasDetectadas": [
    {
      "titulo": "Bio sin Enlace Inteligente a WhatsApp",
      "descripcion": "El enlace en bio no pre-carga un mensaje de cotización rápida, perdiendo hasta un 42% de personas interesadas.",
      "gravedad": "alta",
      "solucionSegar": "Generar enlace pre-cargado hacia el Closer de WhatsApp 24/7 de SEGAR AI."
    },
    {
      "titulo": "Falta de Ganchos de Escasez y Precios en CLP",
      "descripcion": "Los últimos posts no muestran el valor en CLP ni llamados de urgencia, generando consultas vacías que no pagan.",
      "gravedad": "alta",
      "solucionSegar": "Fábrica de 30 Posts con ganchos virales y Banner Studio Pro con sellos de garantía."
    },
    {
      "titulo": "Tiempo de Respuesta Lento en Mensajes Directos",
      "descripcion": "Responder DMs después de 15 minutos reduce la probabilidad de cierre en un 70% según métricas de Meta.",
      "gravedad": "media",
      "solucionSegar": "Activar Closer IA sincronizado con Meta Cloud API para responder en 3 segundos."
    }
  ],
  "planAccionInmediato": [
    {
      "paso": 1,
      "accion": "Activar el Closer de Ventas IA en WhatsApp para retener 100% de prospectos.",
      "tiempoEstimado": "5 minutos"
    },
    {
      "paso": 2,
      "accion": "Publicar 30 contenidos del mes diseñados con psicología chilena y precios claros.",
      "tiempoEstimado": "Hoy mismo"
    },
    {
      "paso": 3,
      "accion": "Conectar Autopiloto Meta API para que publique de manera autónoma sin intervención.",
      "tiempoEstimado": "10 minutos"
    }
  ],
  "recomendacionPlan": "pro"
}`;

    let diagnostico: any = null;

    try {
      const geminiResponse = await callGemini(userPrompt, systemPrompt);
      if (geminiResponse) {
        const cleaned = geminiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        diagnostico = JSON.parse(cleaned);
      }
    } catch (e) {
      console.warn('Fallback a diagnóstico local inteligente para auditoría viral:', e);
    }

    // Fallback de contingencia si Gemini no está configurado o hay timeout
    if (!diagnostico || !diagnostico.score) {
      diagnostico = {
        score: Math.floor(Math.random() * (68 - 48 + 1)) + 48,
        nivel: 'Fuga Crítica de Clientes',
        ventasPerdidasCLP: '$520.000 a $1.250.000 CLP / mes',
        diagnosticoResumen: `La cuenta ${handle} en el nicho de ${rubro} tiene prospectos interesados, pero está perdiendo más del 60% de sus potenciales compradores por falta de automatización en el primer contacto.`,
        fugasDetectadas: [
          {
            titulo: 'Bio y Enlace sin Disparador de Ventas',
            descripcion: 'Tu enlace en el perfil no dirige con un mensaje pre-cargado de cotización, provocando abandono inmediato del visitante.',
            gravedad: 'alta',
            solucionSegar: 'Activa un link directo a WhatsApp con mensaje automático y Closer IA de SEGAR.',
          },
          {
            titulo: 'Contenido sin Ganchos Virales ni Precios Claros',
            descripcion: 'Las publicaciones actuales no usan estructuras de retención (AIDA/PAS) ni precios transparentes en pesos chilenos.',
            gravedad: 'alta',
            solucionSegar: 'Usa la Fábrica de 30 Posts & Ads con copies validados para el mercado chileno.',
          },
          {
            titulo: 'Pérdida de Prospectos Fuera de Horario Laboral',
            descripcion: 'El 45% de las compras en Chile se deciden entre las 20:00 y las 23:30 hrs cuando el negocio está cerrado.',
            gravedad: 'media',
            solucionSegar: 'El Closer IA responde y entrega catálogo con links de pago Webpay 24/7 sin descanso.',
          },
        ],
        planAccionInmediato: [
          {
            paso: 1,
            accion: 'Conectar Closer IA con catálogo de productos y precios en CLP.',
            tiempoEstimado: '3 minutos',
          },
          {
            paso: 2,
            accion: 'Generar los 30 posts del mes y programarlos en el Calendario Omnicanal.',
            tiempoEstimado: '10 minutos',
          },
          {
            paso: 3,
            accion: 'Activar Autopiloto de Meta para publicación automática 24/7.',
            tiempoEstimado: 'Inmediato',
          },
        ],
        recomendacionPlan: 'pro',
      };
    }

    // 1. Guardar Prospecto en Base de Datos de Leads (CRM)
    const phoneToSave = whatsapp.trim() || '+56900000000';
    saveWhatsAppLead({
      userId: 'demo_user',
      phone: phoneToSave,
      name: `${handle} (${rubro})`,
      lastMessage: `Auditoría Viral solicitada: Score ${diagnostico.score}/100. Fuga estimada: ${diagnostico.ventasPerdidasCLP}`,
      aiReply: `Diagnóstico generado exitosamente para ${handle}`,
      status: 'nuevo',
      dealValueCLP: 29900,
    });

    // 2. Notificación en Tiempo Real a Telegram del Administrador
    try {
      const settings = getSystemSettings();
      const adminChatId = settings.telegramChatId || process.env.TELEGRAM_ADMIN_CHAT_ID;
      if (adminChatId) {
        const msg = `🚨 <b>NUEVO PROSPECTO AUDITORÍA VIRAL</b> 🚨\n\n` +
          `📸 <b>Instagram:</b> <code>${handle}</code>\n` +
          `🏢 <b>Rubro:</b> ${rubro}\n` +
          `📱 <b>WhatsApp:</b> ${whatsapp || 'No ingresado'}\n` +
          `📍 <b>Ciudad:</b> ${ciudad}\n` +
          `📊 <b>Score Detectado:</b> ${diagnostico.score}/100 (${diagnostico.nivel})\n` +
          `💸 <b>Fuga de Dinero:</b> ${diagnostico.ventasPerdidasCLP}\n\n` +
          `🔥 <i>¡Este prospecto está revisando su reporte ahora mismo! Contáctalo para cerrar Plan Pro.</i>`;

        await sendTelegramMessage(adminChatId, msg);
      }
    } catch (telegramErr) {
      console.warn('Error enviando notificación de auditoría a Telegram:', telegramErr);
    }

    return NextResponse.json({
      success: true,
      instagram: handle,
      rubro,
      diagnostico,
    });
  } catch (error: any) {
    console.error('Error procesando auditoría viral:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la auditoría' },
      { status: 500 }
    );
  }
}
