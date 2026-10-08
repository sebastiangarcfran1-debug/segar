'use client';

import React, { useState, useEffect } from 'react';
import {
  Palette,
  Sparkles,
  Save,
  CheckCircle2,
  Sliders,
  Type,
  Image as ImageIcon,
  Volume2,
  RefreshCw,
  Building,
  Target,
} from 'lucide-react';

export default function BrandKitPage() {
  const [guardado, setGuardado] = useState(false);
  const [loading, setLoading] = useState(false);

  const [brandKit, setBrandKit] = useState({
    nombreMarca: 'Boutique Bella Santiago',
    eslogan: 'Moda exclusiva para mujeres que marcan tendencia',
    paletaSeleccionada: 'indigo_violet',
    colorPrimario: '#6366f1',
    colorSecundario: '#ec4899',
    colorFondo: '#0f172a',
    tonoVoz: 'canchero_chileno',
    publicoObjetivo: 'Mujeres de 25 a 45 años en Santiago y regiones de Chile que buscan ropa de calidad para el trabajo y eventos.',
    logoUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150&auto=format&fit=crop&q=80',
    palabrasProhibidas: 'barato, económico, oferta penca, ordinario',
    palabrasClave: 'exclusividad, envíos a todo Chile, calidad garantizada, despacho express',
  });

  const paletasPreset = [
    { id: 'indigo_violet', nombre: 'Cyber Indigo & Fuchsia', p: '#6366f1', s: '#ec4899', b: '#0f172a' },
    { id: 'luxury_gold', nombre: 'Luxury Gold & Black', p: '#f59e0b', s: '#d97706', b: '#18181b' },
    { id: 'emerald_eco', nombre: 'Emerald Organic Green', p: '#10b981', s: '#059669', b: '#064e3b' },
    { id: 'sunset_coral', nombre: 'Sunset Vibrant Coral', p: '#f43f5e', s: '#fb923c', b: '#1c1917' },
    { id: 'minimal_slate', nombre: 'Minimalist Tech Slate', p: '#38bdf8', s: '#818cf8', b: '#090d16' },
  ];

  const tonosPreset = [
    {
      id: 'canchero_chileno',
      nombre: '🇨🇱 Canchero & Chileno (Recomendado)',
      desc: 'Cercano, simpático, directo y confiable. Usa modismos suaves que conectan de inmediato con compradores locales.',
    },
    {
      id: 'vendedor_urgencia',
      nombre: '🔥 Vendedor Directo & Urgencia (Copywriting de Respuesta Directa)',
      desc: 'Enfocado 100% en cerrar ventas, crear ofertas irresistibles, escasez de stock y llamados a la acción inmediatos.',
    },
    {
      id: 'autoridad_corporativo',
      nombre: '👔 Corporativo & Alta Autoridad',
      desc: 'Elegante, sobrio y profesional. Ideal para clínicas, abogados, constructoras y servicios de alto valor.',
    },
    {
      id: 'empatico_educativo',
      nombre: '🌱 Cálido & Educativo',
      desc: 'Enfocado en resolver dudas, enseñar a la audiencia y generar confianza antes de vender.',
    },
  ];

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGuardado(true);
      setTimeout(() => setGuardado(false), 3000);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
            Motor de Identidad de Marca • Estilo Predis.ai & Jasper
          </span>
          <h1 className="text-3xl font-black text-white mt-1 flex items-center gap-2.5">
            <Palette className="h-7 w-7 text-indigo-400" />
            Brand Kit & Voz de Marca IA
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Define los colores, tipografía, logo y tono psicológico para que cada post, imagen y respuesta del Closer refleje la esencia única de tu empresa.
          </p>
        </div>

        {guardado && (
          <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 text-xs font-bold text-emerald-400 animate-fadeIn">
            <CheckCircle2 className="h-4 w-4" />
            <span>¡Brand Kit sincronizado con la IA!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleGuardar} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda & Central: Configuración */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tarjeta 1: Datos Base */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Building className="h-4 w-4 text-indigo-400" />
              1. Identidad Central de la Empresa
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nombre Comercial de Marca</label>
                <input
                  type="text"
                  value={brandKit.nombreMarca}
                  onChange={(e) => setBrandKit({ ...brandKit, nombreMarca: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Eslogan Principal / Promesa</label>
                <input
                  type="text"
                  value={brandKit.eslogan}
                  onChange={(e) => setBrandKit({ ...brandKit, eslogan: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-indigo-400" />
                Definición del Cliente Ideal (Público Objetivo)
              </label>
              <textarea
                rows={2}
                value={brandKit.publicoObjetivo}
                onChange={(e) => setBrandKit({ ...brandKit, publicoObjetivo: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Tarjeta 2: Paleta de Colores */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Palette className="h-4 w-4 text-purple-400" />
              2. Paleta de Colores y Estética Gráfica
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {paletasPreset.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    setBrandKit({
                      ...brandKit,
                      paletaSeleccionada: p.id,
                      colorPrimario: p.p,
                      colorSecundario: p.s,
                      colorFondo: p.b,
                    })
                  }
                  className={`p-3 rounded-2xl border text-left transition ${
                    brandKit.paletaSeleccionada === p.id
                      ? 'border-indigo-500 bg-indigo-950/30 ring-2 ring-indigo-500/20'
                      : 'border-slate-800 bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: p.p }} />
                    <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: p.s }} />
                    <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: p.b }} />
                  </div>
                  <div className="text-xs font-bold text-white">{p.nombre}</div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Color Primario</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandKit.colorPrimario}
                    onChange={(e) => setBrandKit({ ...brandKit, colorPrimario: e.target.value })}
                    className="h-8 w-8 rounded-lg cursor-pointer border border-slate-700 bg-transparent"
                  />
                  <span className="text-xs font-mono text-slate-300">{brandKit.colorPrimario}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Color Secundario</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandKit.colorSecundario}
                    onChange={(e) => setBrandKit({ ...brandKit, colorSecundario: e.target.value })}
                    className="h-8 w-8 rounded-lg cursor-pointer border border-slate-700 bg-transparent"
                  />
                  <span className="text-xs font-mono text-slate-300">{brandKit.colorSecundario}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Color de Fondo</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandKit.colorFondo}
                    onChange={(e) => setBrandKit({ ...brandKit, colorFondo: e.target.value })}
                    className="h-8 w-8 rounded-lg cursor-pointer border border-slate-700 bg-transparent"
                  />
                  <span className="text-xs font-mono text-slate-300">{brandKit.colorFondo}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta 3: Tono de Voz de la IA */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Volume2 className="h-4 w-4 text-emerald-400" />
              3. Tono Psicológico de la Inteligencia Artificial
            </h3>

            <div className="space-y-3">
              {tonosPreset.map((t) => (
                <label
                  key={t.id}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                    brandKit.tonoVoz === t.id
                      ? 'border-indigo-500 bg-indigo-950/30'
                      : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="tono"
                    checked={brandKit.tonoVoz === t.id}
                    onChange={() => setBrandKit({ ...brandKit, tonoVoz: t.id })}
                    className="mt-1 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">{t.nombre}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{t.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Palabras Clave a Incluir</label>
                <input
                  type="text"
                  value={brandKit.palabrasClave}
                  onChange={(e) => setBrandKit({ ...brandKit, palabrasClave: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-rose-400 mb-1">Palabras Prohibidas (Filtro)</label>
                <input
                  type="text"
                  value={brandKit.palabrasProhibidas}
                  onChange={(e) => setBrandKit({ ...brandKit, palabrasProhibidas: e.target.value })}
                  className="w-full rounded-xl border border-rose-900/40 bg-slate-800 px-3 py-2 text-xs text-rose-200 focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Vista Previa en Vivo del Brand Kit */}
        <div className="space-y-6">
          <div className="sticky top-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400 mb-4">
              Vista Previa en Vivo de tu Marca
            </h3>

            {/* Mockup Card de Post con Brand Kit */}
            <div
              className="rounded-2xl p-5 border shadow-xl relative overflow-hidden transition-all"
              style={{
                backgroundColor: brandKit.colorFondo,
                borderColor: brandKit.colorPrimario + '40',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-sm"
                  style={{ backgroundColor: brandKit.colorPrimario }}
                >
                  {brandKit.nombreMarca.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-xs">{brandKit.nombreMarca}</h4>
                  <span className="text-[10px] text-slate-400 block">{brandKit.eslogan}</span>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden aspect-video bg-slate-800 mb-3 relative border border-white/10">
                <img
                  src="https://image.pollinations.ai/prompt/luxury%20fashion%20commercial%20product%20chile%20aesthetic?width=400&height=250&nologo=true"
                  alt="Brand preview"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute bottom-2 left-2 rounded-lg px-2.5 py-1 text-[10px] font-black text-white shadow-lg"
                  style={{ backgroundColor: brandKit.colorSecundario }}
                >
                  NUEVA COLECCIÓN
                </div>
              </div>

              <p className="text-[11px] text-slate-200 leading-relaxed mb-3">
                «¿Buscando ese toque único que te haga destacar? ✨ Envíos a todo Chile en 24 hrs. Comenta QUIERO y recibe tu cupón directo en WhatsApp.»
              </p>

              <button
                type="button"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition"
                style={{ backgroundColor: brandKit.colorPrimario }}
              >
                Comprar Ahora • Enlace en Bio
              </button>
            </div>

            {/* Botón Guardar */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-xs font-bold text-white shadow-xl shadow-indigo-600/30 hover:opacity-95 transition flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Sincronizando con IA...' : 'Guardar y Aplicar a Toda la Plataforma'}</span>
              </button>
              <p className="text-[10px] text-slate-500 text-center mt-2">
                Los cambios se reflejarán de inmediato en la Fábrica de Posts y el Closer de Ventas.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
