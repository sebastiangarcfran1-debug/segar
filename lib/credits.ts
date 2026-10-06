/**
 * Sistema de Control de Cuotas y Créditos $0 Costo.
 * Protege contra sobreconsumo para mantenerse 100% dentro del Free Tier de Google Gemini.
 */

export type PlanType = 'emprendedor' | 'pro' | 'agencia' | 'gratis_trial';

export interface PlanLimits {
  nombre: string;
  precioCLP: number;
  precioUSD: number;
  maxPostsMes: number;
  maxAnunciosMes: number;
  maxRespuestasCloser: number;
  marcasSimultaneas: number;
  soporteTelegram: boolean;
}

export const PLANES: Record<PlanType, PlanLimits> = {
  gratis_trial: {
    nombre: 'Prueba Gratuita',
    precioCLP: 0,
    precioUSD: 0,
    maxPostsMes: 3,
    maxAnunciosMes: 1,
    maxRespuestasCloser: 20,
    marcasSimultaneas: 1,
    soporteTelegram: false,
  },
  emprendedor: {
    nombre: 'Plan Emprendedor',
    precioCLP: 15000,
    precioUSD: 17,
    maxPostsMes: 30,
    maxAnunciosMes: 5,
    maxRespuestasCloser: 200,
    marcasSimultaneas: 1,
    soporteTelegram: true,
  },
  pro: {
    nombre: 'Plan Pro',
    precioCLP: 29900,
    precioUSD: 33,
    maxPostsMes: 100,
    maxAnunciosMes: 15,
    maxRespuestasCloser: 1000,
    marcasSimultaneas: 2,
    soporteTelegram: true,
  },
  agencia: {
    nombre: 'Plan Agencia',
    precioCLP: 59900,
    precioUSD: 67,
    maxPostsMes: 300,
    maxAnunciosMes: 50,
    maxRespuestasCloser: 3000,
    marcasSimultaneas: 5,
    soporteTelegram: true,
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
  origenPago: 'mercadopago' | 'transferencia' | 'trial' | 'admin_manual';
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
