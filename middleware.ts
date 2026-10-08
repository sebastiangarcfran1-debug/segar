import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_SECRET = process.env.JWT_SECRET || 'segar-secret-jwt-key-2026-production-chile';
const AUTH_COOKIE_NAME = 'segar_auth_token';

// Helper Web Crypto nativo para verificación segura en Edge / Node Runtime
async function verifyJwtEdge(token: string): Promise<any | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [encodedHeader, encodedPayload, signature] = parts;

    // Decodificar payload
    const payloadJson = atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(payloadJson);

    // Verificar si el token expiró
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    // Importar clave secreta HMAC-SHA256
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(AUTH_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Convertir signature base64url a Uint8Array
    const binStr = atob(signature.replace(/-/g, '+').replace(/_/g, '/'));
    const sigBytes = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) {
      sigBytes[i] = binStr.charCodeAt(i);
    }

    const dataBytes = encoder.encode(`${encodedHeader}.${encodedPayload}`);
    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, dataBytes);

    return isValid ? payload : null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rutas exentas de verificación de sesión
  if (
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/terminos' ||
    pathname === '/privacidad' ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/webhooks') ||
    pathname.startsWith('/api/health') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  const cookieToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const authHeader = req.headers.get('authorization') || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : '';
  const adminKey = req.headers.get('x-admin-key');
  const masterSecret = process.env.ADMIN_PASSWORD || 'segar2026';

  const isMasterKey = bearerToken === masterSecret || adminKey === masterSecret;

  // 1. CONTROL DE ACCESO AL PANEL ADMINISTRATIVO (/admin y /dashboard/admin)
  if (
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/dashboard/admin' ||
    pathname.startsWith('/dashboard/admin/')
  ) {
    if (isMasterKey) {
      return NextResponse.next();
    }

    const token = cookieToken || bearerToken;
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'admin_required');
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyJwtEdge(token);
    if (!payload || payload.role !== 'admin') {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('error', 'unauthorized_role');
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 2. CONTROL DE ACCESO AL PANEL DE CLIENTES ACTIVOS (/dashboard)
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    // Los administradores tienen acceso irrestricto
    if (isMasterKey) {
      return NextResponse.next();
    }

    const token = cookieToken || bearerToken;
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyJwtEdge(token);
    if (!payload) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('error', 'sesion_invalida');
      return NextResponse.redirect(loginUrl);
    }

    // Administrador autenticado tiene acceso completo
    if (payload.role === 'admin') {
      return NextResponse.next();
    }

    // RESTRICCIÓN HERMÉTICA DE PAGO:
    // Si el usuario no está activo o su estado de suscripción es inactivo/expirado
    // Redirige de inmediato a la Landing informativa / pantalla de pago de Flow
    if (!payload.activo || payload.estadoPago === 'inactivo' || payload.estadoPago === 'expirado') {
      const checkoutUrl = new URL('/#precios', req.url);
      checkoutUrl.searchParams.set('pay_required', 'true');
      checkoutUrl.searchParams.set('plan', payload.plan || 'pro');
      checkoutUrl.searchParams.set('userId', payload.userId);
      return NextResponse.redirect(checkoutUrl);
    }

    // Verificar si la fecha de suscripción ya venció
    if (payload.fechaExpiracion && new Date(payload.fechaExpiracion) < new Date()) {
      const checkoutUrl = new URL('/#precios', req.url);
      checkoutUrl.searchParams.set('expired', 'true');
      checkoutUrl.searchParams.set('plan', payload.plan || 'pro');
      checkoutUrl.searchParams.set('userId', payload.userId);
      return NextResponse.redirect(checkoutUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/admin',
    '/admin/:path*',
  ],
};
