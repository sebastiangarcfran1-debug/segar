import { NextRequest, NextResponse } from 'next/server';
import { createFlowPayment } from '@/lib/flow';
import { PlanType } from '@/lib/credits';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, userEmail = 'cliente@segar.ai', userId = 'usuario_web' } = body;

    if (!planId) {
      return NextResponse.json({ error: 'Falta planId requerido' }, { status: 400 });
    }

    const result = await createFlowPayment({
      planId: planId as PlanType,
      userId,
      userEmail,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error en API checkout Flow:', error);
    return NextResponse.json({ error: error.message || 'Error al iniciar pago en Flow' }, { status: 500 });
  }
}
