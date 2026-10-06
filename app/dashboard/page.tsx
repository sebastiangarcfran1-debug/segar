'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  Calendar,
  MessageSquare,
  Bot,
  Zap,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const [user, setUser] = useState<any>({
    nombre: 'Mi Negocio Chile',
    rubro: 'Comercio / Tienda Online',
    plan: 'pro',
    postsUsados: 5,
    closerRespuestasUsadas: 18,
  });

  useEffect(() => {
    fetch('/api/admin')
      .then((res) => res.json())
      .then((data) => {
        const u = data?.users?.find((item: any) => item.userId === 'demo_user') || data?.users?.[0];
        if (u) setUser(u);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-[#0e1629] p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300 mb-3 border border-indigo-500/30">
            <Sparkles className="h-3.5 w-3.5" />
            Asistente de Marketing Digital 24/7 Activo
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            ¡Hola, {user.nombre || 'Emprendedor'}! 👋
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Tu sistema de marketing opera con <strong>$0 de costo de servidor</strong> utilizando Google Gemini Free Tier y Pollinations. Tienes listo el generador de 30 posts, el bot de Telegram y el Closer para WhatsApp.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/contenido"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
            >
              <Calendar className="h-4 w-4" />
              Generar 30 Posts del Mes
            </Link>
            <Link
              href="/dashboard/diagnostico"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              <Search className="h-4 w-4" />
              Ver Diagnóstico 360 & PDF
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Posts Activos</span>
            <Calendar className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{user.postsUsados || 5} <span className="text-xs text-slate-400 font-normal">/ {user.plan === 'emprendedor' ? 30 : user.plan === 'pro' ? 100 : 300}</span></div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">Grilla editorial lista</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Closer de Ventas</span>
            <MessageSquare className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{user.closerRespuestasUsadas || 18} <span className="text-xs text-slate-400 font-normal">respuestas</span></div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">Conectado a WhatsApp</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Bot de Telegram</span>
            <Bot className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">Activo</div>
          <span className="text-[11px] text-indigo-400 font-semibold mt-1 block">Aprobación en 1 toque</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Costo Mensual de IA</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">$0 USD</div>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">100% Free Tier</span>
        </div>
      </div>

      {/* Quick Launchpad */}
      <div>
        <h2 className="text-base font-bold text-white mb-4">Herramientas Principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/dashboard/contenido"
            className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-indigo-500/50 hover:bg-slate-900/80 transition flex flex-col justify-between"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-1">Fábrica de 30 Posts & Anuncios</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Genera la grilla de contenido del mes completo con ganchos persuasivos, fotos publicitarias y guiones de video para TikTok con CapCut.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
              <span>Abrir fábrica</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          <Link
            href="/dashboard/closer"
            className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-emerald-500/50 hover:bg-slate-900/80 transition flex flex-col justify-between"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-1">Closer de Ventas IA</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Entrena a la IA con el PDF de tu catálogo y déjala cerrando ventas en WhatsApp, Facebook e Instagram con técnicas de cierre directo.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
              <span>Simular o conectar inbox</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          <Link
            href="/dashboard/telegram"
            className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-purple-500/50 hover:bg-slate-900/80 transition flex flex-col justify-between"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Bot className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-1">Panel de Control Telegram</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prueba en vivo la tarjeta interactiva de aprobación que recibes en tu celular para aprobar o pedir correcciones a Gemini con 1 clic.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-purple-400 group-hover:text-purple-300">
              <span>Ver panel de bot</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
