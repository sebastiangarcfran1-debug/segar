import dns from 'node:dns';
import crypto from 'crypto';
import { PlanType, PLANES } from './credits';
import { getSystemSettings, activateUserSubscription } from './db';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

// CONFIG - AHORA VERCEL MANDA
async function getFlowConfig() {
  let settings: any = {};
  try {
    const s = await (getSystemSettings() as any);
    settings = s || {};
  } catch {}

  const apiKey = (process.env.FLOW_API_KEY || settings.flowApiKey || '').trim();
  const secretKey = (process.env.FLOW_SECRET_KEY || settings.flowSecretKey || '').trim();
  const env = (process.env.FLOW_ENV || settings.flowEnv || 'production') as 'sandbox' | 'production';
  const endpoint = env === 'production'? 'https://www.flow.cl/api' : 'https://sandbox.flow.cl/api';

  return { apiKey, secretKey, env, endpoint };
}

function generateFlowSignature(params: Record<string, any>, secretKey: string): string {
  const sortedKeys = Object.keys(params).sort();
  let toSign = '';
  for (const key of sortedKeys) {
    toSign += `${key}${params[key]}`;
  }
  return crypto.createHmac('sha256', secretKey.trim()).update(toSign).digest('hex');
}

export async function testFlowConnection(customApiKey?: string, customSecretKey?: string, customEnv?: string) {
  const config = await getFlowConfig();
  const apiKey = (customApiKey || config.apiKey || '').trim();
  const secretKey = (customSecretKey || config.secretKey || '').trim();
  const env = ((customEnv || config.env || 'production') as string).trim() as 'sandbox' | 'production';
  const endpoint = env === 'production'? 'https://www.flow.cl/api' : 'https://sandbox.flow.cl/api';

  if (!apiKey ||!secretKey || apiKey.includes('tu-flow-api-key') || apiKey.length < 6) {
    return {
      success: false,
      error: 'Faltan llaves de Flow.cl. Configúralas en Vercel > Environment Variables.',
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
      headers: { 'User-Agent': 'SegarAI/1.0' },
      signal: AbortSignal.timeout(12000),
    });

    const data = await res.json().catch(() => ({}));

    if (data.code === 104 || data.status!== undefined) {
      return {
        success: true,
        detectedEnv: env,
        message: `¡Conexión exitosa con Flow.cl (${env.toUpperCase()})!`,
      };
    }

    return {
      success: false,
      error: `Flow.cl: ${data.message || 'Error auth'} (code ${data.code})`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Error red Flow: ${err.message}`,
    };
  }
}

export async function createFlowPayment(params: {
  planId: PlanType;
  userId: string;
  userEmail: string;
  appUrl?: string;
  billingCycle?: 'mensual' | 'anual';
}): Promise<{ url: string; token: string }> {
  const planInfo = PLANES[params.planId];
  if (!planInfo) throw new Error(`Plan no válido: ${params.planId}`);

  const isAnual = params.billingCycle === 'anual';
  const amountToCharge = isAnual? planInfo.precioAnualCLP || planInfo.precioCLP * 10 : planInfo.precioCLP;
  const cycleTitle = isAnual? 'Anual (2 Meses Gratis)' : 'Mensual';

  const config = await getFlowConfig();

  console.log('[FLOW DEBUG] config:', {
    env: config.env,
    hasApiKey:!!config.apiKey,
    apiKeyLen: config.apiKey.length,
    hasSecret:!!config.secretKey,
  });

  if (!config.apiKey ||!config.secretKey) {
    throw new Error(`FALTAN LLAVES EN VERCEL - FLOW_API_KEY=${!!config.apiKey} FLOW_SECRET_KEY=${!!config.secretKey}. Agrégalas en Vercel > Settings > Env Vars`);
  }

  let baseUrl = params.appUrl;
  if (!baseUrl || baseUrl.includes('localhost:3000')) {
    baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://segar-ia-defi.vercel.app';
  }
  baseUrl = baseUrl.replace(/\/$/, '');

  const commerceOrder = `segar_${params.planId}_${isAnual? 'anual_' : ''}${Date.now()}`;

  const payload: Record<string, any> = {
    apiKey: config.apiKey,
    commerceOrder,
    subject: `SEGAR AI - ${planInfo.nombre} (${cycleTitle})`,
    currency: 'CLP',
    amount: amountToCharge,
    email: params.userEmail || 'cliente@segar.ai',
    urlConfirmation: `${baseUrl}/api/webhooks/flow`,
    urlReturn: `${baseUrl}/checkout/success?plan=${params.planId}&userId=${params.userId}&billingCycle=${isAnual? 'anual' : 'mensual'}`,
    optional: JSON.stringify({ userId: params.userId, planId: params.planId, billingCycle: isAnual? 'anual' : 'mensual' }),
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
    throw new Error(`Flow no devolvió JSON: ${rawText.slice(0, 200)}`);
  }

  if (!res.ok ||!data.url ||!data.token) {
    throw new Error(`Flow Error ${data.code || res.status}: ${data.message || rawText}`);
  }

  return {
    url: `${data.url}?token=${data.token}`,
    token: data.token,
  };
}

export async function handleFlowConfirmation(token: string): Promise<boolean> {
  if (!token) return false;

  if (token.startsWith('flow_pending_')) {
    console.warn('[FLOW] Token mock bloqueado - no se activa plan');
    return false;
  }

  const config = await getFlowConfig();

  if (!config.apiKey ||!config.secretKey) {
    console.error('[FLOW] No hay llaves para verificar pago');
    return false;
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

    const data = await res.json().catch(() => ({}));

    if (data.status === 2) {
      let optionalData: any = {};
      try {
        optionalData = typeof data.optional === 'string'? JSON.parse(data.optional) : data.optional || {};
      } catch {
        optionalData = {};
      }

      const userId = optionalData.userId || 'usuario_flow';
      const planId = (optionalData.planId as PlanType) || 'pro';
      const planInfo = PLANES[planId] || PLANES.pro;
      const isAnual = optionalData.billingCycle === 'anual';
      const amountToRecord = isAnual? planInfo.precioAnualCLP || planInfo.precioCLP * 10 : planInfo.precioCLP;

      await activateUserSubscription(userId, planId, 'flow_webpay', Number(data.amount) || amountToRecord, {
        email: data.payer || undefined,
        estadoPago: 'al_dia',
        activo: true,
        billingCycle: isAnual? 'anual' : 'mensual',
      });

      try {
        const { notifyTelegramPaymentSuccess } = await import('./telegram');
        await notifyTelegramPaymentSuccess({
          email: data.payer || 'cliente@flow.cl',
          transactionId: String(data.flowOrder || data.commerceOrder || token),
          plan: planInfo.nombre,
          amountCLP: data.amount || planInfo.precioCLP,
          flowOrder: data.flowOrder,
        });
      } catch {}

      return true;
    }

    return false;
  } catch (error) {
    console.error('Error handleFlowConfirmation:', error);
    return false;
  }
}
