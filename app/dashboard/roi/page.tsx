'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  ShieldCheck,
  Download,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Phone,
  Printer,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function RoiDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/roi')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const metrics = data?.metrics || {
    ventasEstimadasCLP: 1450000,
    leadsCount: 42,
    horasAhorradas: 31,
    costoAgenciaAhorradoCLP: 350000,
    inversionClienteCLP: 29900,
    retornoNetoCLP: 1770100,
    roiPorcentaje: 5920,
    postsRealizados: 14,
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 mb-2 border border-emerald-500/20">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>MÉTRICAS DE RETORNO FINANCIERO DEMOSTRABLE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            Dashboard de Retorno de Inversión (ROI)
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Descubre con números fríos cuánto dinero en ventas te ha generado SEGAR AI, cuántas horas de trabajo manual te ha ahorrado y tu ahorro neto frente a una agencia tradicional.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition shadow"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimir Reporte PDF</span>
          </button>
        </div>
      </div>

      {/* Tarjetas Principales de Métricas Financieras */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Ventas Estimadas */}
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/40 via-slate-900 to-[#0c1220] p-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Ventas Estimadas</span>
            <DollarSign className="h-5 w-5" />
          </div>
          <div className="text-3xl font-black text-white">
            ${(metrics.ventasEstimadasCLP || 0).toLocaleString('es-CL')} CLP
          </div>
          <span className="text-[11px] text-emerald-400 font-bold mt-2 flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5" />
            Generadas por Closer IA en WhatsApp
          </span>
        </div>

        {/* Card 2: Leads Capturados */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Leads WhatsApp</span>
            <Users className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">{metrics.leadsCount || 0}</div>
          <span className="text-[11px] text-indigo-400 font-semibold mt-2 block">
            Clientes cotizando activamente
          </span>
        </div>

        {/* Card 3: Horas Ahorradas */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tiempo Ahorrado</span>
            <Clock className="h-5 w-5 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-purple-300">
            {metrics.horasAhorradas || 0} hrs
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-2 block">
            Equivalente a 4 días de jornada laboral
          </span>
        </div>

        {/* Card 4: Ahorro de Agencia */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Ahorro en Agencia</span>
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">
            ${(metrics.costoAgenciaAhorradoCLP || 0).toLocaleString('es-CL')} CLP
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-2 block">
            Ahorro recurrente mensual neto
          </span>
        </div>
      </div>

      {/* Banner de Retorno Porcentual (El Moat de Retención) */}
      <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/40 p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-extrabold text-emerald-300 border border-emerald-500/30">
            <Sparkles className="h-3.5 w-3.5" />
            <span>RETORNO DE INVERSIÓN CALCULADO (ROI)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            +{metrics.roiPorcentaje || 5920}% de Retorno Financiero
          </h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Por cada <strong>$1 CLP</strong> que invertiste en tu membresía de Segar AI este mes, tu negocio generó <strong>${Math.round((metrics.roiPorcentaje || 5920) / 100)} CLP</strong> en ventas y ahorro de mano de obra.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-5 text-center min-w-[220px]">
          <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block mb-1">
            Ganancia Neta
          </span>
          <div className="text-2xl font-black text-emerald-400">
            +${(metrics.retornoNetoCLP || 0).toLocaleString('es-CL')} CLP
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Ventas + Ahorro Agencia - Membresía
          </span>
        </div>
      </div>

      {/* Comparativa de Costos: Agencia Tradicional vs Segar AI */}
      <div className="rounded-3xl border border-slate-800 bg-[#0d1424] p-6 space-y-6 shadow-2xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
          <span>Desglose Comparativo de Costos Anuales para tu Pyme</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Opción 1: Agencia Tradicional */}
          <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Opción A: Agencia Tradicional en Chile
              </span>
              <span className="text-xs text-rose-300 font-mono font-bold">$350.000 /mes</span>
            </div>
            <div className="text-3xl font-black text-white">
              $4.200.000 <span className="text-sm font-normal text-slate-400">CLP al año</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 pt-2">
              <li className="flex items-center gap-2">❌ Demoran 7 a 14 días en entregarte borradores de posts</li>
              <li className="flex items-center gap-2">❌ No te atienden WhatsApp a las 11 PM ni fines de semana</li>
              <li className="flex items-center gap-2">❌ Cobran extra por cada cambio o diseño adicional</li>
              <li className="flex items-center gap-2">❌ Contratos forzosos de permanencia de 6 a 12 meses</li>
            </ul>
          </div>

          {/* Opción 2: Segar AI Marketing */}
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Opción B: Segar AI Marketing Autónomo
              </span>
              <span className="text-xs text-emerald-300 font-mono font-bold">$29.900 /mes</span>
            </div>
            <div className="text-3xl font-black text-emerald-400">
              $358.800 <span className="text-sm font-normal text-slate-400">CLP al año</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 pt-2">
              <li className="flex items-center gap-2 text-emerald-300">✅ 100 posts y banners publicitarios listos en 3 segundos</li>
              <li className="flex items-center gap-2 text-emerald-300">✅ Closer de Ventas WhatsApp respondiendo clientes 24/7</li>
              <li className="flex items-center gap-2 text-emerald-300">✅ Auto-publicación en Instagram & Facebook en piloto automático</li>
              <li className="flex items-center gap-2 text-emerald-300">✅ Sin contratos ni permanencia: Cancela cuando quieras</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Historial Reciente de Leads de WhatsApp */}
      <div className="rounded-3xl border border-slate-800 bg-[#0d1424] p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Phone className="h-4 w-4 text-emerald-400" />
              <span>Últimos Clientes Potenciales Atendidos por el Closer IA</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Contactos que escribieron a tu WhatsApp y fueron asistidos automáticamente por el bot.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            {data?.leads?.length || 0} leads registrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3 px-3">Contacto / Teléfono</th>
                <th className="pb-3 px-3">Último Mensaje del Cliente</th>
                <th className="pb-3 px-3">Respuesta del Closer IA</th>
                <th className="pb-3 px-3">Valor Estimado</th>
                <th className="pb-3 px-3 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {(!data?.leads || data.leads.length === 0) ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Aún no hay mensajes entrantes de WhatsApp. ¡Prueba el simulador en Closer IA!
                  </td>
                </tr>
              ) : (
                data.leads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{lead.name || 'Cliente WhatsApp'}</div>
                      <div className="font-mono text-slate-400 text-[11px]">{lead.phone}</div>
                    </td>
                    <td className="py-3 px-3 max-w-xs truncate text-slate-300">
                      "{lead.lastMessage}"
                    </td>
                    <td className="py-3 px-3 max-w-xs truncate text-emerald-300">
                      "{lead.aiReply || 'Respuesta automática despachada'}"
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                      ${(lead.dealValueCLP || 35000).toLocaleString('es-CL')} CLP
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                        <CheckCircle2 className="h-3 w-3" /> Atendido 24/7
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
