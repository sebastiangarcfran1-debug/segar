/**
 * Integración con Mercado Pago Checkout Pro (0 costo mensual, solo comisión por venta).
 * Utiliza directamente la API REST oficial para evitar fallos de dependencias
 * y soportar tanto CLP (Chile) como USD (Latinoamérica).
 */

import { PlanType, PLANES } from './credits';
import { activateUserSubscription } from './db';

const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;

export interface PreferenceResponse {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

export async function createMercadoPagoPreference(params: {
  planId: PlanType;
  userId: string;
  userEmail: string;
  currency?: 'CLP' | 'USD';
  appUrl?: string;
}): Promise<{ init_point: string; id: string }> {
  const planInfo = PLANES[params.planId];
  if (!planInfo) {
    throw new Error(`Plan no válido: ${params.planId}`);
  }

  const currency = params.currency || 'CLP';
  const unitPrice = currency === 'CLP' ? planInfo.precioCLP : planInfo.precioUSD;
  const baseUrl = params.appUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Si no hay token de MercadoPago configurado aún, se genera un enlace simulado de pago exitoso
  if (!MERCADOPAGO_ACCESS_TOKEN || MERCADOPAGO_ACCESS_TOKEN.includes('tu-access-token')) {
    console.warn('⚠️ [MERCADOPAGO] No hay Access Token configurado. Generando pasarela de prueba instantánea.');
    const mockId = `mock_pref_${Date.now()}`;
    return {
      id: mockId,
      init_point: `${baseUrl}/checkout/success?plan=${params.planId}&userId=${params.userId}&mock=true`,
    };
  }

  const preferencePayload = {
    items: [
      {
        id: `segar_${params.planId}`,
        title: `SEGAR AI MARKETING - ${planInfo.nombre} (Membresía Mensual)`,
        description: `Acceso completo a la plataforma Segar AI Marketing (${planInfo.maxPostsMes} posts, closer de ventas y bot de Telegram)`,
        quantity: 1,
        currency_id: currency,
        unit_price: Number(unitPrice),
      },
    ],
    payer: {
      email: params.userEmail || 'cliente@segar.ai',
    },
    back_urls: {
      success: `${baseUrl}/checkout/success?plan=${params.planId}&userId=${params.userId}&status=success`,
      pending: `${baseUrl}/checkout/pending?plan=${params.planId}&userId=${params.userId}`,
      failure: `${baseUrl}/checkout?error=payment_failed`,
    },
    auto_return: 'approved',
    external_reference: `${params.userId}:${params.planId}`,
    statement_descriptor: 'SEGAR AI MARKETING',
    notification_url: `${baseUrl}/api/webhooks/mercadopago`,
  };

  const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(preferencePayload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error creando preferencia en Mercado Pago:', errorText);
    throw new Error(`Mercado Pago Error: ${errorText}`);
  }

  const data = (await res.json()) as PreferenceResponse;
  return {
    id: data.id,
    init_point: data.init_point || data.sandbox_init_point,
  };
}

// Procesa el webhook de Mercado Pago y activa automáticamente la membresía
export async function handleMercadoPagoWebhook(payload: any): Promise<boolean> {
  try {
    const topic = payload.type || payload.topic;
    const paymentId = payload.data?.id || payload.id;

    if (topic === 'payment' && paymentId) {
      if (!MERCADOPAGO_ACCESS_TOKEN || MERCADOPAGO_ACCESS_TOKEN.includes('tu-access-token')) {
        return true;
      }

      // Consultar el estado del pago a la API de Mercado Pago
      const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        },
      });

      if (!res.ok) return false;
      const paymentData = await res.json();

      if (paymentData.status === 'approved') {
        const [userId, planId] = (paymentData.external_reference || '').split(':');
        const plan = (planId as PlanType) || 'emprendedor';
        const monto = paymentData.transaction_amount || 15000;

        activateUserSubscription(userId || 'usuario_mp', plan, 'mercadopago', monto);
        console.log(`✅ [MERCADOPAGO] Suscripción activada para ${userId} en plan ${plan}`);
        return true;
      }
    }
    return true;
  } catch (error) {
    console.error('Error procesando webhook de Mercado Pago:', error);
    return false;
  }
}
