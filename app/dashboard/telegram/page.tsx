'use client';

import React, { useState } from 'react';
import {
  Bot,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Smartphone,
  ExternalLink,
  Loader2,
  RefreshCw,
} from 'lucide-react';

export default function TelegramPage() {
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Estado del simulador interactivo de Telegram
  const [postSimulado, setPostSimulado] = useState({
    dia: 3,
    hora: '19:45 hrs',
    titulo: 'Oferta Especial de Mitad de Semana 🔥',
    texto: `🚨 ¡Atención Santiago y Regiones! Si estabas esperando la señal para renovar, es hoy.\n\nEn Café Austral seleccionamos solo granos de especialidad tostados esta misma semana. Sabor auténtico sin acidez desagradable.\n\n✅ Envíos en 24 hrs\n✅ Paga en cuotas con MercadoPago\n\n👉 Escribe 'QUIERO' y te mandamos el descuento exclusivo al DM.`,
    imagenUrl: 'https://image.pollinations.ai/prompt/commercial%20coffee%20cup%20artisanal%20chile%20steam%20modern%20cafe?width=800&height=600&nologo=true',
    estado: 'pendiente' as 'pendiente' | 'aprobado' | 'rechazado' | 'editando',
  });

  const [feedbackInput, setFeedbackInput] = useState('');
  const [reescribiendo, setReescribiendo] = useState(false);

  const handleAprobar = () => {
    setPostSimulado({ ...postSimulado, estado: 'aprobado' });
  };

  const handleRechazar = () => {
    setPostSimulado({ ...postSimulado, estado: 'rechazado' });
  };

  const handleCorregir = async () => {
    if (!feedbackInput.trim()) return;
    setReescribiendo(true);
    try {
      const res = await fetch('/api/telegram/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            chat: { id: 123456 },
            text: feedbackInput,
            reply_to_message: {
              text: postSimulado.texto,
            },
          },
        }),
      });
      // Simular la reescritura directa
      setPostSimulado({
        ...postSimulado,
        texto: `[Reescrito con tu indicación: "${feedbackInput}"]\n\n${postSimulado.texto}\n\n👉 ¡Aprovecha hoy mismo con envío gratis!`,
        estado: 'pendiente',
      });
      setFeedbackInput('');
    } catch (e) {
      console.error(e);
    } finally {
      setReescribiendo(false);
    }
  };

  const dispararTestTelegramReal = async () => {
    setLoading(true);
    setTestStatus(null);
    try {
      const res = await fetch('/api/telegram/send-approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: 'test_telegram_01',
          negocioNombre: 'Mi Tienda Chile',
          dia: postSimulado.dia,
          copy: postSimulado.texto,
          imagenUrl: postSimulado.imagenUrl,
          horaRecomendada: postSimulado.hora,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestStatus('¡Mensaje enviado con éxito a la API de Telegram! Revisa tu aplicación de Telegram.');
      } else {
        setTestStatus(data.error || 'Telegram no configurado. Ingresa tu Token en el Panel Super Admin para recibir alertas reales.');
      }
    } catch (err: any) {
      setTestStatus('Error enviando a Telegram.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Bot className="h-6 w-6 text-purple-400" />
            Telegram como Panel de Control Móvil ($0 Costo)
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Controla tu agencia de marketing desde la palma de tu mano sin entrar a la computadora. Aprueba o pide correcciones a Gemini con 1 solo toque.
          </p>
        </div>

        <a
          href="/dashboard/admin"
          className="inline-flex items-center gap-2 rounded-xl bg-purple-950/40 border border-purple-500/40 px-3.5 py-2 text-xs font-bold text-purple-300 hover:bg-purple-900/60 transition"
        >
          <Bot className="h-4 w-4" />
          <span>Configurar Bot en Super Admin</span>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Simulador Interactivo de la Experiencia Móvil */}
        <div className="rounded-3xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-bold text-white">Simulador en Vivo: Teléfono del Dueño</span>
            </div>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 font-semibold px-2 py-0.5 rounded">
              @SegarMarketingBot
            </span>
          </div>

          {/* Tarjeta de Telegram */}
          <div className="rounded-2xl border border-slate-700 bg-[#17212b] p-4 text-xs text-slate-100 shadow-xl space-y-3">
            {/* Foto del post */}
            <div className="relative h-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
              <img
                src={postSimulado.imagenUrl}
                alt="Post Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] text-white">
                Día {postSimulado.dia} • {postSimulado.hora}
              </div>
            </div>

            {/* Texto del Bot */}
            <div className="space-y-1.5">
              <p className="font-bold text-white">🚀 SEGAR AI: Nuevo Post Listo para tu Negocio</p>
              <p className="whitespace-pre-line text-slate-200 text-[11px] leading-relaxed">
                {postSimulado.texto}
              </p>
              <p className="text-[11px] text-slate-400 italic pt-1">
                ¿Aprobamos para publicación automática en Instagram y Facebook?
              </p>
            </div>

            {/* Estado del Post */}
            {postSimulado.estado === 'aprobado' && (
              <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>¡Post Aprobado! Programado para salir a las {postSimulado.hora}.</span>
              </div>
            )}

            {postSimulado.estado === 'rechazado' && (
              <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Post rechazado y descartado del calendario.</span>
              </div>
            )}

            {/* Botones Inline de Telegram */}
            <div className="space-y-2 pt-2 border-t border-slate-700">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAprobar}
                  className="py-2 px-3 rounded-lg bg-[#2b5278] hover:bg-[#346290] text-white text-xs font-semibold transition text-center"
                >
                  ✅ Aprobar y Publicar
                </button>
                <button
                  onClick={handleRechazar}
                  className="py-2 px-3 rounded-lg bg-[#3b2b35] hover:bg-[#4b3543] text-rose-300 text-xs font-semibold transition text-center"
                >
                  ❌ Rechazar
                </button>
              </div>

              <button
                onClick={() => setPostSimulado({ ...postSimulado, estado: 'editando' })}
                className="w-full py-2 px-3 rounded-lg bg-[#253243] hover:bg-[#2e3e53] text-indigo-300 text-xs font-semibold transition text-center flex items-center justify-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>✏️ Corregir con IA</span>
              </button>
            </div>

            {/* Input para corrección con Gemini */}
            {postSimulado.estado === 'editando' && (
              <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-indigo-500/40 space-y-2">
                <span className="text-[11px] font-semibold text-indigo-300 block">
                  Indica tu corrección para que Gemini reescriba:
                </span>
                <input
                  type="text"
                  placeholder="Ej: 'Hazlo más corto y enfócate en el 2x1'..."
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2 text-xs text-white"
                />
                <button
                  onClick={handleCorregir}
                  disabled={reescribiendo || !feedbackInput.trim()}
                  className="w-full py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  {reescribiendo ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                  <span>Reescribir con Gemini Ahora</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Panel de Configuración Real de Telegram */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Bot className="h-5 w-5 text-indigo-400" />
              Conectar tu Bot Real en 3 Minutos (100% Gratis)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Telegram no cobra nada por bots. Sigue estos 3 pasos para recibir las notificaciones en tu celular:
            </p>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5 bg-slate-800/60 p-3 rounded-xl">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">1</span>
                <div>
                  <p className="font-semibold text-white">Habla con @BotFather en Telegram</p>
                  <p className="text-slate-400 mt-0.5">Envía <code>/newbot</code>, dale un nombre y copia tu <strong>HTTP API Token</strong>.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-800/60 p-3 rounded-xl">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">2</span>
                <div>
                  <p className="font-semibold text-white">Pega el Token en tu archivo .env.local</p>
                  <p className="text-slate-400 mt-0.5">Define <code>TELEGRAM_BOT_TOKEN=...</code> y tu Chat ID personal.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-800/60 p-3 rounded-xl">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">3</span>
                <div>
                  <p className="font-semibold text-white">Vincula el Webhook de Segar AI</p>
                  <p className="text-slate-400 mt-0.5">Abre en tu navegador:</p>
                  <code className="text-[10px] text-indigo-300 break-all bg-black/40 p-1 rounded mt-1 block">
                    https://api.telegram.org/botTU_TOKEN/setWebhook?url=TU_URL/api/telegram/webhook
                  </code>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={dispararTestTelegramReal}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span>Disparar Notificación de Prueba a Telegram</span>
              </button>

              {testStatus && (
                <div className="mt-3 p-3 rounded-xl bg-slate-800 text-xs text-indigo-200 border border-slate-700">
                  {testStatus}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
