import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUserWithPassword } from '@/lib/db';
import { hashPassword, signJwt, AUTH_COOKIE_NAME } from '@/lib/auth';
import { notifyTelegramNewUserRegistered } from '@/lib/telegram';
import { PlanType } from '@/lib/credits';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, nombre, plan = 'pro', telefono, rubro } = body;

    if (!email || !password || !nombre) {
      return NextResponse.json(
        { error: 'Todos los campos obligatorios deben ser completados (email, contraseña, nombre)' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    const emailNorm = email.trim().toLowerCase();
    const existing = findUserByEmail(emailNorm);
    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta registrada con este correo electrónico. Inicia sesión.' },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);
    const user = createUserWithPassword({
      email: emailNorm,
      nombre: nombre.trim(),
      passwordHash,
      plan: (plan as PlanType) || 'pro',
      telefono,
      rubro,
      activo: false, // Inactivo hasta que pague en Flow o Copec Pay
    });

    // Disparar Evento 1 de Telegram: Nuevo usuario registrado
    try {
      await notifyTelegramNewUserRegistered({
        email: user.email || emailNorm,
        nombre: user.nombre || nombre,
        plan: user.plan,
        telefono: user.telefono,
      });
    } catch (tgErr) {
      console.error('Error enviando notificación Telegram de registro:', tgErr);
    }

    // Firmar JWT con rol 'user' y estado inactivo
    const token = signJwt({
      userId: user.userId,
      email: user.email || emailNorm,
      nombre: user.nombre || nombre,
      role: user.role || 'user',
      plan: user.plan,
      activo: user.activo,
      estadoPago: user.estadoPago || 'inactivo',
      fechaExpiracion: user.fechaExpiracion,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Cuenta creada con éxito. Procede con el pago para activar tu membresía.',
      user: {
        userId: user.userId,
        email: user.email,
        nombre: user.nombre,
        plan: user.plan,
        activo: user.activo,
        estadoPago: user.estadoPago,
      },
    });

    // Guardar cookie segura HttpOnly
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 días
    });

    return response;
  } catch (error: any) {
    console.error('Error en registro:', error);
    return NextResponse.json({ error: error.message || 'Error al procesar el registro' }, { status: 500 });
  }
}
