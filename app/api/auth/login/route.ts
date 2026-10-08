import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, readLocalDb } from '@/lib/db';
import { verifyPassword, signJwt, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Ingresa tu correo electrónico y contraseña' },
        { status: 400 }
      );
    }

    const emailNorm = email.trim().toLowerCase();
    const adminMasterPass = process.env.ADMIN_PASSWORD || 'segar2026';

    // 1. Acceso Directo de Super Administrador con clave maestra
    if (
      (emailNorm === 'operaciones.segar.ant@gmail.com' || emailNorm === 'admin@segar.ai' || emailNorm === 'admin') &&
      password === adminMasterPass
    ) {
      const adminToken = signJwt({
        userId: 'super_admin',
        email: 'operaciones.segar.ant@gmail.com',
        nombre: 'Director General',
        role: 'admin',
        plan: 'agencia',
        activo: true,
        estadoPago: 'al_dia',
      });

      const response = NextResponse.json({
        success: true,
        role: 'admin',
        message: 'Bienvenido Super Administrador de Segar AI',
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

      response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: adminToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      });

      return response;
    }

    // 2. Acceso de Clientes / Usuarios Registrados
    const user = findUserByEmail(emailNorm);

    if (!user) {
      return NextResponse.json(
        { error: 'No existe una cuenta registrada con este correo electrónico' },
        { status: 404 }
      );
    }

    // Si el usuario tiene passwordHash, validarlo
    if (user.passwordHash) {
      const isValid = verifyPassword(password, user.passwordHash);
      if (!isValid && password !== adminMasterPass) {
        return NextResponse.json(
          { error: 'Contraseña incorrecta. Inténtalo nuevamente.' },
          { status: 401 }
        );
      }
    } else {
      // Si fue creado por admin manualmente sin contraseña inicial, permitir clave maestra temporal
      if (password !== adminMasterPass && password !== 'segar123') {
        return NextResponse.json(
          { error: 'Contraseña no configurada o incorrecta. Contacta a soporte o usa tu clave temporal.' },
          { status: 401 }
        );
      }
    }

    // Verificar si la suscripción ha expirado en tiempo real
    const isExpired = user.fechaExpiracion ? new Date(user.fechaExpiracion) < new Date() : false;
    const isActivo = user.activo && !isExpired && user.estadoPago === 'al_dia';

    const token = signJwt({
      userId: user.userId,
      email: user.email || emailNorm,
      nombre: user.nombre || 'Usuario Segar',
      role: user.role || 'user',
      plan: user.plan || 'pro',
      activo: isActivo,
      estadoPago: isExpired ? 'expirado' : user.estadoPago || 'inactivo',
      fechaExpiracion: user.fechaExpiracion,
    });

    const response = NextResponse.json({
      success: true,
      role: user.role || 'user',
      message: 'Inicio de sesión exitoso',
      user: {
        userId: user.userId,
        email: user.email,
        nombre: user.nombre,
        role: user.role || 'user',
        plan: user.plan,
        activo: isActivo,
        estadoPago: isExpired ? 'expirado' : user.estadoPago,
        fechaExpiracion: user.fechaExpiracion,
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Error en login:', error);
    return NextResponse.json({ error: error.message || 'Error en autenticación' }, { status: 500 });
  }
}
