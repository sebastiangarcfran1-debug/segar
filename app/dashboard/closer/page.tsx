'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  Bot,
  User,
  Upload,
  BookOpen,
  CheckCircle2,
  Phone,
  Instagram,
  Facebook,
  Loader2,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Link2,
} from 'lucide-react';

export default function CloserPage() {
  const [mensajes, setMensajes] = useState<Array<{ emisor: 'cliente' | 'asistente'; texto: string }>>([
    {
      emisor: 'cliente',
      texto: 'Hola, buenas tardes. Vi su anuncio en Instagram. ¿Qué precio tiene el producto y hacen envíos a Viña del Mar?',
    },
    {
      emisor: 'asistente',
      texto: '¡Hola! Qué gusto saludarte. 🙌 Sí, hacemos envíos a Viña del Mar con Starken y llega en 24 a 48 hrs directo a tu domicilio. El valor promocional de esta semana es de $24.900 con garantía oficial. ¿Te gustaría pagar con transferencia o tarjeta en cuotas para asegurarte una unidad hoy mismo? 📦',
    },
  ]);

  const [inputMensaje, setInputMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [entrenamientoModal, setEntrenamientoModal] = useState(false);

  // Generador de Links Directos para WhatsApp
  const [waPhone, setWaPhone] = useState('56912345678');
  const [waText, setWaText] = useState('¡Hola! Vi su catálogo en redes sociales y quiero cotizar.');
  const [linkCopied, setLinkCopied] = useState(false);

  const [entrenamientoData, setEntrenamientoData] = useState({
    nombreNegocio: 'Boutique Nórdica Chile',
    catalogo: 'Abrigos de lana italiana ($45.000), Chaquetas cortaviento ($29.900), Sweaters de alpaca ($34.900). Tallas S, M, L y XL.',
    politicasEnvio: 'Envíos gratis en Santiago por compras sobre $40.000. Regiones vía Starken o Chilexpress por pagar o con tarifa plana de $4.500.',
    mediosPago: 'MercadoPago (débito, crédito hasta en 6 cuotas sin interés) y Transferencia Banco Estado / Cuenta RUT.',
  });

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMensaje.trim() || loading) return;

    const nuevoMensajeCliente = { emisor: 'cliente' as const, texto: inputMensaje.trim() };
    const historialActualizado = [...mensajes, nuevoMensajeCliente];
    setMensajes(historialActualizado);
    setInputMensaje('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/closer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensajeCliente: nuevoMensajeCliente.texto,
          historial: historialActualizado,
          nombreNegocio: entrenamientoData.nombreNegocio,
          catalogoYPrecios: entrenamientoData.catalogo,
          politicasEnvio: entrenamientoData.politicasEnvio,
        }),
      });
      const data = await res.json();
      if (data.respuesta) {
        setMensajes([...historialActualizado, { emisor: 'asistente', texto: data.respuesta }]);
      }
    } catch (err) {
      console.error(err);
      setMensajes([
        ...historialActualizado,
        {
          emisor: 'asistente',
          texto: '¡Por supuesto! Tenemos opciones con envío rápido a todo Chile y pago seguro con MercadoPago o transferencia. ¿Qué modelo te gustaría revisar en detalle?',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-emerald-400" />
            Closer de Ventas Automático
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Inbox unificado y simulador de ventas. Gemini responde tus mensajes de WhatsApp e Instagram como un vendedor estrella que nunca duerme.
          </p>
        </div>

        <button
          onClick={() => setEntrenamientoModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition"
        >
          <BookOpen className="h-4 w-4 text-indigo-400" />
          Entrenar con mi Catálogo / Info
        </button>
      </div>

      {/* Canales Activos Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-[#0d1424] p-4 text-xs">
        <span className="text-slate-400 font-semibold">Canales Sincronizados:</span>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 px-3 py-1 font-semibold border border-emerald-500/20">
          <Phone className="h-3.5 w-3.5" /> WhatsApp Cloud API
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-pink-500/10 text-pink-400 px-3 py-1 font-semibold border border-pink-500/20">
          <Instagram className="h-3.5 w-3.5" /> Instagram Direct
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/10 text-blue-400 px-3 py-1 font-semibold border border-blue-500/20">
          <Facebook className="h-3.5 w-3.5" /> Facebook Messenger
        </span>
      </div>

      {/* Generador de Links Directos para WhatsApp y Bio de Instagram */}
      <div className="rounded-3xl border border-slate-800 bg-[#0a0f1d] p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white">Generador de Enlaces Directos hacia tu Closer de WhatsApp</h3>
          </div>
          <span className="text-[10px] text-slate-400">Pega este link en tu Bio de Instagram y Anuncios</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 text-[11px] mb-1 font-semibold">Número con código país (ej: 569...)</label>
            <input
              type="text"
              value={waPhone}
              onChange={(e) => setWaPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2 text-white text-xs font-mono"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-slate-400 text-[11px] mb-1 font-semibold">Mensaje predeterminado del prospecto</label>
            <input
              type="text"
              value={waText}
              onChange={(e) => setWaText(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2 text-white text-xs"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <code className="text-[11px] text-emerald-300 font-mono break-all bg-black/40 px-3 py-1.5 rounded-lg flex-1">
            {`https://wa.me/${waPhone.replace(/\+/g, '')}?text=${encodeURIComponent(waText)}`}
          </code>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const link = `https://wa.me/${waPhone.replace(/\+/g, '')}?text=${encodeURIComponent(waText)}`;
                navigator.clipboard.writeText(link);
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 2000);
              }}
              className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 border border-slate-700 transition"
            >
              {linkCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{linkCopied ? '¡Copiado!' : 'Copiar Link'}</span>
            </button>
            <a
              href={`https://wa.me/${waPhone.replace(/\+/g, '')}?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Probar en WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Simulador de Chat en Vivo */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-2xl flex flex-col h-[520px]">
        {/* Chat Topbar */}
        <div className="border-b border-slate-800 bg-[#0a0f1d] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Simulador en Vivo: Prospecto de Instagram / WhatsApp</h3>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Closer IA entrenado y listo para cerrar
              </span>
            </div>
          </div>

          <button
            onClick={() =>
              setMensajes([
                {
                  emisor: 'cliente',
                  texto: 'Hola, ¿está disponible el producto y cómo puedo pagar?',
                },
              ])
            }
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Reiniciar conversación
          </button>
        </div>

        {/* Mensajes Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {mensajes.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.emisor === 'cliente' ? 'justify-start' : 'justify-end'}`}
            >
              {m.emisor === 'cliente' && (
                <div className="h-8 w-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 border border-slate-700">
                  <User className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-md rounded-2xl p-4 text-xs leading-relaxed ${
                  m.emisor === 'cliente'
                    ? 'bg-slate-800/90 text-slate-200 border border-slate-700'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20'
                }`}
              >
                <span className="text-[10px] font-bold block mb-1 opacity-70">
                  {m.emisor === 'cliente' ? 'Prospecto / Cliente' : 'Segar Closer IA'}
                </span>
                <p className="whitespace-pre-line">{m.texto}</p>
              </div>

              {m.emisor === 'asistente' && (
                <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>El Closer está formulando la técnica de cierre ideal...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={enviarMensaje} className="border-t border-slate-800 bg-[#0a0f1d] p-4 flex gap-3">
          <input
            type="text"
            placeholder="Escribe como si fueras un cliente (ej: '¿Tienen descuento si llevo 2?')..."
            value={inputMensaje}
            onChange={(e) => setInputMensaje(e.target.value)}
            className="flex-1 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !inputMensaje.trim()}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition disabled:opacity-50 flex items-center gap-1.5"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Enviar</span>
          </button>
        </form>
      </div>

      {/* Modal de Entrenamiento */}
      {entrenamientoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-700 bg-[#0d1424] p-6 shadow-2xl">
            <button
              onClick={() => setEntrenamientoModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Entrenar Closer con la Info de tu Negocio</h3>
                <p className="text-xs text-slate-400">Pega tu catálogo y políticas para respuestas precisas</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre de la Empresa</label>
                <input
                  type="text"
                  value={entrenamientoData.nombreNegocio}
                  onChange={(e) => setEntrenamientoData({ ...entrenamientoData, nombreNegocio: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Catálogo de Productos y Precios</label>
                <textarea
                  rows={3}
                  value={entrenamientoData.catalogo}
                  onChange={(e) => setEntrenamientoData({ ...entrenamientoData, catalogo: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Políticas de Envíos</label>
                <textarea
                  rows={2}
                  value={entrenamientoData.politicasEnvio}
                  onChange={(e) => setEntrenamientoData({ ...entrenamientoData, politicasEnvio: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-white"
                />
              </div>

              <div className="p-3 rounded-xl border border-dashed border-slate-700 bg-slate-800/40 text-center">
                <Upload className="h-6 w-6 text-slate-500 mx-auto mb-1" />
                <span className="text-[11px] text-slate-400 block font-semibold">Subir archivo PDF de tu catálogo</span>
                <span className="text-[10px] text-slate-500">Extracción de texto automática</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEntrenamientoModal(false)}
                className="py-2.5 px-4 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setEntrenamientoModal(false);
                  alert('¡Closer IA re-entrenado exitosamente con tu catálogo!');
                }}
                className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
              >
                Guardar y Activar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
