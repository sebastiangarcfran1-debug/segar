import { NextRequest, NextResponse } from 'next/server';
import { createMercadoPagoPreference } from '@/lib/mercadopago';
import { PlanType } from '@/lib/credits';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, userEmail, currency = 'CLP', userId = 'usuario_web' } = body;

    if (!planId) {
      return NextResponse.json({ error: 'Falta planId requerido' }, { status: 400 });
    }

    const preference = await createMercadoPagoPreference({
      planId: planId as PlanType,
      userId,
      userEmail: userEmail || 'contacto@pyme.cl',
      currency,
    });

    return NextResponse.json(preference);
  } catch (error: any) {
    console.error('Error en API checkout:', error);
    return NextResponse.json({ error: error.message || 'Error interno al crear checkout' }, { status: 500 });
  }
}
