'use client';

import React, { useState, useEffect } from 'react';
import {
  Zap,
  Instagram,
  Facebook,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  Send,
  Clock,
  Calendar,
  Sparkles,
  Link2,
  RefreshCw,
  Eye,
  Check,
} from 'lucide-react';

export default function AutopilotPage() {
  const [autoPublishEnabled, setAutoPublishEnabled] = useState(true);
  const [metaAccessToken, setMetaAccessToken] = useState('');
  const [metaInstagramAccountId, setMetaInstagramAccountId] = useState('');
  const [metaPageId, setMetaPageId] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Estado de publicación de prueba
  const [publishingTest, setPublishingTest] = useState(false);
  const [publishResult, setPublishResult] = useState<any>(null);
  const [testCaption, setTestCaption] = useState(
    '🔥 ¡Oferta de la semana disponible en todo Chile! Envíos rápidos y asesoría personalizada. Escríbenos al link de la biografía para coordinar el tuyo. 📦🇨🇱 #PymeChile #EmprendedoresChile #Ventas'
  );
  const [testImageUrl, setTestImageUrl] = useState(
    'https://image.pollinations.ai/prompt/chilean%20boutique%20luxury%20fashion%20commercial%20advertising?width=1080&height=1080&nologo=true'
  );

  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    cargarConfig();
  }, []);

  const cargarConfig = async () => {
    try {
      const res = await fetch('/api/integrations/meta/publish');
      const data = await res.json();
      if (data.config) {
        setAutoPublishEnabled(data.config.autoPublishEnabled ?? true);
        if (data.config.instagramAccountId) setMetaInstagramAccountId(data.config.instagramAccountId);
        if (data.config.facebookPageId) setMetaPageId(data.config.facebookPageId);
      }
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGuardarConfig = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch('/api/integrations/meta/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'guardar_config',
          settings: {
            autoPublishEnabled,
            metaAccessToken,
            metaInstagramAccountId,
            metaPageId,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (err: any) {
      alert('Error guardando configuración: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePublicarPrueba = async (platform: 'instagram' | 'facebook') => {
    setPublishingTest(true);
    setPublishResult(null);
    try {
      const res = await fetch('/api/integrations/meta/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          caption: testCaption,
          imageUrl: testImageUrl,
        }),
      });
      const data = await res.json();
      setPublishResult(data);
      cargarConfig();
    } catch (err: any) {
      setPublishResult({ success: false, error: err.message });
    } finally {
      setPublishingTest(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-400 mb-2 border border-indigo-500/20">
            <Zap className="h-3.5 w-3.5" />
            <span>PILOTO AUTOMÁTICO 100% REAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            Auto-Publicación en Instagram & Facebook
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Conecta tu cuenta comercial con Meta Graph API. SEGAR AI publicará tus posts, carruseles y reels en tus redes a la hora de mayor tráfico sin que tengas que tocar el teléfono.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGuardarConfig}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 active:scale-95 transition"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Guardando...' : savedSuccess ? '¡Guardado!' : 'Guardar Conexión'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 p-3 text-xs text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>¡Configuración de auto-publicación guardada exitosamente!</span>
        </div>
      )}

      {/* Grid Principal: Configuración & Publicador de Prueba */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Conexión Meta Graph API */}
        <div className="rounded-3xl border border-slate-800 bg-[#0d1424] p-6 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-gradient-to-tr from-purple-500/20 to-pink-500/20 text-pink-400 border border-pink-500/30">
                <Instagram className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">1. Conectar Meta Graph API</h3>
                <p className="text-[11px] text-slate-400">Instagram Professional & Facebook Pages</p>
              </div>
            </div>

            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoPublishEnabled}
                onChange={(e) => setAutoPublishEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Instagram Professional Account ID
              </label>
              <input
                type="text"
                placeholder="Ej: 17841400123456789"
                value={metaInstagramAccountId}
                onChange={(e) => setMetaInstagramAccountId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-500 mt-1">El ID numérico de tu perfil comercial de Instagram vinculado a tu página.</p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Facebook Page ID
              </label>
              <input
                type="text"
                placeholder="Ej: 102938475610293"
                value={metaPageId}
                onChange={(e) => setMetaPageId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Meta Page Access Token (Token de Larga Duración)
              </label>
              <input
                type="password"
                placeholder="EAA..."
                value={metaAccessToken}
                onChange={(e) => setMetaAccessToken(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Guía Rápida */}
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-4 text-[11px] text-slate-300 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-300">💡 Pasos para obtener tu token en Meta for Developers:</span>
                <a
                  href="https://developers.facebook.com/tools/explorer/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 font-bold"
                >
                  <span>Graph API Explorer</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <ol className="list-decimal list-inside text-slate-400 space-y-1 text-[10px]">
                <li>Ingresa a <strong>developers.facebook.com</strong> y crea una app tipo "Empresa".</li>
                <li>Agrega los permisos <code>instagram_basic</code>, <code>instagram_content_publish</code> y <code>pages_manage_posts</code>.</li>
                <li>Copia tu Token y pégalo arriba. ¡El piloto automático quedará activo!</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Card 2: Probador de Publicación Inmediata */}
        <div className="rounded-3xl border border-slate-800 bg-[#0d1424] p-6 space-y-5 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">2. Probar Disparo en Vivo</h3>
                  <p className="text-[11px] text-slate-400">Publica un post de prueba inmediatamente en tus redes</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Copy / Texto de la Publicación</label>
              <textarea
                rows={3}
                value={testCaption}
                onChange={(e) => setTestCaption(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">URL de la Imagen Publicitaria</label>
              <input
                type="text"
                value={testImageUrl}
                onChange={(e) => setTestImageUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Vista previa en miniatura */}
            <div className="h-28 rounded-xl overflow-hidden relative border border-slate-700 bg-slate-900">
              <img src={testImageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>

            {publishResult && (
              <div
                className={`rounded-xl border p-3 text-xs ${
                  publishResult.success
                    ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
                    : 'border-rose-500/30 bg-rose-950/40 text-rose-300'
                }`}
              >
                {publishResult.success ? (
                  <div>
                    <p className="font-bold">✅ ¡Post publicado exitosamente en Meta!</p>
                    {publishResult.permalink && (
                      <a
                        href={publishResult.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-[11px] font-semibold mt-1 inline-block"
                      >
                        Ver publicación en vivo →
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="font-bold">❌ Error: {publishResult.error}</p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handlePublicarPrueba('instagram')}
              disabled={publishingTest}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 py-3 text-xs font-bold text-white shadow-md transition disabled:opacity-50"
            >
              <Instagram className="h-4 w-4" />
              <span>{publishingTest ? 'Publicando...' : 'Publicar en Instagram'}</span>
            </button>

            <button
              onClick={() => handlePublicarPrueba('facebook')}
              disabled={publishingTest}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold text-white shadow-md transition disabled:opacity-50"
            >
              <Facebook className="h-4 w-4" />
              <span>{publishingTest ? 'Publicando...' : 'Publicar en Facebook'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de Historial de Publicaciones Automáticas */}
      <div className="rounded-3xl border border-slate-800 bg-[#0d1424] p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-400" />
              <span>Historial de Publicaciones en Piloto Automático</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Registro inmutable de publicaciones disparadas automáticamente a través de la API oficial de Meta.
            </p>
          </div>
          <button
            onClick={cargarConfig}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3 px-3">Red Social</th>
                <th className="pb-3 px-3">Texto / Caption</th>
                <th className="pb-3 px-3">Fecha y Hora</th>
                <th className="pb-3 px-3">Estado</th>
                <th className="pb-3 px-3 text-right">Enlace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Aún no se han ejecutado auto-publicaciones. ¡Prueba el disparador arriba o activa el calendario!
                  </td>
                </tr>
              ) : (
                logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-semibold text-white capitalize">
                      {log.platform === 'instagram' ? '📸 Instagram' : '📘 Facebook'}
                    </td>
                    <td className="py-3 px-3 max-w-xs truncate text-slate-300">
                      {log.caption}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                      {new Date(log.timestamp).toLocaleString('es-CL')}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold">
                        <CheckCircle2 className="h-3 w-3" /> Publicado
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {log.permalink && (
                        <a
                          href={log.permalink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold text-[11px]"
                        >
                          <span>Ver</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
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
