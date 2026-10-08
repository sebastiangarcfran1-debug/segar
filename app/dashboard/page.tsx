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
  ShieldCheck,
  TrendingUp,
  Image as ImageIcon,
  Video,
  Brain,
  Crosshair,
  Users,
  Palette,
  ExternalLink,
  DollarSign,
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

  const herramientas = [
    {
      titulo: 'Banner & Ad Studio Pro',
      subtitulo: 'AdCreative.ai Suite',
      badge: 'Banners 1:1, 9:16 y 16:9',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      icono: Sparkles,
      colorIcono: 'text-indigo-400 bg-indigo-500/10',
      descripcion: 'Compón creatividades publicitarias con logos, badges de descuento, precios en $ CLP y descarga en alta definición PNG.',
      href: '/dashboard/banner-studio',
      cta: 'Abrir Banner Studio',
    },
    {
      titulo: 'Video Ads & Guiones Reels',
      subtitulo: 'CapCut & Hormozi Engine',
      badge: 'Retención Viral',
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      icono: Video,
      colorIcono: 'text-pink-400 bg-pink-500/10',
      descripcion: 'Guiones en 4 escenas con ganchos de 3 segundos, textos amarillos estilo Hormozi y locutor de voz IA en vivo.',
      href: '/dashboard/video-ads',
      cta: 'Generar Video Ad',
    },
    {
      titulo: 'Cerebro RAG del Negocio',
      subtitulo: 'Jasper Brand Voice',
      badge: 'Cero Alucinaciones',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icono: Brain,
      colorIcono: 'text-purple-400 bg-purple-500/10',
      descripcion: 'Memoriza tus productos, precios reales en $ CLP, horarios, políticas de envío y garantías para vender con datos exactos.',
      href: '/dashboard/cerebro',
      cta: 'Configurar Memoria IA',
    },
    {
      titulo: 'Calendario Drag & Drop',
      subtitulo: 'Metricool / Buffer',
      badge: 'Omnicanal',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      icono: Calendar,
      colorIcono: 'text-teal-400 bg-teal-500/10',
      descripcion: 'Vista mensual panorámica. Arrastra publicaciones entre días, detecta picos de audiencia y exporta a Meta Business Suite.',
      href: '/dashboard/calendario',
      cta: 'Ver Calendario',
    },
    {
      titulo: 'CRM & Pipeline de Ventas',
      subtitulo: 'GoHighLevel Suite',
      badge: 'Cierre en WhatsApp',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icono: Users,
      colorIcono: 'text-emerald-400 bg-emerald-500/10',
      descripcion: 'Tablero Kanban para no perder ningún prospecto en WhatsApp. Mide el dinero en juego y abre conversaciones en 1 clic.',
      href: '/dashboard/crm',
      cta: 'Abrir Embudo de Ventas',
    },
    {
      titulo: 'Fábrica de 30 Posts & Ads',
      subtitulo: 'Predis.ai Suite',
      badge: '30 Días de Contenido',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      icono: Sparkles,
      colorIcono: 'text-blue-400 bg-blue-500/10',
      descripcion: 'Grilla de 30 días con imágenes Pollinations Flux HD, carruseles de 5 diapositivas y Score de Conversión IA.',
      href: '/dashboard/contenido',
      cta: 'Crear Grilla Editorial',
    },
    {
      titulo: 'Radar de Competencia',
      subtitulo: 'Spy Commercial Radar',
      badge: 'Contra-Ataque',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icono: Crosshair,
      colorIcono: 'text-amber-400 bg-amber-500/10',
      descripcion: 'Espía el Instagram de tus competidores, extrae sus 3 puntos débiles y crea anuncios de contra-ataque para robar su clientela.',
      href: '/dashboard/radar',
      cta: 'Escanear Rivales',
    },
    {
      titulo: 'Brand Kit & Voz de Marca',
      subtitulo: 'Identidad Corporativa',
      badge: 'Psicología Chilena 🇨🇱',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icono: Palette,
      colorIcono: 'text-rose-400 bg-rose-500/10',
      descripcion: 'Paletas de colores, logotipos y selector de tono psicológico (Canchero Chileno, Vendedor Directo o Corporativo).',
      href: '/dashboard/brand-kit',
      cta: 'Ajustar Brand Kit',
    },
    {
      titulo: 'Closer de Ventas IA',
      subtitulo: 'WhatsApp & Direct',
      badge: 'Cierre 24/7',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icono: MessageSquare,
      colorIcono: 'text-emerald-400 bg-emerald-500/10',
      descripcion: 'Respuestas persuasivas y generador de enlaces de WhatsApp listos para colocar en la biografía de tus redes sociales.',
      href: '/dashboard/closer',
      cta: 'Abrir Closer',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner de Bienvenida */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-[#0e1629] p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300 mb-3 border border-indigo-500/30">
            <Sparkles className="h-3.5 w-3.5" />
            <span>PLATAFORMA INTEGRAL DE MARKETING & CRECIMIENTO AUTOMÁTICO</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Bienvenido a tu Central de Marketing, {user.nombre || 'Emprendedor'}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Tu negocio cuenta con la suite más avanzada del mercado: creación de banners gráficos tipo AdCreative,
            guiones de video viral con voz en off, calendario drag & drop, CRM de ventas y memoria RAG sin costo alguno de servidor.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/banner-studio"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 active:scale-95 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>Diseñar Banner Pro</span>
            </Link>
            <Link
              href="/dashboard/crm"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600/30 border border-emerald-500/40 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-600 hover:text-white transition"
            >
              <Users className="h-4 w-4" />
              <span>Ver Embudo de Ventas</span>
            </Link>
            <Link
              href="/dashboard/cerebro"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              <Brain className="h-4 w-4" />
              <span>Ajustar Memoria RAG</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Métricas Principales de Operación */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Plan Activo</span>
            <ShieldCheck className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-white uppercase">Membresía {user.plan || 'Pro'}</p>
          <span className="text-[10px] text-emerald-400 font-semibold block">Operación 24/7 en Vivo</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Posts & Banners</span>
            <Calendar className="h-4 w-4 text-pink-400" />
          </div>
          <p className="text-2xl font-black text-white">{user.postsUsados || 5} <span className="text-xs text-slate-400 font-normal">creados</span></p>
          <span className="text-[10px] text-indigo-400 font-semibold block">Listos para Publicar</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Closer de Ventas</span>
            <MessageSquare className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">{user.closerRespuestasUsadas || 18} <span className="text-xs text-slate-400 font-normal">cierres</span></p>
          <span className="text-[10px] text-emerald-300 font-semibold block">WhatsApp Optimizado</span>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Costo Servidor</span>
            <Zap className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-300">$0 CLP</p>
          <span className="text-[10px] text-emerald-400/80 block">Infraestructura Libre de Cargos</span>
        </div>
      </div>

      {/* Grid de las 9 Herramientas Mundiales */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>Suite Completa de Herramientas de Nivel Mundial</span>
          </h2>
          <span className="text-xs text-slate-400">9 Módulos Operativos Activos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {herramientas.map((h, i) => {
            const Icon = h.icono;
            return (
              <Link
                key={i}
                href={h.href}
                className="group rounded-2xl border border-slate-800 bg-[#0d1424] p-5 hover:border-indigo-500/60 hover:bg-[#111a30] transition flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${h.colorIcono} group-hover:scale-110 transition`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${h.badgeColor}`}>
                      {h.badge}
                    </span>
                  </div>

                  <h3 className="font-black text-white text-base leading-snug group-hover:text-indigo-300 transition">
                    {h.titulo}
                  </h3>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 mb-2">
                    {h.subtitulo}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {h.descripcion}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                  <span>{h.cta}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
