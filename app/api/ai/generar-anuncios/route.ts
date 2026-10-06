import { NextRequest, NextResponse } from 'next/server';
import { generateAdsAndVideoScripts } from '@/lib/gemini';
import { getUserCredits, incrementUserUsage } from '@/lib/db';
import { canPerformAction } from '@/lib/credits';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, rubro, queVende, precio, userId = 'demo_user' } = body;

    const credits = getUserCredits(userId);
    const check = canPerformAction(credits, 'anuncio');

    if (!check.allowed && credits.plan !== 'gratis_trial') {
      return NextResponse.json(
        {
          error: `Has alcanzado el límite de anuncios para tu plan (${check.max} sets de anuncios).`,
          limiteAlcanzado: true,
        },
        { status: 403 }
      );
    }

    const anuncios = await generateAdsAndVideoScripts({
      nombre: nombre || 'Mi Negocio Chile',
      rubro: rubro || 'Ventas y Servicios',
      queVende: queVende || 'Solución premium',
      precio: precio || '$29.900 CLP',
    });

    incrementUserUsage(userId, 'anuncio', 1);

    return NextResponse.json({
      success: true,
      anuncios,
      creditosRestantes: Math.max(0, check.remaining - 1),
    });
  } catch (error: any) {
    console.error('Error generando anuncios y guiones:', error);
    return NextResponse.json({ error: error.message || 'Error al generar anuncios' }, { status: 500 });
  }
}
