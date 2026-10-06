'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  Image as ImageIcon,
  Copy,
  Check,
  Send,
  Loader2,
  Clock,
  Film,
  Megaphone,
  ExternalLink,
  ChevronRight,
  Video,
  Edit3,
  RefreshCw,
} from 'lucide-react';

export default function ContenidoPage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'anuncios'>('posts');
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingAnuncios, setLoadingAnuncios] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [anuncios, setAnuncios] = useState<any>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [sentTelegramIdx, setSentTelegramIdx] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [regeneratingImg, setRegeneratingImg] = useState(false);

  const [businessData, setBusinessData] = useState({
    nombre: 'Café Austral Valdivia',
    rubro: 'Cafetería & Pastelería Artesanal',
    queVende: 'Café de especialidad tostado en Chile y tortas artesanales con despacho local',
    precio: '$12.900 CLP',
  });

  const generar30Posts = async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch('/api/ai/generar-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(businessData),
      });
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error(err);
      alert('Error generando posts.');
    } finally {
      setLoadingPosts(false);
    }
  };

  const generarAnuncios = async () => {
    setLoadingAnuncios(true);
    try {
      const res = await fetch('/api/ai/generar-anuncios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(businessData),
      });
      const data = await res.json();
      if (data.anuncios) {
        setAnuncios(data.anuncios);
      }
    } catch (err) {
      console.error(err);
      alert('Error generando anuncios.');
    } finally {
      setLoadingAnuncios(false);
    }
  };

  const enviarATelegram = async (post: any, idx: number) => {
    setSentTelegramIdx(idx);
    try {
      await fetch('/api/telegram/send-approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: `post_${idx + 1}`,
          negocioNombre: businessData.nombre,
          dia: post.dia,
          copy: post.copy,
          imagenUrl: post.imagenUrl,
          horaRecomendada: post.horaRecomendada,
        }),
      });
      alert(`¡Post del Día ${post.dia} enviado al Bot de Telegram para su aprobación móvil!`);
    } catch (err) {
      console.error(err);
    } finally {
      setSentTelegramIdx(null);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Calendar className="h-6 w-6 text-indigo-400" />
            Fábrica de Contenido & Anuncios
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Genera 30 publicaciones con imágenes sin costo adicional y crea campañas con guiones para TikTok.
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
              activeTab === 'posts' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="h-4 w-4" />
            30 Posts del Mes
          </button>
          <button
            onClick={() => setActiveTab('anuncios')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
              activeTab === 'anuncios' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Megaphone className="h-4 w-4" />
            Anuncios & TikTok Scripts
          </button>
        </div>
      </div>

      {/* Inputs de Contexto */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Nombre Negocio</label>
          <input
            type="text"
            value={businessData.nombre}
            onChange={(e) => setBusinessData({ ...businessData, nombre: e.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Rubro</label>
          <input
            type="text"
            value={businessData.rubro}
            onChange={(e) => setBusinessData({ ...businessData, rubro: e.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Qué vende</label>
          <input
            type="text"
            value={businessData.queVende}
            onChange={(e) => setBusinessData({ ...businessData, queVende: e.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
          />
        </div>
      </div>

      {/* PESTAÑA 1: 30 POSTS */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {posts.length > 0 ? `Mostrando ${posts.length} posts listos con Pollinations AI` : 'Aún no has generado los 30 posts de este mes'}
            </span>
            <button
              onClick={generar30Posts}
              disabled={loadingPosts}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:opacity-95 transition disabled:opacity-50"
            >
              {loadingPosts ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creando 30 posts y generando fotos...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {posts.length > 0 ? 'Regenerar 30 Posts del Mes' : 'Crear 30 Posts del Mes'}
                </>
              )}
            </button>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((p, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-[#0d1424] overflow-hidden flex flex-col justify-between hover:border-indigo-500/40 transition shadow-xl"
                >
                  {/* Imagen Pollinations */}
                  <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                    <img
                      src={p.imagenUrl}
                      alt={p.titulo}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold text-white backdrop-blur">
                      Día {p.dia}
                    </div>
                    <div className="absolute top-3 right-3 rounded-full bg-indigo-600/80 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
                      {p.pilar}
                    </div>
                  </div>

                  {/* Cuerpo */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-white text-xs mb-2">{p.titulo}</h3>
                      <p className="text-[11px] text-slate-300 whitespace-pre-line line-clamp-5 mb-3 leading-relaxed">
                        {p.copy}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] text-indigo-400 font-medium mb-3">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Hora sugerida: {p.horaRecomendada} (Peak Chile)</span>
                      </div>

                      <div className="flex items-center gap-1.5 border-t border-slate-800 pt-3">
                        <button
                          onClick={() => copyToClipboard(p.copy, idx)}
                          className="flex-1 py-2 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1 transition"
                        >
                          {copiedIdx === idx ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          <span>{copiedIdx === idx ? 'Copiado' : 'Copiar'}</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditingPost({ ...p });
                            setEditingIdx(idx);
                          }}
                          className="py-2 px-2.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1 transition"
                          title="Editar post y foto"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => enviarATelegram(p, idx)}
                          disabled={sentTelegramIdx === idx}
                          title="Enviar a Telegram para aprobar o corregir"
                          className="py-2 px-2.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>Telegram</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center">
              <Calendar className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Tu calendario editorial está vacío</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
                Haz clic en el botón de arriba para que Gemini 2.0 y Pollinations construyan los 30 posts con sus fotos publicitarias en segundos.
              </p>
              <button
                onClick={generar30Posts}
                disabled={loadingPosts}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-indigo-500 transition"
              >
                <Sparkles className="h-4 w-4" />
                Generar 30 Posts Ahora
              </button>
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA 2: ANUNCIOS & GUIONES TIKTOK */}
      {activeTab === 'anuncios' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Campaña publicitaria completa: 5 Headlines + 5 Copys + 5 Creativos + 3 Guiones de Video
            </span>
            <button
              onClick={generarAnuncios}
              disabled={loadingAnuncios}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition disabled:opacity-50"
            >
              {loadingAnuncios ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Escribiendo anuncios y guiones...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generar Set de Anuncios & Guiones
                </>
              )}
            </button>
          </div>

          {anuncios ? (
            <div className="space-y-8">
              {/* 5 Headlines */}
              <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-5">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-indigo-400" />
                  5 Headlines Irresistibles para Meta Ads
                </h3>
                <div className="space-y-2">
                  {anuncios.headlines?.map((h: string, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-slate-800/60 p-3 rounded-xl text-xs text-slate-200">
                      <span><strong>#{i + 1}:</strong> {h}</span>
                      <button
                        onClick={() => copyToClipboard(h, 100 + i)}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        {copiedIdx === 100 + i ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5 Copys */}
              <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-5">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Copy className="h-4 w-4 text-emerald-400" />
                  5 Copys Persuasivos (AIDA & PAS)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {anuncios.copys?.map((c: string, i: number) => (
                    <div key={i} className="bg-slate-800/50 p-4 rounded-xl text-xs text-slate-200 flex flex-col justify-between">
                      <p className="whitespace-pre-line leading-relaxed mb-3">{c}</p>
                      <button
                        onClick={() => copyToClipboard(c, 200 + i)}
                        className="self-end py-1.5 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-[11px] font-semibold flex items-center gap-1.5"
                      >
                        {copiedIdx === 200 + i ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedIdx === 200 + i ? 'Copiado' : 'Copiar Copy'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 Guiones de Video */}
              <div className="rounded-2xl border border-purple-500/40 bg-purple-950/20 p-5">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Video className="h-5 w-5 text-purple-400" />
                    3 Guiones de Video Vertical (Reels / TikTok) Listos para Celular
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Diseñados para grabar tú mismo en 10 minutos. Usa la búsqueda libre de Pexels para fondos y la plantilla recomendada de CapCut.
                  </p>
                </div>

                <div className="space-y-6">
                  {anuncios.guionesVideo?.map((g: any, i: number) => (
                    <div key={i} className="rounded-xl border border-slate-800 bg-[#0a0f1d] p-5">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                        <div>
                          <span className="text-[10px] font-bold text-purple-400 uppercase">Guion #{i + 1} ({g.duracion})</span>
                          <h4 className="text-sm font-bold text-white">{g.titulo}</h4>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="rounded-md bg-purple-500/20 text-purple-300 px-2.5 py-1 text-[11px]">
                            {g.plantillaCapCutRecomendada}
                          </span>
                          <a
                            href={`https://www.pexels.com/search/${encodeURIComponent(g.busquedaPexelsGratis || 'lifestyle')}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-400 hover:underline text-[11px]"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Buscar clips Pexels Gratis
                          </a>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        {g.secciones?.map((sec: any, sIdx: number) => (
                          <div key={sIdx} className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                            <span className="text-[10px] font-bold text-indigo-400 block mb-1">{sec.tiempo}</span>
                            <div className="mb-2">
                              <span className="text-[10px] text-slate-400 block font-semibold">Lo que dices:</span>
                              <p className="text-slate-200 italic">"{sec.audio}"</p>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block font-semibold">Lo que muestras:</span>
                              <p className="text-slate-300">{sec.video}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center">
              <Film className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Sin campañas de anuncios generadas</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
                Genera en 5 segundos copys probados de venta y guiones segundo a segundo para grabar Reels y TikToks de tu producto.
              </p>
              <button
                onClick={generarAnuncios}
                disabled={loadingAnuncios}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-indigo-500 transition"
              >
                <Sparkles className="h-4 w-4" />
                Generar Campaña Completa
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal Editor de Post y Regenerador de Foto */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-700 bg-[#0d1424] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">Editar Post (Día {editingPost.dia})</h3>
              </div>
              <button
                onClick={() => setEditingPost(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Cerrar
              </button>
            </div>

            {/* Preview de la Foto actual */}
            <div className="relative h-44 rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
              <img
                src={editingPost.imagenUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setRegeneratingImg(true);
                  const cleanPrompt = editingPost.promptImagen || `${businessData.rubro} commercial photo`;
                  const seed = Math.floor(Math.random() * 999999);
                  const newUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1080&height=1080&model=flux&seed=${seed}&nologo=true`;
                  setEditingPost({ ...editingPost, imagenUrl: newUrl });
                  setTimeout(() => setRegeneratingImg(false), 500);
                }}
                className="absolute bottom-3 right-3 py-1.5 px-3 rounded-lg bg-black/70 hover:bg-black/90 text-white text-xs font-semibold backdrop-blur flex items-center gap-1.5 transition"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${regeneratingImg ? 'animate-spin' : ''}`} />
                <span>Regenerar Foto con Flux</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Título del Post</label>
                <input
                  type="text"
                  value={editingPost.titulo || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, titulo: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Texto / Copy Completo</label>
                <textarea
                  rows={5}
                  value={editingPost.copy || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, copy: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Prompt de la Foto (Inglés - Pollinations AI)</label>
                <input
                  type="text"
                  value={editingPost.promptImagen || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, promptImagen: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="py-2 px-4 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (editingIdx !== null) {
                    const updatedPosts = [...posts];
                    updatedPosts[editingIdx] = editingPost;
                    setPosts(updatedPosts);
                  }
                  setEditingPost(null);
                }}
                className="py-2 px-5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
