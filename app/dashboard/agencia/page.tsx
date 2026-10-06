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
} from 'lucide-react';

export default function AgenciaPage() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPostIdx, setCopiedPostIdx] = useState<number | null>(null);

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
      copy: `El 73% de las ventas en Chile se pierden porque el cliente pregunta precio a las 23:00 hrs y le responden al día siguiente a las 11:00 am. 😴\n\nTu cliente ya le compró a la competencia.\n\nActiva un Closer con Inteligencia Artificial entrenado con tu catálogo de productos que responde en 4 segundos, rebate dudas y pasa el link de pago de MercadoPago al instante.\n\n📲 Toca el enlace de nuestro perfil y pruébalo gratis.`,
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-indigo-400" />
          Modo Agencia & Sistema de Referidos Viral ($0 en Ads)
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          La estrategia para vender las primeras 250 membresías de Segar AI Marketing sin gastar $1 en publicidad pagada.
        </p>
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

      {/* Autopromoción Diaria: Venta Orgánica */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-400" />
            Contenido Semanal Listo para Vender Segar AI
          </h3>
          <p className="text-xs text-slate-400">
            Copia y pega estos posts en las redes de Segar AI todos los días para atraer pymes orgánicamente sin gastar en anuncios.
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
