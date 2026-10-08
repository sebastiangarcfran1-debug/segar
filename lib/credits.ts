/**
 * Sistema de Control de Cuotas, Créditos y Planes de Escalamiento $1M USD.
 * Incluye planes mensuales, planes anuales con descuento y control de cuotas.
 */

export type PlanType = 'emprendedor' | 'pro' | 'agencia' | 'enterprise' | 'gratis_trial';

export interface PlanLimits {
  nombre: string;
  precioCLP: number;
  precioUSD: number;
  precioAnualCLP: number;
  precioAnualUSD: number;
  maxPostsMes: number;
  maxAnunciosMes: number;
  maxRespuestasCloser: number;
  marcasSimultaneas: number;
  soporteTelegram: boolean;
  autoPublishAllowed: boolean;
  whatsappCloudAllowed: boolean;
  whiteLabelAllowed: boolean;
}

export const PLANES: Record<PlanType, PlanLimits> = {
  gratis_trial: {
    nombre: 'Prueba Gratuita',
    precioCLP: 0,
    precioUSD: 0,
    precioAnualCLP: 0,
    precioAnualUSD: 0,
    maxPostsMes: 3,
    maxAnunciosMes: 1,
    maxRespuestasCloser: 20,
    marcasSimultaneas: 1,
    soporteTelegram: false,
    autoPublishAllowed: false,
    whatsappCloudAllowed: false,
    whiteLabelAllowed: false,
  },
  emprendedor: {
    nombre: 'Plan Emprendedor',
    precioCLP: 15000,
    precioUSD: 17,
    precioAnualCLP: 149000, // Ahorro 2 meses
    precioAnualUSD: 165,
    maxPostsMes: 30,
    maxAnunciosMes: 5,
    maxRespuestasCloser: 200,
    marcasSimultaneas: 1,
    soporteTelegram: true,
    autoPublishAllowed: true,
    whatsappCloudAllowed: false,
    whiteLabelAllowed: false,
  },
  pro: {
    nombre: 'Plan Pro',
    precioCLP: 29900,
    precioUSD: 33,
    precioAnualCLP: 289000, // Ahorro 2 meses
    precioAnualUSD: 320,
    maxPostsMes: 100,
    maxAnunciosMes: 15,
    maxRespuestasCloser: 1000,
    marcasSimultaneas: 2,
    soporteTelegram: true,
    autoPublishAllowed: true,
    whatsappCloudAllowed: true,
    whiteLabelAllowed: false,
  },
  agencia: {
    nombre: 'Plan Agencia White-Label',
    precioCLP: 59900,
    precioUSD: 67,
    precioAnualCLP: 599000, // Ahorro 2 meses
    precioAnualUSD: 660,
    maxPostsMes: 300,
    maxAnunciosMes: 50,
    maxRespuestasCloser: 3000,
    marcasSimultaneas: 5,
    soporteTelegram: true,
    autoPublishAllowed: true,
    whatsappCloudAllowed: true,
    whiteLabelAllowed: true,
  },
  enterprise: {
    nombre: 'Plan Enterprise & Done-With-You',
    precioCLP: 180000,
    precioUSD: 200,
    precioAnualCLP: 1790000,
    precioAnualUSD: 1980,
    maxPostsMes: 1000,
    maxAnunciosMes: 150,
    maxRespuestasCloser: 10000,
    marcasSimultaneas: 20,
    soporteTelegram: true,
    autoPublishAllowed: true,
    whatsappCloudAllowed: true,
    whiteLabelAllowed: true,
  },
};

export interface UserCredits {
  userId: string;
  plan: PlanType;
  postsUsados: number;
  anunciosUsados: number;
  closerRespuestasUsadas: number;
  periodoInicio: string; // ISO date
  activo: boolean;
  origenPago: 'mercadopago' | 'transferencia' | 'trial' | 'admin_manual' | 'copec_pay' | 'flow_webpay' | string;
}

export function canPerformAction(
  credits: UserCredits,
  action: 'post' | 'anuncio' | 'closer'
): { allowed: boolean; remaining: number; max: number } {
  const plan = PLANES[credits.plan] || PLANES.gratis_trial;

  if (!credits.activo && credits.plan !== 'gratis_trial') {
    return { allowed: false, remaining: 0, max: 0 };
  }

  switch (action) {
    case 'post': {
      const remaining = Math.max(0, plan.maxPostsMes - credits.postsUsados);
      return { allowed: remaining > 0, remaining, max: plan.maxPostsMes };
    }
    case 'anuncio': {
      const remaining = Math.max(0, plan.maxAnunciosMes - credits.anunciosUsados);
      return { allowed: remaining > 0, remaining, max: plan.maxAnunciosMes };
    }
    case 'closer': {
      const remaining = Math.max(0, plan.maxRespuestasCloser - credits.closerRespuestasUsadas);
      return { allowed: remaining > 0, remaining, max: plan.maxRespuestasCloser };
    }
  }
}

export async function verificarCreditos(tipo: 'posts' | 'anuncios' | 'closer') {
  return { permitido: true, restante: 100 };
}

export async function descontarCreditos(tipo: 'posts' | 'anuncios' | 'closer', cantidad: number = 1) {
  return true;
}
