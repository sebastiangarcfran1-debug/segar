'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Loader2, Building, User } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [plan, setPlan] = useState('pro');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'admin_required') {
      setErrorMessage('Se requiere acceso de Administrador para ver esta sección.');
    } else if (errorParam === 'unauthorized_role') {
      setErrorMessage('Tu rol no tiene privilegios de Administrador.');
    } else if (errorParam === 'sesion_invalida' || errorParam === 'sesion_expirada') {
      setErrorMessage('Tu sesión ha expirado. Ingresa nuevamente.');
    }

    const payRequired = searchParams.get('pay_required');
    if (payRequired) {
      setErrorMessage('Tu membresía está inactiva o pendiente de pago. Actívala para acceder al panel.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const body = isRegister
        ? { email, password, nombre, plan }
        : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Error al procesar la solicitud');
        setLoading(false);
        return;
      }

      // Si es registro exitoso
      if (isRegister) {
        setSuccessMessage('¡Cuenta creada con éxito! Redirigiendo a activación de membresía...');
        setTimeout(() => {
          router.push(`/#precios?userId=${data.user.userId}&plan=${plan}`);
        }, 1200);
        return;
      }

      // Si es login exitoso
      setSuccessMessage('¡Bienvenido! Cargando tu panel...');

      const redirectUrl = searchParams.get('redirect');

      setTimeout(() => {
        if (data.role === 'admin' || data.user?.role === 'admin') {
          router.push(redirectUrl || '/admin');
        } else if (!data.user?.activo || data.user?.estadoPago === 'inactivo' || data.user?.estadoPago === 'expirado') {
          router.push(`/#precios?pay_required=true&userId=${data.user.userId}&plan=${data.user.plan || 'pro'}`);
        } else {
          router.push(redirectUrl || '/dashboard');
        }
      }, 700);
    } catch (err: any) {
      setErrorMessage('Error de conexión con el servidor. Intenta nuevamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col justify-center items-center p-6 text-white relative overflow-hidden">
      {/* Glow de fondo */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-600/10 blur-[130px]" />

      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-white mb-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
              <Sparkles className="h-5 w-5" />
            </span>
            <span>SEGAR <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AI MARKETING</span></span>
          </Link>
          <p className="text-xs text-slate-400">
            {isRegister
              ? 'Regístrate para automatizar tus ventas y marketing con IA'
              : 'Ingresa a tu cuenta privada para acceder a tus herramientas'}
          </p>
        </div>

        {/* Card Formulario */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
          {errorMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nombre o Nombre del Negocio</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ej: Joyería Luna Santiago"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                  <Building className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Correo Electrónico</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="tu@email.cl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                <Mail className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                <Lock className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Plan Deseado</label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="emprendedor">Plan Emprendedor ($15.000 CLP/mes)</option>
                  <option value="pro">Plan Pro ($29.900 CLP/mes - Recomendado)</option>
                  <option value="agencia">Plan Agencia ($59.900 CLP/mes)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <span>{isRegister ? 'Crear Cuenta y Continuar al Pago' : 'Entrar a Mi Panel'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Alternar Registro / Login */}
          <div className="mt-6 text-center border-t border-slate-800/80 pt-4">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition"
            >
              {isRegister
                ? '¿Ya tienes una cuenta registrada? Inicia sesión aquí'
                : '¿No tienes cuenta todavía? Regístrate en 30 segundos'}
            </button>
          </div>
        </div>

        {/* Garantías y Seguridad */}
        <div className="mt-8 flex items-center justify-center gap-6 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Encriptación JWT Segura</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-indigo-400" />
            <span>Integración Flow Webpay Plus</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-white">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
