'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Sparkles, ArrowRight, Bot, ShieldCheck, Loader2 } from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'pro';
  const isMock = searchParams.get('mock') === 'true';

  useEffect(() => {
    // Si viene de pago real o simulado, podemos disparar la activación
    fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'activar_transferencia',
        userId: 'demo_user',
        plan,
      }),
    }).catch(console.error);
  }, [plan]);

  return (
    <div className="max-w-md w-full rounded-3xl border border-emerald-500/40 bg-slate-900/90 p-8 text-center shadow-2xl backdrop-blur-xl relative overflow-hidden">
      <div className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 rounded-full bg-emerald-500/20 blur-3xl" />

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-6 border border-emerald-500/30">
        <CheckCircle className="h-10 w-10" />
      </div>

      <span className="inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20 mb-3">
        ¡PAGO CONFIRMADO CON ÉXITO!
      </span>

      <h1 className="text-2xl font-black mb-2">¡Bienvenido a Segar AI!</h1>
      <p className="text-xs text-slate-300 mb-6 leading-relaxed">
        Tu suscripción al <strong>Plan {plan.toUpperCase()}</strong> ha sido activada en Firestore. Ahora tienes acceso a todo el poder de tu asistente de marketing.
      </p>

      <div className="space-y-3 mb-8 text-left rounded-2xl border border-slate-800 bg-[#0d1424] p-4 text-xs">
        <div className="flex items-center gap-2 text-slate-200">
          <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />
          <span>Créditos cargados automáticamente</span>
        </div>
        <div className="flex items-center gap-2 text-slate-200">
          <Bot className="h-4 w-4 text-purple-400 shrink-0" />
          <span>Bot de Telegram listo para vincular</span>
        </div>
        <div className="flex items-center gap-2 text-slate-200">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Garantía de servicio y soporte 24/7</span>
        </div>
      </div>

      <div className="space-y-3">
        <Link
          href="/dashboard/diagnostico"
          className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition"
        >
          Hacer Onboarding y Diagnóstico 360
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/dashboard"
          className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition block"
        >
          Ir al Panel Principal
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-6 text-white">
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-indigo-400 text-sm">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Cargando confirmación de suscripción...</span>
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
