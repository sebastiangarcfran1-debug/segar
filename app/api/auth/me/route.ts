import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, signJwt, AUTH_COOKIE_NAME } from '@/lib/auth';
import { readLocalDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  // Si es super_admin, retornar sesión admin directa
  if (session.role === 'admin' || session.userId === 'super_admin') {
    return NextResponse.json({
      authenticated: true,
      user: {
        userId: 'super_admin',
        email: 'operaciones.segar.ant@gmail.com',
        nombre: 'Director General',
        role: 'admin',
        plan: 'agencia',
        activo: true,
        estadoPago: 'al_dia',
      },
    });
  }

  // Refrescar estado real desde la base de datos
  const db = readLocalDb();
  const dbUser = db.users[session.userId];

  if (!dbUser) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const isExpired = dbUser.fechaExpiracion ? new Date(dbUser.fechaExpiracion) < new Date() : false;
  const isActivo = dbUser.activo && !isExpired && dbUser.estadoPago === 'al_dia';

  const response = NextResponse.json({
    authenticated: true,
    user: {
      userId: dbUser.userId,
      email: dbUser.email,
      nombre: dbUser.nombre,
      role: dbUser.role || 'user',
      plan: dbUser.plan,
      activo: isActivo,
      estadoPago: isExpired ? 'expirado' : dbUser.estadoPago,
      fechaExpiracion: dbUser.fechaExpiracion,
      postsUsados: dbUser.postsUsados,
      anunciosUsados: dbUser.anunciosUsados,
      closerRespuestasUsadas: dbUser.closerRespuestasUsadas,
    },
  });

  // Re-emitir cookie JWT con el estado más reciente de la DB para sincronización inmediata
  const updatedJwt = signJwt({
    userId: dbUser.userId,
    email: dbUser.email || session.email,
    nombre: dbUser.nombre || session.nombre,
    role: dbUser.role || session.role || 'user',
    plan: dbUser.plan,
    activo: isActivo,
    estadoPago: isExpired ? 'expirado' : (dbUser.estadoPago || 'inactivo'),
    fechaExpiracion: dbUser.fechaExpiracion,
  });

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: updatedJwt,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });

  return response;
}

