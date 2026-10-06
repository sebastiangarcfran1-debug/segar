'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simula autenticación o sincroniza con Firebase Auth
    setTimeout(() => {
      // Guardar sesión local de usuario
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'segar_user',
          JSON.stringify({
            email,
            nombre: isRegister ? nombre : 'Usuario Segar',
            isLoggedIn: true,
          })
        );
      }
      setLoading(false);
      router.push('/dashboard');
    }, 600);
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
              ? 'Crea tu cuenta gratis y accede a tu panel de marketing'
              : 'Ingresa a tu cuenta para gestionar tus posts y ventas'}
          </p>
        </div>

        {/* Card Formulario */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nombre o Negocio</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Tienda Austral"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                <Lock className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? 'Crear Cuenta y Entrar' : 'Iniciar Sesión'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px bg-slate-800 flex-1" />
            <span className="text-[11px] text-slate-500 font-medium">o continúa con</span>
            <div className="h-px bg-slate-800 flex-1" />
          </div>

          {/* Botón Google (Firebase Auth) */}
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                localStorage.setItem(
                  'segar_user',
                  JSON.stringify({
                    email: 'google_user@gmail.com',
                    nombre: 'Usuario Google',
                    isLoggedIn: true,
                  })
                );
                router.push('/dashboard');
              }, 400);
            }}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continuar con Google</span>
          </button>

          {/* Toggle Login/Registro */}
          <div className="mt-6 text-center text-xs text-slate-400">
            {isRegister ? (
              <p>
                ¿Ya tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="font-bold text-indigo-400 hover:text-indigo-300 transition"
                >
                  Inicia sesión aquí
                </button>
              </p>
            ) : (
              <p>
                ¿No tienes cuenta todavía?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="font-bold text-indigo-400 hover:text-indigo-300 transition"
                >
                  Regístrate gratis
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer de Seguridad */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-4">
          <Link href="/privacidad" className="hover:text-slate-400 transition">Política de Privacidad</Link>
          <span>•</span>
          <Link href="/terminos" className="hover:text-slate-400 transition">Términos del Servicio</Link>
        </div>
      </div>
    </div>
  );
}
