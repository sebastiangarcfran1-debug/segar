import crypto from 'crypto';
import { NextRequest } from 'next/server';

const AUTH_SECRET = process.env.JWT_SECRET || 'segar-secret-jwt-key-2026-production-chile';
export const AUTH_COOKIE_NAME = 'segar_auth_token';

export interface UserSessionPayload {
  userId: string;
  email: string;
  nombre: string;
  role: 'admin' | 'user';
  plan: string;
  activo: boolean;
  estadoPago: 'al_dia' | 'pendiente_transferencia' | 'moroso' | 'inactivo' | 'expirado';
  fechaExpiracion?: string;
  iat?: number;
  exp?: number;
}

/**
 * Hashea una contraseña usando HMAC-SHA256 con salt de aplicación
 */
export function hashPassword(password: string): string {
  const salt = 'segar_salt_2026';
  return crypto.createHmac('sha256', AUTH_SECRET).update(`${salt}:${password}`).digest('hex');
}

/**
 * Verifica una contraseña contra su hash guardado
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false;
  const hash = hashPassword(password);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
}

/**
 * Firma un token JWT compacto con HMAC-SHA256
 */
export function signJwt(payload: Omit<UserSessionPayload, 'iat' | 'exp'>, expiresInDays = 30): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresInDays * 86400;

  const fullPayload: UserSessionPayload = {
    ...payload,
    iat,
    exp,
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const toSign = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(toSign).digest('base64url');
  return `${toSign}.${signature}`;
}

/**
 * Verifica y decodifica un token JWT. Retorna null si es inválido o expiró.
 */
export function verifyJwt(token: string): UserSessionPayload | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const toSign = `${encodedHeader}.${encodedPayload}`;

  const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(toSign).digest('base64url');

  if (signature.length !== expectedSignature.length) return null;
  const valid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  if (!valid) return null;

  try {
    const payloadJson = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadJson) as UserSessionPayload;

    // Verificar expiración
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Extrae y valida la sesión de usuario desde una NextRequest (Cookies o Authorization Header)
 */
export function getSessionFromRequest(req: NextRequest): UserSessionPayload | null {
  // 1. Intentar desde cookie httpOnly
  const cookieToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (cookieToken) {
    const session = verifyJwt(cookieToken);
    if (session) return session;
  }

  // 2. Intentar desde header Authorization Bearer
  const authHeader = req.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.substring(7).trim();
    // Si es la clave maestra admin directa
    if (bearerToken === (process.env.ADMIN_PASSWORD || 'segar2026')) {
      return {
        userId: 'super_admin',
        email: 'operaciones.segar.ant@gmail.com',
        nombre: 'Director General',
        role: 'admin',
        plan: 'agencia',
        activo: true,
        estadoPago: 'al_dia',
      };
    }
    const session = verifyJwt(bearerToken);
    if (session) return session;
  }

  // 3. Header personalizado x-admin-key
  const customKey = req.headers.get('x-admin-key');
  if (customKey === (process.env.ADMIN_PASSWORD || 'segar2026')) {
    return {
      userId: 'super_admin',
      email: 'operaciones.segar.ant@gmail.com',
      nombre: 'Director General',
      role: 'admin',
      plan: 'agencia',
      activo: true,
      estadoPago: 'al_dia',
    };
  }

  return null;
}
