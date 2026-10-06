import crypto from 'crypto';
import { PlanType, PLANES } from './credits';
import { activateUserSubscription } from './db';

const FLOW_API_KEY = process.env.FLOW_API_KEY;
const FLOW_SECRET_KEY = process.env.FLOW_SECRET_KEY;
const FLOW_ENV = process.env.FLOW_ENV || 'sandbox'; // 'sandbox' | 'production'

const FLOW_ENDPOINT = FLOW_ENV === 'production'
  ? 'https://www.flow.cl/api'
  : 'https://sandbox.flow.cl/api';

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
  return crypto.createHmac('sha256', secretKey).update(toSign).digest('hex');
}

/**
 * Crea una orden de pago en Flow.cl (Acepta Webpay Plus, Débito, Crédito en cuotas, Mach, Servipag)
 * Sin costo mensual fijo, solo comisión por venta concretada.
 */
export async function createFlowPayment(params: {
  planId: PlanType;
  userId: string;
  userEmail: string;
  appUrl?: string;
}): Promise<{ url: string; token: string }> {
  const planInfo = PLANES[params.planId];
  if (!planInfo) {
    throw new Error(`Plan no válido: ${params.planId}`);
  }

  const baseUrl = params.appUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const commerceOrder = `segar_${params.planId}_${Date.now()}`;

  // Si no hay API Key de Flow configurada aún, modo simulación instantáneo sin caída
  if (!FLOW_API_KEY || !FLOW_SECRET_KEY || FLOW_API_KEY.includes('tu-flow-api-key')) {
    console.warn('⚠️ [FLOW.CL] Modo Sandbox Local activo. Redirigiendo a pantalla de confirmación.');
    return {
      url: `${baseUrl}/checkout/success?plan=${params.planId}&userId=${params.userId}&flow_mock=true`,
      token: `mock_flow_token_${Date.now()}`,
    };
  }

  const payload: Record<string, any> = {
    apiKey: FLOW_API_KEY,
    commerceOrder,
    subject: `SEGAR AI - ${planInfo.nombre} (Membresía Mensual)`,
    currency: 'CLP',
    amount: planInfo.precioCLP,
    email: params.userEmail || 'cliente@segar.ai',
    urlConfirmation: `${baseUrl}/api/webhooks/flow`,
    urlReturn: `${baseUrl}/checkout/success?plan=${params.planId}&userId=${params.userId}`,
    optional: JSON.stringify({ userId: params.userId, planId: params.planId }),
  };

  payload.s = generateFlowSignature(payload, FLOW_SECRET_KEY);

  const formData = new URLSearchParams();
  for (const [key, value] of Object.entries(payload)) {
    formData.append(key, String(value));
  }

  const res = await fetch(`${FLOW_ENDPOINT}/payment/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error creando orden en Flow.cl:', errorText);
    throw new Error(`Flow Error: ${errorText}`);
  }

  const data = await res.json();
  return {
    url: `${data.url}?token=${data.token}`,
    token: data.token,
  };
}

/**
 * Procesa el Webhook de confirmación de Flow.cl
 * Consulta el estado a Flow y si está pagado (status 2), activa la membresía en Firestore / local DB.
 */
export async function handleFlowConfirmation(token: string): Promise<boolean> {
  if (!token) return false;

  if (!FLOW_API_KEY || !FLOW_SECRET_KEY || FLOW_API_KEY.includes('tu-flow-api-key')) {
    return true;
  }

  try {
    const params: Record<string, any> = {
      apiKey: FLOW_API_KEY,
      token,
    };
    params.s = generateFlowSignature(params, FLOW_SECRET_KEY);

    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${FLOW_ENDPOINT}/payment/getStatus?${query}`);

    if (!res.ok) return false;
    const paymentData = await res.json();

    // status 2 = Pagado con éxito en Flow
    if (paymentData.status === 2) {
      let userId = 'usuario_flow';
      let planId: PlanType = 'emprendedor';

      try {
        const optional = JSON.parse(paymentData.optional || '{}');
        if (optional.userId) userId = optional.userId;
        if (optional.planId) planId = optional.planId;
      } catch (e) {
        // Fallback desde commerceOrder
        const parts = (paymentData.commerceOrder || '').split('_');
        if (parts[1]) planId = parts[1] as PlanType;
      }

      activateUserSubscription(userId, planId, 'mercadopago', paymentData.amount || 15000);
      console.log(`✅ [FLOW.CL] Pago confirmado de $${paymentData.amount} CLP. Usuario ${userId} activado en plan ${planId}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error verificando pago en Flow.cl:', error);
    return false;
  }
}
