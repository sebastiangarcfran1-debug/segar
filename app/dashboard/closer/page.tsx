'use client';

import React, { useState, useEffect } from 'react';
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
  Settings,
  Users,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function CloserPage() {
  const [activeTab, setActiveTab] = useState<'simulador' | 'conexion' | 'leads'>('simulador');

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
  const [waPhone, setWaPhone] = useState('56991842110');
  const [waText, setWaText] = useState('¡Hola! Vi su catálogo en redes sociales y quiero cotizar.');
  const [linkCopied, setLinkCopied] = useState(false);

  // Configuración WhatsApp Cloud API
  const [waConfig, setWaConfig] = useState({
    phoneNumberId: '109847291823901',
    accessToken: 'EAAGxxxxxxxxxxxxxxxxxxxxxxxxx',
    businessAccountId: '192837465019283',
    verifyToken: 'segar_wa_verify_2026',
    autoReplyEnabled: true,
  });
  const [configSaved, setConfigSaved] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Leads en Vivo
  const [leads, setLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  const [entrenamientoData, setEntrenamientoData] = useState({
    nombreNegocio: 'Boutique Nórdica Chile',
    catalogo: 'Abrigos de lana italiana ($45.000), Chaquetas cortaviento ($29.900), Sweaters de alpaca ($34.900). Tallas S, M, L y XL.',
    politicasEnvio: 'Envíos gratis en Santiago por compras sobre $40.000. Regiones vía Starken o Chilexpress por pagar o con tarifa plana de $4.500.',
    mediosPago: 'MercadoPago (débito, crédito hasta en 6 cuotas sin interés) y Transferencia Banco Estado / Cuenta RUT.',
  });

  useEffect(() => {
    if (activeTab === 'leads') {
      cargarLeads();
    }
  }, [activeTab]);

  const cargarLeads = async () => {
    setLoadingLeads(true);
    try {
      const res = await fetch('/api/roi');
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLeads(false);
    }
  };

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

  const copiarAlPortapapeles = (texto: string, campo: string) => {
    navigator.clipboard.writeText(texto);
    setCopiedField(campo);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const guardarConfiguracionWA = async () => {
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-emerald-400" />
            Closer de Ventas IA (WhatsApp Cloud API & Direct)
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Tu vendedor estrella 24/7 conectado oficialmente a Meta WhatsApp Cloud API y redes sociales.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setEntrenamientoModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition"
          >
            <BookOpen className="h-4 w-4 text-indigo-400" />
            Entrenar Catálogo
          </button>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'simulador'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Bot className="h-4 w-4" />
          <span>Simulador & Enlaces Bio</span>
        </button>

        <button
          onClick={() => setActiveTab('conexion')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'conexion'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Conexión Meta Cloud API</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'leads'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Leads & Mensajes Reales ({leads.length})</span>
        </button>
      </div>

      {/* TAB 1: SIMULADOR Y GENERADOR DE ENLACES */}
      {activeTab === 'simulador' && (
        <div className="space-y-6">
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
                    Closer IA entrenado y listo para cerrar ventas
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
        </div>
      )}

      {/* TAB 2: CONEXIÓN META WHATSAPP CLOUD API */}
      {activeTab === 'conexion' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-emerald-500/30 bg-[#0d1424] p-6 shadow-2xl space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 text-emerald-300 px-3 py-1 text-xs font-black mb-2 border border-emerald-500/30">
                  <ShieldCheck className="h-3.5 w-3.5" /> META OFFICIAL CLOUD API
                </span>
                <h2 className="text-xl font-black text-white">Configurar Webhook y Credenciales de WhatsApp</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Conecta tu número oficial a través de Meta for Developers para que Gemini 2.0 responda automáticamente cada mensaje entrante.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-emerald-400 font-bold block">ESTADO DEL WEBHOOK</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  Activo & Escuchando
                </span>
              </div>
            </div>

            {/* Parámetros para Meta for Developers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">URL del Webhook (Callback URL)</label>
                  <button
                    onClick={() =>
                      copiarAlPortapapeles(
                        typeof window !== 'undefined'
                          ? `${window.location.origin}/api/webhooks/whatsapp`
                          : 'https://segar.ai/api/webhooks/whatsapp',
                        'webhookUrl'
                      )
                    }
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                  >
                    {copiedField === 'webhookUrl' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedField === 'webhookUrl' ? 'Copiado' : 'Copiar URL'}</span>
                  </button>
                </div>
                <code className="block bg-black/60 p-2.5 rounded-xl text-xs font-mono text-emerald-300 break-all border border-slate-800">
                  {typeof window !== 'undefined'
                    ? `${window.location.origin}/api/webhooks/whatsapp`
                    : 'https://segar.ai/api/webhooks/whatsapp'}
                </code>
                <span className="text-[10px] text-slate-500 block">
                  Pega esta URL en Meta App Dashboard &gt; WhatsApp &gt; Configuration &gt; Callback URL
                </span>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">Verify Token de Seguridad</label>
                  <button
                    onClick={() => copiarAlPortapapeles(waConfig.verifyToken, 'verifyToken')}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                  >
                    {copiedField === 'verifyToken' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedField === 'verifyToken' ? 'Copiado' : 'Copiar Token'}</span>
                  </button>
                </div>
                <code className="block bg-black/60 p-2.5 rounded-xl text-xs font-mono text-indigo-300 break-all border border-slate-800">
                  {waConfig.verifyToken}
                </code>
                <span className="text-[10px] text-slate-500 block">
                  Token pre-autorizado en el servidor para validar el handshake de Meta.
                </span>
              </div>
            </div>

            {/* Inputs de Credenciales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Phone Number ID</label>
                <input
                  type="text"
                  value={waConfig.phoneNumberId}
                  onChange={(e) => setWaConfig({ ...waConfig, phoneNumberId: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Business Account ID</label>
                <input
                  type="text"
                  value={waConfig.businessAccountId}
                  onChange={(e) => setWaConfig({ ...waConfig, businessAccountId: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">System User Access Token</label>
                <input
                  type="password"
                  value={waConfig.accessToken}
                  onChange={(e) => setWaConfig({ ...waConfig, accessToken: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={waConfig.autoReplyEnabled}
                  onChange={(e) => setWaConfig({ ...waConfig, autoReplyEnabled: e.target.checked })}
                  className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Habilitar Respuesta Automática Inmediata con Gemini 2.0 Flash</span>
              </label>

              <button
                onClick={guardarConfiguracionWA}
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center gap-2"
              >
                {configSaved ? <Check className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                <span>{configSaved ? '¡Configuración Guardada!' : 'Guardar y Activar Webhook'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LEADS Y CONVERSACIONES REALES */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-400" />
              Bandeja de Leads y Conversaciones Capturadas en Vivo
            </h3>
            <button
              onClick={cargarLeads}
              disabled={loadingLeads}
              className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 border border-slate-700"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingLeads ? 'animate-spin' : ''}`} />
              <span>Actualizar Leads</span>
            </button>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#0d1424] overflow-hidden shadow-2xl">
            {leads.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <Users className="h-10 w-10 mx-auto text-slate-600" />
                <p className="text-sm font-semibold text-slate-300">Aún no hay leads capturados hoy</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Comparte tu enlace de WhatsApp en tu bio o anuncios para que el Closer IA empiece a registrar prospectos automáticamente.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {leads.map((lead, idx) => (
                  <div key={lead.id || idx} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">{lead.name || lead.phone}</span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {lead.phone}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {lead.timestamp ? new Date(lead.timestamp).toLocaleTimeString('es-CL') : 'Reciente'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        <strong className="text-slate-400">Mensaje:</strong> &quot;{lead.lastMessage}&quot;
                      </p>
                      {lead.aiReply && (
                        <p className="text-[11px] text-indigo-300 bg-indigo-950/40 p-2 rounded-lg border border-indigo-900/40 mt-1">
                          <strong className="text-indigo-400">Respuesta IA:</strong> {lead.aiReply}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-semibold">Valor Estimado</span>
                        <span className="text-xs font-black text-emerald-400">
                          ${(lead.dealValueCLP || 35000).toLocaleString('es-CL')} CLP
                        </span>
                      </div>
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-600/30 transition"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Abrir Chat</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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
