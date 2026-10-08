import { NextRequest, NextResponse } from 'next/server';
import { createFlowPayment } from '@/lib/flow';
import { PlanType } from '@/lib/credits';

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      try {
        const raw = await req.text();
        body = raw ? JSON.parse(raw) : {};
      } catch {
        body = {};
      }
    }

    const { planId, userEmail = 'cliente@segar.ai', userId = 'usuario_web', billingCycle = 'mensual' } = body;

    if (!planId) {
      return NextResponse.json({ error: 'Falta planId requerido' }, { status: 400 });
    }

    // Resolver URL del host actual (local 3001 o dominio Vercel)
    const host = req.headers.get('host') || 'localhost:3001';
    const proto = host.includes('localhost') ? 'http' : 'https';
    const appUrl = body.appUrl || req.headers.get('origin') || `${proto}://${host}`;

    const result = await createFlowPayment({
      planId: planId as PlanType,
      userId,
      userEmail,
      appUrl,
      billingCycle: billingCycle as 'mensual' | 'anual',
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error en API checkout Flow:', error);
    return NextResponse.json({ error: error.message || 'Error al iniciar pago en Flow' }, { status: 500 });
  }
}
