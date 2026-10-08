import { NextRequest, NextResponse } from 'next/server';
import { readLocalDb, getUserCredits } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') || 'demo_user';

  const user = getUserCredits(userId);

  return NextResponse.json({
    userId: user.userId,
    nombre: user.nombre || 'Mi Negocio',
    plan: user.plan,
    postsUsados: user.postsUsados || 0,
    closerRespuestasUsadas: user.closerRespuestasUsadas || 0,
    anunciosUsados: user.anunciosUsados || 0,
    activo: user.activo,
    maxPosts: user.plan === 'emprendedor' ? 30 : user.plan === 'pro' ? 100 : 300,
    maxCloser: user.plan === 'emprendedor' ? 200 : user.plan === 'pro' ? 1000 : 3000,
  });
}
