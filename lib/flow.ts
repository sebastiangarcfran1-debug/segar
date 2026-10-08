import dns from 'node:dns';
import crypto from 'crypto';
import { PlanType, PLANES } from './credits';
import { activateUserSubscription, getSystemSettings, updateSystemSettings } from './db';

// Forzar prioridad IPv4 para prevenir Connect Timeout en Windows con redes sin IPv6
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignorar si no está disponible
}

function getFlowConfig() {
  const settings = getSystemSettings();
  const apiKey = (settings.flowApiKey || process.env.FLOW_API_KEY || '').trim();
  const secretKey = (settings.flowSecretKey || process.env.FLOW_SECRET_KEY || '').trim();
  const env = (settings.flowEnv || process.env.FLOW_ENV || 'sandbox') as 'sandbox' | 'production';
  const endpoint = env === 'production'
    ? 'https://www.flow.cl/api'
    : 'https://sandbox.flow.cl/api';

  return { apiKey, secretKey, env, endpoint };
}

/**
 * Genera la firma digital HMAC-SHA256 exigida por Flow.cl
 * Ordena las llaves alfabéticamente y firma el string concatenado.
 */
function generateFlowSignature(params: Record<string, any>, secretKey: string): string {
  const sortedKeys = Object.keys(params).sort();
  let toSign = '';
  for (const key of sortedKeys) {
    toSign += `${key}${params[key]}`;
  }
  return crypto.createHmac('sha256', secretKey.trim()).update(toSign).digest('hex');
}

/**
 * Prueba la conexión con Flow.cl en el entorno seleccionado
 */
export async function testFlowConnection(customApiKey?: string, customSecretKey?: string, customEnv?: string) {
  const config = getFlowConfig();
  const apiKey = (customApiKey || config.apiKey || '').trim();
  const secretKey = (customSecretKey || config.secretKey || '').trim();
  const env = ((customEnv || config.env || 'sandbox') as string).trim() as 'sandbox' | 'production';
  const endpoint = env === 'production' ? 'https://www.flow.cl/api' : 'https://sandbox.flow.cl/api';

  if (!apiKey || !secretKey || apiKey.includes('tu-flow-api-key') || apiKey.length < 6) {
    return {
      success: false,
      error: 'Llaves de Flow.cl no ingresadas. Ingresa tu API Key y Secret Key desde tu cuenta comercial en www.flow.cl (Mis Datos ➔ Claves de API).',
    };
  }

  try {
    const params: Record<string, any> = {
      apiKey,
      token: 'test_validation_token_segar',
    };
    params.s = generateFlowSignature(params, secretKey);

    const formData = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      formData.append(k, String(v));
    }

    const res = await fetch(`${endpoint}/payment/getStatus?${formData.toString()}`, {
      headers: {
        'User-Agent': 'SegarAI/1.0',
      },
      signal: AbortSignal.timeout(12000),
    });

    const rawText = await res.text();
    let data: any = {};
    try {
      data = JSON.parse(rawText);
    } catch {
      return {
        success: false,
        error: `Respuesta de Flow.cl no válida: ${rawText.slice(0, 100)}`,
      };
    }

    // Código 104 en Flow significa "Token not found".
    // Esto es la prueba definitiva de que la API Key y la firma HMAC-SHA256 con el Secret Key son 100% auténticas y aceptadas por los servidores de Flow.
    if (data.code === 104 || data.status !== undefined) {
      updateSystemSettings({
        flowApiKey: apiKey,
        flowSecretKey: secretKey,
        flowEnv: env,
      });
      return {
        success: true,
        detectedEnv: env,
        message: `¡Conexión 100% exitosa con Flow.cl (${env.toUpperCase()})! Tus llaves y firma digital son válidas para recibir pagos por Webpay Plus y tarjetas.`,
      };
    }

    if (data.code === 109) {
      return {
        success: false,
        error: `API Key inválida en Flow.cl (Código 109). Si tu cuenta fue creada en www.flow.cl, asegúrate de seleccionar el entorno 'Producción' y verificar que la API Key esté completa.`,
      };
    }

    if (data.code === 101 || data.message?.toLowerCase().includes('signature')) {
      return {
        success: false,
        error: `Secret Key incorrecta (Código 101 - Firma digital inválida). Verifica que no haya espacios en blanco al copiarla desde flow.cl.`,
      };
    }

    return {
      success: false,
      error: `Flow.cl respondió: ${data.message || 'Error de autenticación'}. Revisa tus credenciales en flow.cl.`,
    };
  } catch (err: any) {
    if (err.name === 'TimeoutError' || err.message?.includes('timeout')) {
      return {
        success: false,
        error: `Tiempo de espera agotado al conectar con Flow.cl (${env.toUpperCase()}). Los servidores de Flow tardaron en responder. Intenta de nuevo en unos segundos.`,
      };
    }
    return {
      success: false,
      error: `Error de red al conectar con Flow.cl: ${err.message}`,
    };
  }
}

/**
 * Crea una orden de pago en Flow.cl (Webpay Plus, Débito, Crédito, Mach, Servipag)
 */
