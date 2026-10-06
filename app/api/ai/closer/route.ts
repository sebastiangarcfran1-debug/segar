import { NextRequest, NextResponse } from 'next/server';
import { runSalesCloserAI } from '@/lib/gemini';
import { getUserCredits, incrementUserUsage } from '@/lib/db';
import { canPerformAction } from '@/lib/credits';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      mensajeCliente,
      historial = [],
      nombreNegocio = 'Mi Empresa',
      catalogoYPrecios = 'Venta de productos/servicios con garantía oficial.',
      politicasEnvio = 'Envíos a todo Chile vía Starken y Chilexpress.',
      userId = 'demo_user',
    } = body;

    if (!mensajeCliente) {
      return NextResponse.json({ error: 'Falta mensaje del cliente' }, { status: 400 });
    }

    const credits = getUserCredits(userId);
    const check = canPerformAction(credits, 'closer');

    if (!check.allowed && credits.plan !== 'gratis_trial') {
      return NextResponse.json(
        {
          error: `Has alcanzado el límite de respuestas de Closer IA (${check.max} respuestas/mes).`,
          limiteAlcanzado: true,
        },
        { status: 403 }
      );
    }

    const respuesta = await runSalesCloserAI({
      mensajeCliente,
      historial,
      nombreNegocio,
      catalogoYPrecios,
      politicasEnvio,
    });

    incrementUserUsage(userId, 'closer', 1);

    return NextResponse.json({
      success: true,
      respuesta,
      creditosRestantes: Math.max(0, check.remaining - 1),
    });
  } catch (error: any) {
    console.error('Error en Closer IA:', error);
    return NextResponse.json({ error: error.message || 'Error al ejecutar Closer IA' }, { status: 500 });
  }
}
