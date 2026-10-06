'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  Zap,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  Send,
  Calendar,
  CreditCard,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  Building,
  Smartphone,
  Copy,
  ExternalLink,
} from 'lucide-react';

export default function LandingPage() {
  const [currency, setCurrency] = useState<'CLP' | 'USD'>('CLP');
  const [transferModalPlan, setTransferModalPlan] = useState<string | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);
  const [costoAgencia, setCostoAgencia] = useState(350000);

  const plans = [
    {
      id: 'emprendedor',
      nombre: 'Plan Emprendedor',
      descripcion: 'Para emprendedores que necesitan presencia constante y cerrar ventas todos los días.',
      precioCLP: '$15.000',
      precioUSD: '$17 USD',
      periodo: '/mes',
      destacado: false,
      caracteristicas: [
        '30 publicaciones del mes con copies y ganchos',
        'Imágenes publicitarias generadas con IA (100% gratis)',
        'Diagnóstico 360 y Plan de Marketing en PDF',
        'Closer de Ventas IA: 200 respuestas automáticas/mes',
        'Control móvil vía Bot de Telegram (Aprobar/Corregir)',
        'Horarios óptimos de publicación para Chile/Latam',
      ],
      cta: 'Elegir Plan Emprendedor',
    },
    {
      id: 'pro',
      nombre: 'Plan Pro',
      badge: 'MÁS POPULAR EN CHILE 🇨🇱',
      descripcion: 'Para negocios en crecimiento que quieren dominar su rubro y escalar ventas.',
      precioCLP: '$29.900',
      precioUSD: '$33 USD',
      periodo: '/mes',
      destacado: true,
      caracteristicas: [
        '100 publicaciones mensuales con imágenes HD',
        'Creador de Anuncios: 15 sets de copys y headlines',
        'Guiones de video para TikTok/Reels con CapCut',
        'Closer de Ventas IA: 1.000 respuestas en WhatsApp/IG',
        'Entrenamiento con el catálogo y PDF de tu negocio',
        'Soporte prioritario y acceso a nuevas herramientas',
        'Bot de Telegram con reescritura ilimitada',
      ],
      cta: 'Quiero Escalar con el Plan Pro',
    },
    {
      id: 'agencia',
      nombre: 'Plan Agencia',
      descripcion: 'Para agencias y profesionales que gestionan múltiples marcas o clientes.',
      precioCLP: '$59.900',
      precioUSD: '$67 USD',
      periodo: '/mes',
      destacado: false,
      caracteristicas: [
        'Hasta 3 marcas o clientes simultáneos',
        '300 publicaciones y creativos mensuales',
        'Closer de Ventas IA: 3.000 respuestas mensuales',
        'Reportes de diagnóstico en PDF con tu logo',
        'Modo Agencia con autopromoción automática',
        'Acceso al Panel Super Administrador de clientes',
      ],
      cta: 'Adquirir Plan Agencia',
    },
  ];

  const handlePayment = async (planId: string) => {
    setLoadingCheckout(planId);
    try {
      const res = await fetch('/api/checkout/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          userEmail: 'cliente@segar.ai',
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        window.location.href = `/checkout/success?plan=${planId}&flow_mock=true`;
      }
    } catch (err) {
      console.error(err);
      window.location.href = `/checkout/success?plan=${planId}&flow_mock=true`;
    } finally {
      setLoadingCheckout(null);
    }
  };

  const getWhatsAppTransferLink = (planName: string, monto: string) => {
    const texto = encodeURIComponent(
      `¡Hola equipo de Segar AI Marketing! Acabo de hacer la transferencia para activar mi membresía "${planName}" (${monto} ${currency}). Adjunto mi comprobante para que activen mi cuenta. Mi correo es:`
    );
    return `https://wa.me/56912345678?text=${texto}`;
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-600/10 blur-[130px]" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#070b14]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
              <Sparkles className="h-5 w-5" />
            </span>
            <span>SEGAR <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AI MARKETING</span></span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
            <a href="#solucion" className="hover:text-white transition">Qué hace</a>
            <a href="#planes" className="hover:text-white transition">Planes $0</a>
            <a href="#bot-telegram" className="hover:text-white transition">Bot Telegram</a>
            <a href="#faq" className="hover:text-white transition">Preguntas Frecuentes</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 border border-slate-700"
            >
              Panel Pyme
              <ChevronRight className="h-4 w-4" />
            </Link>
            <a
              href="#planes"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
            >
              Comenzar Ahora
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-20 text-center lg:pt-24">
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 mb-6 backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            🇨🇱 100% Optimizado para el mercado chileno y Latinoamérica
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
            Tu Director de Marketing con IA.{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Sin pagar sueldos de agencia.
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-300 sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Genera tus <strong>30 publicaciones del mes</strong> con fotos publicitarias, crea anuncios con guiones para TikTok y activa un <strong>Closer de Ventas</strong> que atiende y cierra clientes por WhatsApp 24/7.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#planes"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-600/25 transition hover:scale-[1.02]"
            >
              <Zap className="h-5 w-5" />
              Probar Ahora desde $15.000 CLP
            </a>
            <Link
              href="/dashboard/diagnostico"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-700 px-6 py-4 text-base font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              Auditoría 360 de tu Instagram
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Sin contratos ni permanencia</span>
            <span className="flex items-center gap-1.5"><CreditCard className="h-4 w-4 text-indigo-400" /> Webpay Plus / Flow.cl (Tarjetas / Mach)</span>
            <span className="flex items-center gap-1.5"><Smartphone className="h-4 w-4 text-purple-400" /> Transferencia CuentaRUT / Banco Estado</span>
          </div>
        </div>

        {/* Live Mockup Demo Box */}
        <div className="mt-16 mx-auto max-w-5xl rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500" />
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="ml-2 text-xs font-mono text-slate-400">segar-control-panel-chile.app</span>
            </div>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 font-semibold px-2.5 py-1 rounded-md">
              Gemini 2.0 Flash + Pollinations AI ($0 Costo)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Box 1: 30 Posts */}
            <div className="rounded-xl border border-slate-800 bg-[#0d1424] p-5">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-3">
                <Calendar className="h-4 w-4" />
                Fábrica 30 Posts
              </div>
              <h4 className="text-white font-bold text-base mb-1">Día 7: La Oferta Flash</h4>
              <p className="text-xs text-slate-300 line-clamp-3 mb-3">
                "¿Todavía esperando para renovar tu compra? Envíos gratis a todo Chile solo por hoy. Comenta QUIERO y te enviamos el link directo..."
              </p>
              <div className="h-28 rounded-lg overflow-hidden relative border border-slate-700 bg-slate-800">
                <img
                  src="https://image.pollinations.ai/prompt/chilean%20boutique%20product%20minimalist%20commercial%20advertising?width=400&height=250&nologo=true"
                  alt="Post preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="mt-3 block text-[11px] text-emerald-400 font-medium">⏰ Horario sugerido: 19:45 hrs (Peak Chile)</span>
            </div>

            {/* Box 2: Closer WhatsApp */}
            <div className="rounded-xl border border-slate-800 bg-[#0d1424] p-5">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-3">
                <MessageSquare className="h-4 w-4" />
                Closer de Ventas IA
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="bg-slate-800/80 p-2.5 rounded-lg text-slate-200">
                  <span className="text-[10px] text-slate-400 block font-semibold">Cliente:</span>
                  "Hola, ¿cuánto vale y cuánto se demora a Concepción?"
                </div>
                <div className="bg-indigo-950/80 border border-indigo-700/40 p-2.5 rounded-lg text-indigo-100">
                  <span className="text-[10px] text-indigo-300 block font-semibold">Segar Closer IA:</span>
                  "¡Hola! Qué gusto saludarte. Está en $24.900 con garantía oficial. A Concepción llega en 48 hrs hábiles por Starken. ¿Te gustaría pagar con tarjeta o transferencia para reservarte el stock hoy? 📦"
                </div>
              </div>
              <div className="mt-3 text-[11px] text-slate-400">
                ⚡ Tiempo de respuesta: <strong>4 segundos</strong>
              </div>
            </div>

            {/* Box 3: Telegram Control */}
            <div className="rounded-xl border border-slate-800 bg-[#0d1424] p-5">
              <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm mb-3">
                <Bot className="h-4 w-4" />
                Bot de Control en tu Celular
              </div>
              <p className="text-xs text-slate-300 mb-3">
                Recibes cada post en tu Telegram antes de publicarse. Tienes 3 botones instantáneos:
              </p>
              <div className="space-y-2">
                <button className="w-full text-xs font-semibold py-2 px-3 rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-left flex items-center justify-between">
                  <span>✅ Aprobar y Publicar</span>
                  <span className="text-[10px]">1 toque</span>
                </button>
                <button className="w-full text-xs font-semibold py-2 px-3 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-left flex items-center justify-between">
                  <span>✏️ Corregir con IA</span>
                  <span className="text-[10px]">Reescribe Gemini</span>
                </button>
                <button className="w-full text-xs font-semibold py-2 px-3 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 text-left">
                  <span>❌ Rechazar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions / Pillars */}
      <section id="solucion" className="py-20 border-t border-slate-800 bg-[#0a0f1d] px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Todo lo que necesitas en 1 solo lugar</h2>
            <h3 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Diseñado para pymes que no tienen tiempo que perder
            </h3>
            <p className="mt-4 text-slate-400">
              Elimina los dolores de cabeza de no saber qué publicar, contratar community managers caros o perder ventas porque nadie responde los mensajes a tiempo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-indigo-500/50 transition">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5">
                <Calendar className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">30 Posts con Imágenes</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Gemini redacta copys de alta persuasión y Pollinations genera la foto del producto sin costo adicional.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-purple-500/50 transition">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Closer de Ventas 24/7</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Atiende WhatsApp e Instagram. Conoce tus precios, rebate objeciones y envía links de pago para cerrar en el acto.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-pink-500/50 transition">
              <div className="h-12 w-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-5">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Anuncios & Guiones Reels</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                5 headlines, 5 copys y 3 guiones paso a paso para grabar con tu celular con clips libres de Pexels y plantillas CapCut.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-emerald-500/50 transition">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5">
                <Bot className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Bot Telegram en tu Bolsillo</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Aprueba, pide ajustes o rechaza cualquier post desde tu Telegram sin tener que abrir el computador.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculadora de Ahorro y ROI */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#0a0f1d] via-[#070c18] to-[#070b14] border-t border-slate-800">
        <div className="mx-auto max-w-5xl rounded-3xl border border-indigo-500/30 bg-slate-900/80 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-400">
              🇨🇱 CALCULADORA DE AHORRO PYME
            </span>
            <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold text-white">
              ¿Cuánto dinero estás dejando sobre la mesa?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Desliza para comparar el costo de un Community Manager o agencia tradicional vs tu asistente Segar AI.
            </p>
          </div>

          <div className="max-w-xl mx-auto space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-slate-300">Costo mensual agencia / freelance:</span>
                <span className="text-lg font-black text-indigo-400 font-mono">
                  ${costoAgencia.toLocaleString('es-CL')} CLP/mes
                </span>
              </div>
              <input
                type="range"
                min={150000}
                max={1200000}
                step={25000}
                value={costoAgencia}
                onChange={(e) => setCostoAgencia(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>$150.000 CLP (Freelance básico)</span>
                <span>$500.000 CLP (Agencia media)</span>
                <span>$1.200.000+ CLP (Equipo interno)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-5 text-center">
                <span className="text-xs text-slate-400 font-semibold block mb-1">Costo Anual Agencia Tradicional</span>
                <span className="text-2xl font-black text-slate-300">
                  ${(costoAgencia * 12).toLocaleString('es-CL')} CLP
                </span>
                <span className="text-[11px] text-rose-400 block mt-1">Gasto fijo sin garantía de ventas</span>
              </div>

              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-5 text-center relative overflow-hidden">
                <div className="absolute top-2 right-2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5">
                  Plan Pro
                </div>
                <span className="text-xs text-emerald-300 font-semibold block mb-1">Costo Anual Segar AI Pro</span>
                <span className="text-2xl font-black text-emerald-400">
                  ${(29900 * 12).toLocaleString('es-CL')} CLP
                </span>
                <span className="text-[11px] text-emerald-300 block mt-1">Incluye 100 posts + Closer WhatsApp 24/7</span>
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 to-purple-950/40 p-6 text-center space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-300">
                Tu Ahorro Neto Anual Garantizado:
              </span>
              <div className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                ${((costoAgencia * 12) - (29900 * 12)).toLocaleString('es-CL')} CLP
              </div>
              <p className="text-xs text-emerald-300 font-medium">
                ¡Ahorras un {Math.round(((costoAgencia - 29900) / costoAgencia) * 100)}% de tu presupuesto de marketing cada año!
              </p>
              <div className="pt-2">
                <a
                  href="#planes"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
                >
                  <TrendingUp className="h-4 w-4" />
                  Activar este Ahorro Hoy Mismo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planes" className="py-24 px-6 relative">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="rounded-full bg-indigo-500/10 border border-indigo-500/30 px-4 py-1 text-xs font-semibold text-indigo-300">
              PRECIOS TRANSPARENTES
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-5xl">
              Elige tu plan y empieza a vender hoy
            </h2>
            <p className="mt-4 text-slate-300">
              Paga en pesos chilenos con <strong>Mercado Pago</strong> o por <strong>Transferencia bancaria directa</strong>. Sin costos ocultos.
            </p>

            {/* Currency Switcher */}
            <div className="mt-8 inline-flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1">
              <button
                onClick={() => setCurrency('CLP')}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                  currency === 'CLP' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🇨🇱 Pesos Chilenos (CLP)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                  currency === 'USD' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🌎 Dólares (USD)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((p) => {
              const precio = currency === 'CLP' ? p.precioCLP : p.precioUSD;
              return (
                <div
                  key={p.id}
                  className={`relative flex flex-col rounded-3xl border p-8 transition hover:scale-[1.01] ${
                    p.destacado
                      ? 'border-indigo-500 bg-gradient-to-b from-indigo-950/60 via-slate-900 to-[#0c1220] shadow-2xl shadow-indigo-500/20'
                      : 'border-slate-800 bg-slate-900/50'
                  }`}
                >
                  {p.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-1 text-[11px] font-extrabold tracking-wider text-white shadow-lg">
                      {p.badge}
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white">{p.nombre}</h3>
                    <p className="mt-2 text-xs text-slate-400 min-h-[32px]">{p.descripcion}</p>
                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-white tracking-tight">{precio}</span>
                      <span className="text-xs text-slate-400 font-semibold">{p.periodo}</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3 mb-8">
                    {p.caracteristicas.map((c, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2.5">
                    {/* Botón Flow.cl / Webpay */}
                    <button
                      onClick={() => handlePayment(p.id)}
                      disabled={loadingCheckout === p.id}
                      className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                        p.destacado
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 hover:opacity-95'
                          : 'bg-white text-slate-900 hover:bg-slate-100 font-extrabold'
                      }`}
                    >
                      {loadingCheckout === p.id ? (
                        'Conectando a Flow.cl...'
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4" />
                          Pagar con Webpay / Flow.cl
                        </>
                      )}
                    </button>

                    {/* Botón Transferencia Bancaria */}
                    <button
                      onClick={() => setTransferModalPlan(p.id)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 border border-slate-700 bg-slate-800/80 hover:bg-slate-700 transition flex items-center justify-center gap-2"
                    >
                      <Building className="h-3.5 w-3.5 text-indigo-400" />
                      Pagar por Transferencia / CuentaRUT
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal de Transferencia Bancaria Directa */}
      {transferModalPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-[#0d1424] p-6 shadow-2xl">
            <button
              onClick={() => setTransferModalPlan(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Datos de Transferencia Bancaria</h3>
                <p className="text-xs text-slate-400">Activación inmediata sin comisiones extra</p>
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Destinatario:</span>
                <span className="font-semibold text-white">Segar AI Marketing SpA</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">RUT:</span>
                <span className="font-semibold text-white">77.123.456-7</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Banco:</span>
                <span className="font-semibold text-white">Banco Estado / Cuenta RUT</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Tipo de Cuenta:</span>
                <span className="font-semibold text-white">Cuenta Vista / RUT</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">N° de Cuenta:</span>
                <span className="font-semibold text-white">123456789</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email comprobante:</span>
                <span className="font-semibold text-indigo-300">pagos@segar.ai</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs">
              💡 <strong>Paso siguiente:</strong> Transfiere el monto correspondiente y haz clic abajo para enviar tu comprobante directo a nuestro WhatsApp. Te activamos la membresía en menos de 10 minutos.
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <a
                href={getWhatsAppTransferLink(
                  transferModalPlan.toUpperCase(),
                  transferModalPlan === 'emprendedor' ? '$15.000' : transferModalPlan === 'pro' ? '$29.900' : '$59.900'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
              >
                <Send className="h-4 w-4" />
                Enviar Comprobante por WhatsApp
              </a>
              <button
                onClick={() => setTransferModalPlan(null)}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-white"
              >
                Cerrar ventana
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-t border-slate-800 bg-[#080d1a] px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white">Preguntas Frecuentes</h2>
            <p className="mt-2 text-sm text-slate-400">Todo lo que necesitas saber antes de contratar</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <h4 className="font-bold text-white text-sm mb-2">¿Cómo funciona el bot de Telegram?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Creas un bot 100% gratuito en Telegram hablando con @BotFather. Cuando Segar genera tus posts, el bot te los manda a tu celular con su foto y texto. Si te gusta presionas "Aprobar", si quieres cambios le escribes por qué y Gemini reescribe el post al instante.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <h4 className="font-bold text-white text-sm mb-2">¿Cómo responde el Closer de Ventas en mi WhatsApp?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Utiliza la API oficial gratuita de WhatsApp Cloud de Meta (hasta 1.000 conversaciones gratis al mes). Gemini actúa como tu vendedor experto: conoce tus productos, responde dudas al segundo y guía al cliente hacia el pago.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <h4 className="font-bold text-white text-sm mb-2">¿Por qué es 10 veces más barato que una agencia tradicional?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Una agencia tradicional cobra entre $300.000 y $700.000 CLP al mes por redactores y diseñadores que se demoran días. Segar AI corre sobre infraestructura de costo cero (Google Gemini Free Tier, Pollinations y Firebase), trasladándote ese ahorro del 95% a ti.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <h4 className="font-bold text-white text-sm mb-2">¿Puedo pagar con Cuenta RUT o transferencia?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                ¡Sí! Puedes pagar en cuotas con tarjeta a través de Mercado Pago o transferir directamente a nuestra cuenta Banco Estado y enviarnos el comprobante por WhatsApp para activación inmediata.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#050811] py-12 px-6 text-slate-400 text-xs">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>SEGAR AI MARKETING — Chile & Latam</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-white transition">Acceso Clientes</Link>
            <Link href="/dashboard/admin" className="hover:text-white transition">Super Admin</Link>
            <a href="https://wa.me/56912345678" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              Soporte WhatsApp
            </a>
          </div>

          <p>© 2026 Segar AI Marketing. Potenciado por Google Gemini & Pollinations.</p>
        </div>
      </footer>
    </div>
  );
}
