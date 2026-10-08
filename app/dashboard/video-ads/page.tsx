'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Video,
  Play,
  Pause,
  Volume2,
  Copy,
  Clock,
  Film,
  Zap,
  CheckCircle,
  HelpCircle,
  Share2,
  ArrowRight,
  Eye,
  Camera,
} from 'lucide-react';

interface Escena {
  numero: number;
  segundos: string;
  visual: string;
  textoPantalla: string;
  locucion: string;
  emocion: string;
}

interface GuionVideo {
  titulo: string;
  duracionEstimada: string;
  ganchoVisual: string;
  ganchoAuditivo: string;
  escenas: Escena[];
  promptImagenEscenaPrincipal: string;
  consejosProduccion: string[];
}

export default function VideoAdsPage() {
  const [rubro, setRubro] = useState('Comercio Electrónico & Productos');
  const [producto, setProducto] = useState('Zapatillas Urbanas Resistentes al Agua');
  const [objetivo, setObjetivo] = useState('Vender directo por mensaje en WhatsApp');
  const [estilo, setEstilo] = useState('Alto Impacto & Retención Alex Hormozi');
  const [publico, setPublico] = useState('Jóvenes y trabajadores en Chile que caminan o usan metro');
  const [cargando, setCargando] = useState(false);
  const [notificacion, setNotificacion] = useState('');

  // Reproductor de voz IA en vivo
  const [reproduciendo, setReproduciendo] = useState(false);
  const [escenaActivaAudio, setEscenaActivaAudio] = useState<number | null>(null);

  const [guion, setGuion] = useState<GuionVideo>({
    titulo: 'Campana Viral: Adiós a los Pies Mojados en Invierno',
    duracionEstimada: '35 segundos',
    ganchoVisual: 'Primer plano arrojando un balde con agua directamente sobre el zapato blanco sin que se moje.',
    ganchoAuditivo: '¡No compres zapatillas este invierno sin ver esto primero!',
    escenas: [
      {
        numero: 1,
        segundos: '0-3s',
        visual: 'Tiro de cámara rápido en picada. Alguien pisa un charco gigante y la cámara hace zoom al zapato impecable.',
        textoPantalla: '¡DETÉN EL SCROLL! 🛑',
        locucion: 'Si vives en Chile y odias llegar al trabajo con los calcetines mojados, quédate 30 segundos.',
        emocion: 'Curiosidad extrema',
      },
      {
        numero: 2,
        segundos: '4-12s',
        visual: 'Persona con cara de frustración cambiándose calcetines húmedos en la oficina.',
        textoPantalla: 'EL GRAN ERROR DEL INVIERNO',
        locucion: 'Gastas 60 mil pesos en zapatillas que a la primera lluvia quedan empapadas y te arruinan el día.',
        emocion: 'Frustración compartida',
      },
      {
        numero: 3,
        segundos: '13-25s',
        visual: 'Demostración de la membrana impermeable en acción. Agua resbalando en cámara lenta con logo del producto.',
        textoPantalla: 'TECNOLOGÍA HYDRO-SHIELD 2026',
        locucion: 'Estas zapatillas tienen triple membrana hidrófuga que repele el barro y el agua al 100%, pero respiran como algodón.',
        emocion: 'Deseo y asombro',
      },
      {
        numero: 4,
        segundos: '26-35s',
        visual: 'Muestra de la caja con envío gratis y la pantalla de WhatsApp con botón de compra.',
        textoPantalla: '30% OFF • ENVÍO GRATIS A TODO CHILE 🇨🇱',
        locucion: 'Tenemos sólo 40 pares con 30% de descuento y despacho en 24 horas. Toca el botón abajo y pide tu talla por WhatsApp antes de que se agoten.',
        emocion: 'Urgencia de compra',
      },
    ],
    promptImagenEscenaPrincipal: 'commercial sneaker shot water splashing dramatic cinematic photography slow motion lighting photorealistic 8k',
    consejosProduccion: [
      'Ilumina desde un ángulo de 45 grados para que el agua resalte en cámara.',
      'Usa audio en tendencia con bajo fuerte o beat tipo phonk en los primeros 3 segundos.',
      'Coloca los subtítulos al centro de la pantalla para evitar que los tape el menú de TikTok/Reels.',
    ],
  });

  const handleGenerarGuion = async () => {
    setCargando(true);
    setNotificacion('');
    try {
      const res = await fetch('/api/ai/video-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rubro, producto, objetivo, estilo, publico }),
      });

      const data = await res.json();
      if (data.success && data.guion) {
        setGuion(data.guion);
        mostrarAlerta('¡Guion publicitario de alta retención generado con éxito!');
      } else {
        alert(data.error || 'Error al generar el guion de video.');
      }
    } catch (err: any) {
      alert('Error en la conexión: ' + err.message);
    } finally {
      setCargando(false);
    }
  };

  const mostrarAlerta = (msg: string) => {
    setNotificacion(msg);
    setTimeout(() => setNotificacion(''), 4000);
  };

  // Reproducir guion completo con síntesis de voz en español
  const reproducirGuionVoz = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('Tu navegador no soporta síntesis de voz nativa.');
      return;
    }

    if (reproduciendo) {
      window.speechSynthesis.cancel();
      setReproduciendo(false);
      setEscenaActivaAudio(null);
      return;
    }

    const textoCompleto = guion.escenas.map((e) => e.locucion).join('. ');
    const utterance = new SpeechSynthesisUtterance(textoCompleto);
    utterance.lang = 'es-CL';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setReproduciendo(true);
    };

    utterance.onend = () => {
      setReproduciendo(false);
      setEscenaActivaAudio(null);
    };

    utterance.onerror = () => {
      setReproduciendo(false);
      setEscenaActivaAudio(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const copiarGuionCompleto = () => {
    const texto = `🎬 GUION DE VIDEO VERTICAL (REELS / TIKTOK / SHORTS)
Título: ${guion.titulo}
Duración: ${guion.duracionEstimada}

⚡ GANCHO VISUAL (0-3s): ${guion.ganchoVisual}
🔊 GANCHO AUDITIVO: "${guion.ganchoAuditivo}"

ESCENAS:
${guion.escenas
  .map(
    (e) => `[Escena ${e.numero} | ${e.segundos}] (${e.emocion})
📹 Visual: ${e.visual}
📝 En Pantalla: "${e.textoPantalla}"
🎙️ Locución: "${e.locucion}"`
  )
  .join('\n\n')}

💡 CONSEJOS DE FILMACIÓN:
${guion.consejosProduccion.map((c) => `- ${c}`).join('\n')}`;

    navigator.clipboard.writeText(texto);
    mostrarAlerta('¡Guion completo con escenas copiado al portapapeles!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-bold text-pink-400 mb-2">
            <Video className="h-3.5 w-3.5" />
            <span>VIDEO ADS STUDIO • REELS, TIKTOK & SHORTS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Fábrica de Guiones y Video Ads Virales
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Escribe guiones de video en formato 9:16 diseñados con psicología de alta retención (primeros 3 segundos vitales),
            subtítulos animados, audio con locutor de IA y escenas desglosadas para filmar con tu celular.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={reproducirGuionVoz}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-lg transition ${
              reproduciendo
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:brightness-110 shadow-pink-600/30'
            }`}
          >
            {reproduciendo ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            <span>{reproduciendo ? 'Pausar Locutor IA' : 'Escuchar Locutor IA'}</span>
          </button>

          <button
            onClick={copiarGuionCompleto}
            className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-xs font-bold text-slate-200 transition"
          >
            <Copy className="h-4 w-4" />
            <span>Copiar Todo</span>
          </button>
        </div>
      </div>

      {notificacion && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-emerald-300 text-sm">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{notificacion}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Parámetros */}
        <div className="lg:col-span-4 space-y-5">
          <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Camera className="h-3.5 w-3.5 text-pink-400" />
              <span>Configuración del Video</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Rubro de la Empresa</label>
              <input
                type="text"
                value={rubro}
                onChange={(e) => setRubro(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Producto o Servicio Protagonista</label>
              <input
                type="text"
                value={producto}
                onChange={(e) => setProducto(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Estilo de Video y Retención</label>
              <select
                value={estilo}
                onChange={(e) => setEstilo(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-pink-500 focus:outline-none"
              >
                <option value="Alto Impacto & Retención Alex Hormozi">Alto Impacto & Retención Alex Hormozi</option>
                <option value="Demostración de Choque (Prueba Extrema)">Demostración de Choque (Prueba Extrema)</option>
                <option value="Storytelling de Problema a Solución">Storytelling de Problema a Solución</option>
                <option value="Unboxing & Reacción Sorpresa">Unboxing & Reacción Sorpresa</option>
                <option value="Humor Pyme & Empatía Chilena">Humor Pyme & Empatía Chilena 🇨🇱</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Público y Audiencia</label>
              <input
                type="text"
                value={publico}
                onChange={(e) => setPublico(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Objetivo del Video</label>
              <input
                type="text"
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-pink-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleGenerarGuion}
              disabled={cargando}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 py-3 text-xs font-bold text-white shadow-lg shadow-pink-600/30 hover:brightness-110 active:scale-95 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>{cargando ? 'Generando Storyboard Viral...' : 'Generar Guion & Storyboard IA'}</span>
            </button>
          </div>

          {/* Miniatura generada con IA */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Eye className="h-3.5 w-3.5 text-indigo-400" />
              <span>Miniatura del Video (Flux HD)</span>
            </h3>
            <div className="aspect-[9/16] w-full max-w-[200px] mx-auto rounded-xl overflow-hidden border border-slate-700 relative group">
              <img
                src={`https://image.pollinations.ai/prompt/${encodeURIComponent(
                  guion.promptImagenEscenaPrincipal
                )}?width=720&height=1280&nologo=true`}
                alt="Miniatura Video Ad"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-3">
                <span className="rounded bg-pink-600/90 px-1.5 py-0.5 text-[9px] font-black text-white w-fit">
                  9:16 REELS
                </span>
                <div>
                  <p className="text-[10px] font-black text-yellow-300 uppercase leading-tight line-clamp-2">
                    {guion.escenas[0]?.textoPantalla || '¡MIRA ESTO!'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Storyboard: Escenas y Desglose */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tarjeta de Gancho Inicial (3 Segundos de Oro) */}
          <div className="rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-950/20 via-slate-900 to-slate-900 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-yellow-500/20 border border-yellow-500/40 px-3 py-1 text-xs font-extrabold text-yellow-300 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                <span>EL GANCHO INICIAL (Primeros 3 Segundos)</span>
              </span>
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {guion.duracionEstimada}
              </span>
            </div>

            <h2 className="text-lg font-black text-white">{guion.titulo}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  👁️ Lo que se ve en pantalla:
                </p>
                <p className="text-xs text-slate-200">{guion.ganchoVisual}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  🔊 Lo que se escucha (Hook Auditivo):
                </p>
                <p className="text-xs text-yellow-300 font-semibold italic">"{guion.ganchoAuditivo}"</p>
              </div>
            </div>
          </div>

          {/* Desglose de Escenas en el Storyboard */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Film className="h-4 w-4 text-pink-400" />
              <span>Storyboard y Guion de Filmación Escena por Escena</span>
            </h3>

            {guion.escenas.map((escena) => (
              <div
                key={escena.numero}
                className="rounded-2xl border border-slate-800 bg-[#0d1424] p-5 space-y-3 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-600/20 text-pink-400 font-black text-xs border border-pink-500/30">
                      {escena.numero}
                    </span>
                    <span className="text-xs font-extrabold text-white">Escena {escena.numero}</span>
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-slate-300">
                      {escena.segundos}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-purple-400 bg-purple-950/40 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                    {escena.emocion}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  {/* Visual */}
                  <div className="md:col-span-5 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                      📹 Filmación / Qué Grabar
                    </span>
                    <p className="text-xs text-slate-300">{escena.visual}</p>
                  </div>

                  {/* Texto en Pantalla */}
                  <div className="md:col-span-3 rounded-xl border border-yellow-500/20 bg-yellow-950/10 p-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-yellow-400 block mb-1">
                      🔤 Texto Subtítulo (Hormozi)
                    </span>
                    <p className="text-xs font-black text-yellow-300 uppercase leading-snug">
                      {escena.textoPantalla}
                    </p>
                  </div>

                  {/* Locución */}
                  <div className="md:col-span-4 rounded-xl border border-slate-800/80 bg-slate-950/80 p-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 block mb-1">
                      🎙️ Voz en Off / Diálogo
                    </span>
                    <p className="text-xs text-slate-200 italic leading-relaxed">
                      "{escena.locucion}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Consejos Pro de Filmación */}
          <div className="rounded-2xl border border-slate-800 bg-[#0a101f] p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-yellow-400" />
              <span>Reglas de Oro para que el Algoritmo Viralice este Video:</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {guion.consejosProduccion.map((consejo, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-pink-400 font-bold">•</span>
                  <span>{consejo}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
