'use client';

import React, { useState } from 'react';
import {
  Megaphone,
  Sparkles,
  Share2,
  Copy,
  Check,
  Gift,
  Users,
  TrendingUp,
  Target,
  ArrowRight,
  Bot,
  Play,
  Loader2,
  Instagram,
  Facebook,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export default function AgenciaPage() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPostIdx, setCopiedPostIdx] = useState<number | null>(null);

  // Estado del Piloto Automático
  const [loadingAutoPost, setLoadingAutoPost] = useState(false);
  const [autoPostResult, setAutoPostResult] = useState<any>(null);

  const referralLink = 'https://segar.ai/?ref=segar_vip_chile_2026';

  const postsAutopromocion = [
    {
      dia: 'Lunes',
      tema: 'El error del Community Manager caro',
      copy: `¿Pagas más de $350.000 CLP al mes por 12 posts que nadie ve? 🚨\n\nEl problema de la mayoría de las agencias no es la falta de diseño, es que no tienen ganchos de venta y se demoran 2 semanas en corregir un post.\n\nEn Segar AI Marketing tu pyme tiene:\n✅ 30 posts con imágenes de estudio en 10 segundos\n✅ Closer de ventas en WhatsApp 24/7\n✅ Desde solo $15.000 CLP/mes sin contratos\n\n👉 Comenta 'MARKETING' y te regalamos la auditoría 360 de tu Instagram hoy mismo.`,
      cta: 'Captar pymes descontentas con agencias',
    },
    {
      dia: 'Miércoles',
      tema: 'Cómo vender por WhatsApp mientras duermes',
      copy: `El 73% de las ventas en Chile se pierden porque el cliente pregunta precio a las 23:00 hrs y le responden al día siguiente a las 11:00 am. 😴\n\nTu cliente ya le compró a la competencia.\n\nActiva un Closer con Inteligencia Artificial entrenado con tu catálogo de productos que responde en 4 segundos, rebate dudas y pasa el link de pago al instante.\n\n📲 Toca el enlace de nuestro perfil y pruébalo gratis.`,
      cta: 'Venta de urgencia por atención lenta',
    },
    {
      dia: 'Viernes',
      tema: '30 días de contenido por menos de lo que gastas en almuerzos',
      copy: `Hagamos números sinceros: Un café y un almuerzo ejecutivo en Santiago = $15.000 CLP. ☕🥗\n\nPor ese mismo valor, tienes todo tu mes de marketing digital resuelto con Segar AI.\n\nSin aprender prompts complicados. Todo en español chileno y directo a tu celular por Telegram.\n\n🔥 Cupos con precio de lanzamiento para las primeras 250 pymes. Link en bio.`,
      cta: 'Comparación de precio ridículo',
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyPost = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPostIdx(idx);
    setTimeout(() => setCopiedPostIdx(null), 2000);
  };

  const dispararPilotoAutomatico = async () => {
    setLoadingAutoPost(true);
    setAutoPostResult(null);
    try {
      const res = await fetch('/api/cron/autopromocion', {
        method: 'POST',
      });
      const data = await res.json();
      setAutoPostResult(data);
    } catch (err: any) {
      console.error(err);
      alert('Error ejecutando autopromoción automática.');
    } finally {
      setLoadingAutoPost(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-indigo-400" />
          Modo Agencia & Autopromoción en Redes ($0 en Ads)
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          El sistema publica de manera 100% autónoma en tus redes sociales para captar clientes orgánicamente y llegar a las primeras 250 membresías.
        </p>
      </div>

      {/* SECCIÓN NUEVA: PILOTO AUTOMÁTICO DE REDES SOCIALES (CRON 24/7) */}
      <div className="rounded-3xl border border-purple-500/40 bg-gradient-to-r from-purple-950/40 via-slate-900 to-[#0e1629] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300 mb-3 border border-purple-500/30">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              PILOTO AUTOMÁTICO ACTIVO (META GRAPH API + GEMINI)
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Publicación Diaria Autónoma en Instagram & Facebook
            </h2>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Todos los días a las <strong>11:00 hrs (Horario Peak Chile)</strong>, Segar AI redacta un tip educativo de alto impacto con Gemini, genera la foto publicitaria con Pollinations (Flux) y la sube automáticamente a tus páginas de Instagram y Facebook sin que tengas que abrir la computadora.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><Instagram className="h-4 w-4 text-pink-400" /> Instagram Content API</span>
              <span className="flex items-center gap-1.5"><Facebook className="h-4 w-4 text-blue-400" /> Facebook Pages API</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-indigo-400" /> Cron Diario Programado</span>
            </div>
          </div>

          <div className="w-full lg:w-auto shrink-0 flex flex-col gap-2">
            <button
              onClick={dispararPilotoAutomatico}
              disabled={loadingAutoPost}
              className="w-full lg:w-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-purple-600/30 transition disabled:opacity-50"
            >
              {loadingAutoPost ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Redactando con Gemini y Publicando...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white" />
                  <span>Disparar Publicación Automática AHORA</span>
                </>
              )}
            </button>
            <span className="text-[10px] text-slate-400 text-center block">Prueba en vivo instantánea</span>
          </div>
        </div>

        {/* Resultado del Post Generado y Publicado en Vivo */}
        {autoPostResult && (
          <div className="mt-6 pt-6 border-t border-slate-800/80 rounded-2xl bg-slate-900/90 p-5 border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                ¡Publicación Ejecutada con Éxito ({autoPostResult.fecha})!
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
                Notificación enviada a Telegram
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="relative h-44 rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                <img
                  src={autoPostResult.imageUrl}
                  alt="Post preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[10px] text-white">
                  Generada con Flux
                </span>
              </div>
              <div className="md:col-span-2 space-y-2">
                <h4 className="font-bold text-white text-sm">{autoPostResult.tema}</h4>
                <p className="whitespace-pre-line text-[11px] text-slate-300 leading-relaxed bg-[#0a0f1d] p-3 rounded-xl border border-slate-800 max-h-32 overflow-y-auto">
                  {autoPostResult.copy}
                </p>
                <div className="flex gap-4 text-[11px] text-slate-400 pt-1">
                  <span>Instagram: <strong className="text-pink-400">{autoPostResult.publicaciones?.instagram?.mock ? 'Simulado (Listo para credenciales)' : 'Publicado'}</strong></span>
                  <span>Facebook: <strong className="text-blue-400">{autoPostResult.publicaciones?.facebook?.mock ? 'Simulado' : 'Publicado'}</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tarjeta de Meta 250 Membresías */}
      <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-[#0e1629] p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Objetivo de Tracción $0 Costo</span>
            <h2 className="text-xl font-bold text-white">Meta: 250 Membresías Activas</h2>
            <p className="text-xs text-slate-300 mt-1">
              250 clientes en Plan Pro ($29.900 CLP) = <strong>$7.475.000 CLP / mes (~$8.300 USD) en MRR 100% puro</strong> con costos de servidor de $0.
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-400">18 / 250</span>
            <span className="text-xs text-slate-400 block font-medium">Primeras membresías</span>
          </div>
        </div>

        <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 w-[7%]" />
        </div>
      </div>

      {/* Sistema de Referidos */}
      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/10 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Gift className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Sistema de Referidos "3x1 Mes Gratis"</h3>
              <p className="text-xs text-slate-400">Cada cliente gana 1 mes gratis por cada 3 amigos o pymes que se unan</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
            Viralidad Orgánica 100% Gratis
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 overflow-hidden">
            <span className="text-[11px] text-slate-400 block font-semibold mb-1">Tu enlace de referido para compartir:</span>
            <code className="text-xs text-emerald-300 font-mono block truncate">{referralLink}</code>
          </div>
          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition shrink-0"
          >
            {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar mi Link'}</span>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block font-semibold">Referidos Registrados:</span>
            <span className="text-lg font-bold text-white mt-1 block">4 pymes</span>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block font-semibold">Meses Gratis Ganados:</span>
            <span className="text-lg font-bold text-emerald-400 mt-1 block">1 mes activo</span>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block font-semibold">Próximo Mes Gratis:</span>
            <span className="text-lg font-bold text-indigo-400 mt-1 block">Faltan 2 referidos</span>
          </div>
        </div>
      </div>

      {/* Autopromoción Manual / Plantillas */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-400" />
            Contenido Semanal de Respaldo para Vender Segar AI
          </h3>
          <p className="text-xs text-slate-400">
            Plantillas adicionales listas para copiar en caso de querer publicar manualmente en LinkedIn o estados de WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {postsAutopromocion.map((p, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-[#0d1424] p-5 flex flex-col justify-between hover:border-indigo-500/40 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="rounded-md bg-indigo-500/20 text-indigo-300 px-2 py-0.5 text-[11px] font-bold">
                    {p.dia}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">{p.cta}</span>
                </div>
                <h4 className="font-bold text-white text-xs mb-2">{p.tema}</h4>
                <p className="whitespace-pre-line text-[11px] text-slate-300 leading-relaxed line-clamp-6 mb-4">
                  {p.copy}
                </p>
              </div>

              <button
                onClick={() => handleCopyPost(p.copy, idx)}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition"
              >
                {copiedPostIdx === idx ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedPostIdx === idx ? '¡Copiado!' : 'Copiar Post Completo'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
