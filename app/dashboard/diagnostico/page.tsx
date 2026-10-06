'use client';

import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Download,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Instagram,
  TrendingUp,
  FileText,
  Loader2,
} from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function DiagnosticoPage() {
  const [form, setForm] = useState({
    nombre: 'Boutique Nórdica Chile',
    rubro: 'Moda y Ropa Femenina',
    instagram: '@boutiquenordica.cl',
    queVende: 'Prendas exclusivas de diseño independiente y abrigos de temporada',
    ticketPromedio: '$35.000 CLP',
  });

  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/ai/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.diagnostico) {
        setResultado(data.diagnostico);
      }
    } catch (err) {
      console.error(err);
      alert('Error generando diagnóstico.');
    } finally {
      setLoading(false);
    }
  };

  const descargarPDF = () => {
    if (!resultado) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Encabezado
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('SEGAR AI MARKETING — AUDITORÍA 360', 14, 18);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Cliente: ${form.nombre} | Instagram: ${form.instagram} | Fecha: ${new Date().toLocaleDateString('es-CL')}`, 14, 26);

    let y = 45;

    // Puntaje
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Puntaje de Rendimiento Digital: ${resultado.puntajeGeneral}/100`, 14, y);
    y += 8;

    // Resumen
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const resumenLines = doc.splitTextToSize(`Resumen Ejecutivo: ${resultado.resumenEjecutivo}`, 180);
    doc.text(resumenLines, 14, y);
    y += resumenLines.length * 5 + 6;

    // Fortalezas
    doc.setFont('helvetica', 'bold');
    doc.text('Fortalezas Detectadas:', 14, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    resultado.fortalezas?.forEach((f: string) => {
      doc.text(`• ${f}`, 18, y);
      y += 5;
    });
    y += 4;

    // Debilidades
    doc.setFont('helvetica', 'bold');
    doc.text('Oportunidades de Mejora Críticas:', 14, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    resultado.debilidadesCriticas?.forEach((d: string) => {
      doc.text(`• ${d}`, 18, y);
      y += 5;
    });
    y += 6;

    // Plan de 30 días
    doc.setFont('helvetica', 'bold');
    doc.text('Plan de Acción Estratégico (Próximos 30 Días):', 14, y);
    y += 6;

    resultado.plan30Dias?.forEach((semana: any) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`Semana ${semana.semana}: ${semana.nombre}`, 16, y);
      y += 5;
      doc.setFont('helvetica', 'italic');
      doc.text(`Objetivo: ${semana.objetivo}`, 18, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      semana.accionesClave?.forEach((act: string) => {
        const actLines = doc.splitTextToSize(`- ${act}`, 170);
        doc.text(actLines, 20, y);
        y += actLines.length * 4.5;
      });
      y += 3;
    });

    // Proyección
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229); // Indigo
    const proyLines = doc.splitTextToSize(`Proyección de Ventas: ${resultado.proyeccionVentas}`, 180);
    doc.text(proyLines, 14, y);

    doc.save(`Diagnostico_360_SegarAI_${form.nombre.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Search className="h-6 w-6 text-indigo-400" />
          Onboarding & Diagnóstico 360 de Marketing
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Analiza cualquier perfil de Instagram público sin APIs de pago. Gemini audita la biografía, posts y genera un plan de 30 días descargable en PDF.
        </p>
      </div>

      {/* Formulario */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Nombre del Negocio o Marca</label>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Rubro / Industria</label>
            <input
              type="text"
              required
              value={form.rubro}
              onChange={(e) => setForm({ ...form, rubro: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Instagram className="h-3.5 w-3.5 text-pink-400" />
              Cuenta de Instagram Pública
            </label>
            <input
              type="text"
              required
              value={form.instagram}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Ticket Promedio de Venta (CLP)</label>
            <input
              type="text"
              required
              value={form.ticketPromedio}
              onChange={(e) => setForm({ ...form, ticketPromedio: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-2">¿Qué producto o servicio vende principalmente?</label>
            <textarea
              rows={2}
              required
              value={form.queVende}
              onChange={(e) => setForm({ ...form, queVende: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analizando Instagram y generando auditoría...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Ejecutar Diagnóstico 360 con Gemini
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Resultados de Diagnóstico */}
      {resultado && (
        <div className="space-y-6 rounded-3xl border border-indigo-500/40 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Reporte Generado</span>
              <h2 className="text-xl font-bold text-white">{form.nombre} ({form.instagram})</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Puntaje Estratégico</span>
                <span className="text-3xl font-black text-indigo-400">{resultado.puntajeGeneral}<span className="text-sm text-slate-500">/100</span></span>
              </div>
              <button
                onClick={descargarPDF}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition"
              >
                <Download className="h-4 w-4" />
                Descargar Plan en PDF
              </button>
            </div>
          </div>

          {/* Resumen */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Resumen Ejecutivo</h3>
            <p className="text-xs text-slate-200 leading-relaxed">{resultado.resumenEjecutivo}</p>
          </div>

          {/* Grid Fortalezas y Debilidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-3">
                <CheckCircle2 className="h-4 w-4" />
                Fortalezas Actuales
              </h3>
              <ul className="space-y-2 text-xs text-slate-200">
                {resultado.fortalezas?.map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-3">
                <AlertTriangle className="h-4 w-4" />
                Oportunidades Críticas de Venta
              </h3>
              <ul className="space-y-2 text-xs text-slate-200">
                {resultado.debilidadesCriticas?.map((d: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400">•</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Plan de 4 semanas */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-400" />
              Plan de Acción Paso a Paso (30 Días)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {resultado.plan30Dias?.map((s: any, idx: number) => (
                <div key={idx} className="rounded-2xl border border-slate-800 bg-[#0d1424] p-4 text-xs">
                  <span className="text-[10px] font-bold text-indigo-400 block mb-1">Semana {s.semana}</span>
                  <h4 className="font-bold text-white mb-2">{s.nombre}</h4>
                  <p className="text-[11px] text-slate-400 mb-3 italic">"{s.objetivo}"</p>
                  <div className="space-y-1.5 text-slate-300">
                    {s.accionesClave?.map((act: string, aIdx: number) => (
                      <div key={aIdx} className="flex items-start gap-1.5">
                        <span className="text-indigo-400 shrink-0">✓</span>
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proyección */}
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/30 p-4 text-xs text-indigo-200 flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-indigo-400 shrink-0" />
            <div>
              <span className="font-bold block">Impacto Proyectado en Facturación:</span>
              <span>{resultado.proyeccionVentas}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
