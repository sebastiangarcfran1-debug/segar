'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  Phone,
  Instagram,
  RefreshCw,
  Loader2,
  DollarSign,
  ChevronRight,
  Send,
} from 'lucide-react';
import { CONTACT_INFO } from '@/lib/contact';

export default function AuditoriaViralPage() {
  const [handle, setHandle] = useState('');
  const [rubro, setRubro] = useState('Moda y Vestuario');
  const [whatsapp, setWhatsapp] = useState('');
  const [ciudad, setCiudad] = useState('Santiago');
  const [loading, setLoading] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [progresoTexto, setProgresoTexto] = useState('');
  const [resultado, setResultado] = useState<any>(null);

  const rubrosDisponibles = [
    'Moda y Vestuario',
    'Gastronomía & Delivery',
    'Salud, Belleza & Estética',
    'Servicios Profesionales & Asesorías',
    'Hogar, Construcción & Deco',
    'Tecnología & Accesorios',
    'Turismo & Hotelería',
    'Automotriz & Repuestos',
    'Otro Emprendimiento',
  ];

  const handleAnalizar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    setLoading(true);
    setResultado(null);
    setProgreso(15);
    setProgresoTexto('Conectando con servidores de Meta e indexando perfil...');

    const timer1 = setTimeout(() => {
      setProgreso(45);
      setProgresoTexto('Auditando biografía, llamadas a la acción y ganchos de retención...');
    }, 1200);

    const timer2 = setTimeout(() => {
      setProgreso(80);
      setProgresoTexto('Calculando estimación de fugas comerciales en pesos chilenos (CLP)...');
    }, 2400);

    try {
      const res = await fetch('/api/ai/diagnostico-viral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagram: handle,
          rubro,
          whatsapp,
          ciudad,
        }),
      });

      const data = await res.json();
      setProgreso(100);
      setProgresoTexto('¡Auditoría completada con éxito!');

      setTimeout(() => {
        if (data.diagnostico) {
          setResultado(data.diagnostico);
        } else {
          alert('Hubo un inconveniente al auditar el perfil. Intenta nuevamente.');
        }
        setLoading(false);
      }, 600);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert('Error de conexión al procesar la auditoría.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-black text-white text-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
              <Sparkles className="h-4 w-4" />
            </span>
            <span>SEGAR <span className="text-indigo-400">AI</span></span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-300 hover:text-white transition px-3 py-1.5"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/register"
              className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition shadow-md shadow-indigo-600/30"
            >
              Comenzar Ahora
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-400">
            <Zap className="h-3.5 w-3.5" />
            <span>HERRAMIENTA GRATUITA 100% IA CHILE 🇨🇱</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Auditoría de <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Fuga de Ventas</span> en tu Instagram
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Descubre en 60 segundos por qué tus seguidores no se convierten en clientes que pagan y cuántos pesos chilenos estás dejando sobre la mesa cada mes.
          </p>
        </div>

        {/* Formulario de Entrada */}
        {!resultado && (
          <div className="rounded-3xl border border-slate-800 bg-[#0d1424] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <form onSubmit={handleAnalizar} className="space-y-5 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    1. Usuario de Instagram Comercial *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-slate-500 text-sm">@</span>
                    <input
                      type="text"
                      required
                      placeholder="tienda_ejemplo.cl"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 pl-8 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Ejemplo: @boutiquebella.cl</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    2. Rubro o Nicho del Negocio *
                  </label>
                  <select
                    value={rubro}
                    onChange={(e) => setRubro(e.target.value)}
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  >
                    {rubrosDisponibles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    3. WhatsApp de Contacto (Para informe VIP)
                  </label>
                  <input
                    type="text"
                    placeholder="+56 9 9123 4567"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Recibirás tips prácticos directo a tu celular</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    4. Ciudad / Región en Chile
                  </label>
                  <input
                    type="text"
                    placeholder="Santiago / Viña del Mar / Concepción"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {loading ? (
                <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/30 p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-indigo-300 font-bold">
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                      {progresoTexto}
                    </span>
                    <span>{progreso}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 rounded-full"
                      style={{ width: `${progreso}%` }}
                    />
                  </div>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-black text-sm tracking-wide shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Escanear y Diagnosticar con Inteligencia Artificial (Gratis)</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Sin ingresar tu contraseña de Instagram
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Algoritmo adaptado a compradores chilenos
              </span>
              <span className="flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-amber-400" /> 100% Gratuito y sin tarjeta requerida
              </span>
            </div>
          </div>
        )}

        {/* Reporte de Diagnóstico Generado */}
        {resultado && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header del Resultado */}
            <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-b from-rose-950/30 via-slate-900 to-[#0d1424] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 text-rose-300 px-3 py-1 text-xs font-black mb-3 border border-rose-500/40">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>DIAGNÓSTICO CRÍTICO: {resultado.nivel}</span>
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    Reporte para @{handle.replace('@', '')}
                  </h2>
                  <p className="text-xs text-slate-300 mt-2 max-w-xl">
                    {resultado.diagnosticoResumen}
                  </p>
                </div>

                <div className="shrink-0 text-center rounded-2xl bg-slate-900/90 border border-slate-800 p-5 min-w-[150px]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Score de Retención</span>
                  <div className="text-4xl font-black text-rose-400 tracking-tight">
                    {resultado.score}<span className="text-base text-slate-500">/100</span>
                  </div>
                  <span className="text-[10px] text-rose-300 mt-1 block font-semibold">Urgente Optimizar</span>
                </div>
              </div>

              {/* Fuga de dinero en CLP */}
              <div className="mt-6 pt-5 border-t border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 bg-rose-500/10 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0">
                    <TrendingDown className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-rose-200 block">Ventas Perdidas Estimadas al Mes:</span>
                    <span className="text-lg font-black text-white">{resultado.ventasPerdidasCLP}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setResultado(null);
                    setProgreso(0);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Auditar otra cuenta</span>
                </button>
              </div>
            </div>

            {/* Las 3 Fugas Críticas Detectadas */}
            <div>
              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                Las 3 Fugas Críticas de Dinero en tu Cuenta
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {resultado.fugasDetectadas?.map((fuga: any, i: number) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-800 bg-[#0d1424] p-5 flex flex-col justify-between hover:border-slate-700 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black text-indigo-400">Fuga #{i + 1}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            fuga.gravedad === 'alta'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          Impacto {fuga.gravedad}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white mb-2">{fuga.titulo}</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
                        {fuga.descripcion}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-semibold flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>{fuga.solucionSegar}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan de Acción Inmediato */}
            <div className="rounded-3xl border border-slate-800 bg-[#0d1424] p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-400" />
                Plan de Acción Inmediato Recomendado
              </h3>

              <div className="space-y-3">
                {resultado.planAccionInmediato?.map((paso: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-300 font-bold shrink-0 text-[11px]">
                        {paso.paso}
                      </span>
                      <span className="text-slate-200">{paso.accion}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 bg-slate-800 px-2 py-1 rounded-md font-mono">
                      {paso.tiempoEstimado}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Final de Adquisición */}
            <div className="rounded-3xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 p-8 text-center space-y-6 shadow-2xl">
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-4 py-1 text-xs font-bold">
                SOLUCIÓN DEFINITIVA
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white">
                Corrige estas 3 fugas hoy mismo de forma 100% automática
              </h3>
              <p className="text-xs text-slate-300 max-w-xl mx-auto">
                No necesitas contratar una agencia de $350.000 CLP/mes. Con <strong>SEGAR AI MARKETING</strong> activas la fábrica de 30 posts con ganchos virales, el Closer de WhatsApp 24/7 y la publicación autónoma en Meta por una fracción de costo.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  href="/register"
                  className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Crear mi Cuenta y Reparar mi Embudo</span>
                </Link>

                <a
                  href={`https://wa.me/56991842110?text=${encodeURIComponent(
                    `Hola equipo de Segar AI. Hice la auditoría para @${handle.replace('@', '')} y quiero activar mi plataforma.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-2"
                >
                  <Phone className="h-4 w-4 text-emerald-400" />
                  <span>Hablar con un Especialista en WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>© 2026 SEGAR AI MARKETING. Todos los derechos reservados.</p>
        <p className="mt-1">Santiago de Chile 🇨🇱 • Plataforma de Inteligencia Artificial para Pymes</p>
      </footer>
    </div>
  );
}
