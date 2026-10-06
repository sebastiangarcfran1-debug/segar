import { NextRequest, NextResponse } from 'next/server';
import { generate30PostsForBusiness } from '@/lib/gemini';
import { getUserCredits, incrementUserUsage } from '@/lib/db';
import { canPerformAction } from '@/lib/credits';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, rubro, queVende, userId = 'demo_user' } = body;

    const credits = getUserCredits(userId);
    const check = canPerformAction(credits, 'post');

    if (!check.allowed && credits.plan !== 'gratis_trial') {
      return NextResponse.json(
        {
          error: `Has alcanzado el límite de tu plan (${check.max} posts). Mejora tu plan para continuar sin límites.`,
          limiteAlcanzado: true,
        },
        { status: 403 }
      );
    }

    const posts = await generate30PostsForBusiness({
      nombre: nombre || 'Mi Negocio',
      rubro: rubro || 'Comercio / Servicios',
      queVende: queVende || 'Productos y servicios de alta calidad',
    });

    incrementUserUsage(userId, 'post', Math.min(posts.length, check.remaining || 30));

    return NextResponse.json({
      success: true,
      posts,
      creditosRestantes: Math.max(0, check.remaining - posts.length),
    });
  } catch (error: any) {
    console.error('Error generando 30 posts:', error);
    return NextResponse.json({ error: error.message || 'Error al generar posts' }, { status: 500 });
  }
}