export async function createFlowPayment(params: {
  planId: PlanType;
  userId: string;
  userEmail: string;
  appUrl?: string;
  billingCycle?: 'mensual' | 'anual';
}): Promise<{ url: string; token: string }> {
  const planInfo = PLANES[params.planId];
  if (!planInfo) {
    throw new Error(`Plan no válido: ${params.planId}`);
  }

  const isAnual = params.billingCycle === 'anual';
  const amountToCharge = isAnual ? (planInfo.precioAnualCLP || planInfo.precioCLP * 10) : planInfo.precioCLP;
  const cycleTitle = isAnual ? 'Anual (2 Meses Gratis)' : 'Mensual';

  const config = getFlowConfig();

  // Resolver URL base dinámica para evitar localhost:3000 si se corre en 3001 o Vercel
  let baseUrl = params.appUrl;
  if (!baseUrl || baseUrl.includes('localhost:3000')) {
    baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
  }
  baseUrl = baseUrl.replace(/\/$/, '');

  const commerceOrder = `segar_${params.planId}_${isAnual ? 'anual_' : ''}${Date.now()}`;

  // Si no hay API Key de Flow configurada aún o es de prueba

  const payload: Record<string, any> = {
    apiKey: config.apiKey,
    commerceOrder,
    subject: `SEGAR AI - ${planInfo.nombre} (${cycleTitle})`,
    currency: 'CLP',
    amount: amountToCharge,
    email: params.userEmail || 'cliente@segar.ai',
    urlConfirmation: `${baseUrl}/api/webhooks/flow`,
    urlReturn: `${baseUrl}/checkout/success?plan=${params.planId}&userId=${params.userId}&billingCycle=${isAnual ? 'anual' : 'mensual'}`,
    optional: JSON.stringify({ userId: params.userId, planId: params.planId, billingCycle: isAnual ? 'anual' : 'mensual' }),
  };

  payload.s = generateFlowSignature(payload, config.secretKey);

  const formData = new URLSearchParams();
  for (const [key, value] of Object.entries(payload)) {
    formData.append(key, String(value));
  }

  const res = await fetch(`${config.endpoint}/payment/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
    signal: AbortSignal.timeout(15000),
  });

  const rawText = await res.text();
  let data: any = {};
  try {
    data = JSON.parse(rawText);
  } catch {
    console.error('Respuesta Flow no es JSON:', rawText);
    throw new Error(`Respuesta de Flow.cl no válida: ${rawText.slice(0, 150)}`);
  }

  if (!res.ok || !data.url || !data.token) {
    console.error('Error creando orden en Flow.cl:', data);
    throw new Error(`Flow Error (${data.code || res.status}): ${data.message || rawText}`);
  }

  return {
    url: `${data.url}?token=${data.token}`,
    token: data.token,
  };
}

/**
 * Procesa el Webhook de confirmación de Flow.cl
 */
export async function handleFlowConfirmation(token: string): Promise<boolean> {
  if (!token) return false;

  const config = getFlowConfig();

  // Si es un token simulado de prueba local
  if (token.startsWith('flow_pending_')) {
    activateUserSubscription('demo_user', 'pro', 'flow_webpay', 29900);
    return true;
  }

  if (!config.apiKey || !config.secretKey || config.apiKey.includes('tu-flow-api-key') || config.apiKey.length < 6) {
    return true;
  }

  try {
    const params: Record<string, any> = {
      apiKey: config.apiKey,
      token,
    };
    params.s = generateFlowSignature(params, config.secretKey);

    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      formData.append(key, String(value));
    }

    const res = await fetch(`${config.endpoint}/payment/getStatus?${formData.toString()}`, {
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      console.error('Error al consultar estado a Flow:', await res.text());
      return false;
    }

    const rawText = await res.text();
    let data: any = {};
    try {
      data = JSON.parse(rawText);
    } catch {
      return false;
    }

    // En Flow.cl: status 2 = PAGADA
    if (data.status === 2) {
      let optionalData: any = {};
      try {
        optionalData = typeof data.optional === 'string' ? JSON.parse(data.optional) : (data.optional || {});
      } catch {
        optionalData = {};
      }

      const userId = optionalData.userId || 'usuario_flow';
      const planId = (optionalData.planId as PlanType) || 'pro';
      const planInfo = PLANES[planId] || PLANES.pro;
      const isAnual = optionalData.billingCycle === 'anual';
      const amountToRecord = isAnual ? (planInfo.precioAnualCLP || planInfo.precioCLP * 10) : planInfo.precioCLP;

      activateUserSubscription(userId, planId, 'flow_webpay', Number(data.amount) || amountToRecord, {
        email: data.payer || undefined,
        estadoPago: 'al_dia',
        activo: true,
        billingCycle: isAnual ? 'anual' : 'mensual',
      });

      // Notificación instantánea Evento 2: Flow pago confirmado
      try {
        const { notifyTelegramPaymentSuccess } = await import('./telegram');
        await notifyTelegramPaymentSuccess({
          email: data.payer || 'cliente@flow.cl',
          transactionId: String(data.flowOrder || data.commerceOrder || token),
          plan: planInfo.nombre,
          amountCLP: data.amount || planInfo.precioCLP,
          flowOrder: data.flowOrder,
        });
      } catch (tgErr) {
        console.error('Error notificando venta por Telegram:', tgErr);
      }

      return true;
    }

    return false;
  } catch (error) {
    console.error('Error en handleFlowConfirmation:', error);
    return false;
  }
}
