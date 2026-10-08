'use client';

import React, { useState } from 'react';
import {
  Crosshair,
  Sparkles,
  Search,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Send,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Target,
  Zap,
} from 'lucide-react';

export default function RadarPage() {
  const [competidores, setCompetidores] = useState('@tienda.rival.cl, @marca.competidora');
  const [miRubro, setMiRubro] = useState('Moda y Accesorios Femeninos en Chile');
  const [miDiferencial, setMiDiferencial] = useState('Despacho express 24h a todo Chile y atención instantánea por WhatsApp');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [copiado, setCopiado] = useState(false);

  const ejecutarRadar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/ai/radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competidores, miRubro, miDiferencial }),
      });
      const data = await res.json();
      if (data.success) {
        setResultado(data);
      } else {
        alert(data.error || 'Error en el análisis');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const copiarTexto = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
          Inteligencia Competitiva • Estilo GetHookd & Predis.ai
        </span>
        <h1 className="text-3xl font-black text-white mt-1 flex items-center gap-2.5">
          <Crosshair className="h-7 w-7 text-rose-400" />
          Radar de Competencia & Espionaje Comercial
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Analiza los ángulos de venta de tus rivales en Instagram, detecta en qué están fallando y crea campañas de contra-ataque para captar a sus clientes.
        </p>
      </div>

      {/* Formulario de Entrada */}
      <form onSubmit={ejecutarRadar} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5 text-rose-400" />
              Cuentas de Instagram Rivales
            </label>
            <input
              type="text"
              required
              value={competidores}
              onChange={(e) => setCompetidores(e.target.value)}
              placeholder="@rival1, @rival2..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-indigo-400" />
              Tu Rubro / Mercado
            </label>
            <input
              type="text"
              required
              value={miRubro}
              onChange={(e) => setMiRubro(e.target.value)}
              placeholder="Ej: Calzado de cuero, Cafetería..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Tu Ventaja / Diferencial Clave
            </label>
            <input
              type="text"
              required
              value={miDiferencial}
              onChange={(e) => setMiDiferencial(e.target.value)}
              placeholder="Ej: Despacho en 24h, mejor garantía..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 text-xs font-bold text-white shadow-xl shadow-rose-600/30 hover:opacity-95 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Escaneando debilidades de la competencia...</span>
              </>
            ) : (
              <>
                <Crosshair className="h-4 w-4" />
                <span>Analizar y Crear Contra-Ataque Comercial</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Resultados de Inteligencia Competitiva */}
      {resultado && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tarjeta 1: Debilidades Detectadas */}
            <div className="rounded-3xl border border-rose-500/30 bg-rose-950/20 p-6 shadow-xl backdrop-blur-xl">
              <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-rose-400" />
                Debilidades de la Competencia
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {resultado.reporte.debilidadesCompetencia.map((deb: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-rose-900/30">
                    <span className="text-rose-400 font-bold shrink-0">✕</span>
                    <span>{deb}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tarjeta 2: Ganchos Virales */}
            <div className="rounded-3xl border border-amber-500/30 bg-amber-950/20 p-6 shadow-xl backdrop-blur-xl">
              <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2 mb-3">
                <Flame className="h-4 w-4 text-amber-400" />
                Ganchos Virales para Superarlos
              </h3>
              <div className="space-y-2 text-xs">
                {resultado.reporte.ganchosViralesDetectados.map((gancho: string, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => copiarTexto(gancho)}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-amber-900/30 text-amber-100 hover:border-amber-400 cursor-pointer transition flex items-center justify-between"
                  >
                    <span>{gancho}</span>
                    <Copy className="h-3.5 w-3.5 text-amber-400 shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Tarjeta 3: Contra-Estrategia Maestra */}
            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-6 shadow-xl backdrop-blur-xl">
              <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-emerald-400" />
                Contra-Estrategia Ganadora
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-emerald-900/30">
                {resultado.reporte.contraEstrategiaMaestra}
              </p>
            </div>
          </div>

          {/* Tarjeta Destacada: Pieza Gráfica y Post de Ataque Comercial Listo */}
          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  Post Listo para Lanzar • Ganador contra la Competencia
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {resultado.reporte.postDeAtaque.titulo}
                </h3>
              </div>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full font-bold">
                ⏰ Horario sugerido: {resultado.reporte.postDeAtaque.horaSugerida}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Imagen Generada en HD */}
              <div className="rounded-2xl overflow-hidden aspect-square border border-slate-700 bg-slate-800 shadow-xl relative group">
                <img
                  src={resultado.imagenUrl}
                  alt="Creative"
                  className="w-full h-full object-cover"
                />
                <a
                  href={resultado.imagenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 rounded-xl bg-black/70 backdrop-blur px-3 py-1.5 text-xs text-white font-semibold flex items-center gap-1.5 hover:bg-black"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Ver en HD</span>
                </a>
              </div>

              {/* Copy Persuasivo */}
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-800/80 p-4 border border-slate-700 text-xs text-slate-200 leading-relaxed whitespace-pre-line font-mono max-h-72 overflow-y-auto">
                  {resultado.reporte.postDeAtaque.copy}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => copiarTexto(resultado.reporte.postDeAtaque.copy)}
                    className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
                  >
                    {copiado ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copiado ? '¡Copiado!' : 'Copiar Texto para Instagram'}</span>
                  </button>

                  <a
                    href={`https://wa.me/56991842110?text=${encodeURIComponent(
                      `¡Nuevo post de contra-ataque listo!\n\n${resultado.reporte.postDeAtaque.copy}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                  >
                    <Send className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
