'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Sparkles,
  Plus,
  Clock,
  Instagram,
  Facebook,
  Share2,
  Download,
  CheckCircle,
  Move,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  Trash2,
  Zap,
} from 'lucide-react';

interface PostProgramado {
  id: string;
  dia: number; // día del mes (1-31)
  hora: string;
  titulo: string;
  redSocial: 'instagram' | 'facebook' | 'tiktok' | 'whatsapp';
  estado: 'programado' | 'publicado' | 'borrador';
  imagenUrl: string;
  picoAudiencia?: string;
}

export default function CalendarioMarketingPage() {
  const [mesActual, setMesActual] = useState('Octubre 2026');
  const [filtroRed, setFiltroRed] = useState<'todas' | 'instagram' | 'facebook' | 'tiktok' | 'whatsapp'>('todas');
  const [modalNuevoPost, setModalNuevoPost] = useState(false);
  const [diaSeleccionado, setDiaSeleccionado] = useState<number>(7);
  const [notificacion, setNotificacion] = useState('');

  // Drag and drop state
  const [draggedPostId, setDraggedPostId] = useState<string | null>(null);

  const [posts, setPosts] = useState<PostProgramado[]>([
    {
      id: 'p-1',
      dia: 5,
      hora: '13:30',
      titulo: '🔥 3 Errores al comprar zapatillas este invierno',
      redSocial: 'instagram',
      estado: 'publicado',
      imagenUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    },
    {
      id: 'p-2',
      dia: 7,
      hora: '20:15',
      titulo: '💥 OFERTA 24H: 30% OFF en toda la tienda',
      redSocial: 'instagram',
      estado: 'programado',
      imagenUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
      picoAudiencia: 'Pico de Tráfico ⚡',
    },
    {
      id: 'p-3',
      dia: 9,
      hora: '11:00',
      titulo: '🎥 Video Reel: Cómo limpiar tus zapatillas en 3 pasos',
      redSocial: 'tiktok',
      estado: 'programado',
      imagenUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80',
      picoAudiencia: 'Alta Viralidad 🚀',
    },
    {
      id: 'p-4',
      dia: 12,
      hora: '19:00',
      titulo: '👔 Testimonio Cliente Feliz de Santiago',
      redSocial: 'facebook',
      estado: 'programado',
      imagenUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80',
    },
    {
      id: 'p-5',
      dia: 15,
      hora: '14:00',
      titulo: '💬 Catálogo Nuevo en WhatsApp Business',
      redSocial: 'whatsapp',
      estado: 'borrador',
      imagenUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80',
    },
    {
      id: 'p-6',
      dia: 19,
      hora: '20:30',
      titulo: '✨ Carrusel: 5 Combinaciones de Outfit para Fin de Semana',
      redSocial: 'instagram',
      estado: 'programado',
      imagenUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80',
      picoAudiencia: 'Pico de Tráfico ⚡',
    },
  ]);

  // Formulario nuevo post
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevaHora, setNuevaHora] = useState('19:30');
  const [nuevaRed, setNuevaRed] = useState<'instagram' | 'facebook' | 'tiktok' | 'whatsapp'>('instagram');

  const diasDelMes = Array.from({ length: 31 }, (_, i) => i + 1);

  const postsFiltrados = posts.filter((p) => {
    if (filtroRed === 'todas') return true;
    return p.redSocial === filtroRed;
  });

  // Manejo de Drag and Drop
  const handleDragStart = (e: React.DragEvent, postId: string) => {
    setDraggedPostId(postId);
    e.dataTransfer.setData('text/plain', postId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetDia: number) => {
    e.preventDefault();
    if (!draggedPostId) return;

    setPosts((prev) =>
      prev.map((p) => (p.id === draggedPostId ? { ...p, dia: targetDia } : p))
    );
    setDraggedPostId(null);
    mostrarAlerta(`¡Post reprogramado con éxito para el día ${targetDia} de ${mesActual}!`);
  };

  const mostrarAlerta = (msg: string) => {
    setNotificacion(msg);
    setTimeout(() => setNotificacion(''), 4000);
  };

  const agregarNuevoPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTitulo.trim()) return;

    const nuevo: PostProgramado = {
      id: `p-${Date.now()}`,
      dia: diaSeleccionado,
      hora: nuevaHora,
      titulo: nuevoTitulo,
      redSocial: nuevaRed,
      estado: 'programado',
      imagenUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
    };

    setPosts([...posts, nuevo]);
    setNuevoTitulo('');
    setModalNuevoPost(false);
    mostrarAlerta('¡Publicación agendada en el calendario con éxito!');
  };

  const eliminarPost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
    mostrarAlerta('Publicación eliminada del calendario.');
  };

  const exportarCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Día,Hora,Red Social,Estado,Título']
        .concat(
          posts.map(
            (p) => `${p.dia} de Octubre,${p.hora},${p.redSocial},${p.estado},"${p.titulo.replace(/"/g, '""')}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `calendario-segar-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    mostrarAlerta('¡Calendario exportado a CSV compatible con Meta Business Suite!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-400 mb-2">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>CALENDAR SUITE PRO • METRICOOL & BUFFER ENGINE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Calendario Visual Drag & Drop
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Gestiona todo el mes de contenido en una vista panorámica. Arrastra y suelta publicaciones entre días,
            visualiza las horas de mayor pico de audiencia y exporta directamente a Meta Business Suite.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportarCSV}
            className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-xs font-bold text-slate-200 transition"
          >
            <Download className="h-4 w-4" />
            <span>Exportar CSV (Meta)</span>
          </button>

          <button
            onClick={() => {
              setDiaSeleccionado(new Date().getDate());
              setModalNuevoPost(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-teal-600/30 hover:brightness-110 active:scale-95 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Agendar Post</span>
          </button>
        </div>
      </div>

      {notificacion && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-emerald-300 text-sm">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{notificacion}</span>
        </div>
      )}

      {/* Top Bar: Mes Selector & Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-[#0d1424] p-4">
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-black text-white tracking-wide">{mesActual}</span>
          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <ChevronRight className="h-4 w-4" />
          </button>
          <span className="rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2.5 py-0.5 text-[11px] font-bold">
            {posts.length} Posts Programados
          </span>
        </div>

        {/* Filtros por canal */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFiltroRed('todas')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              filtroRed === 'todas' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFiltroRed('instagram')}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              filtroRed === 'instagram' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Instagram className="h-3 w-3" />
            <span>Instagram</span>
          </button>
          <button
            onClick={() => setFiltroRed('facebook')}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              filtroRed === 'facebook' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Facebook className="h-3 w-3" />
            <span>Facebook</span>
          </button>
          <button
            onClick={() => setFiltroRed('tiktok')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              filtroRed === 'tiktok' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            TikTok
          </button>
          <button
            onClick={() => setFiltroRed('whatsapp')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              filtroRed === 'whatsapp' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            WhatsApp Status
          </button>
        </div>
      </div>

      {/* Grid del Calendario Mensual */}
      <div className="rounded-3xl border border-slate-800 bg-[#0a0f1d] p-4 overflow-hidden shadow-2xl">
        {/* Cabecera días de la semana */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3">
          <span>Lun</span>
          <span>Mar</span>
          <span>Mié</span>
          <span>Jue</span>
          <span>Vie</span>
          <span className="text-indigo-400">Sáb</span>
          <span className="text-pink-400">Dom</span>
        </div>

        {/* Cuadrícula de 31 días */}
        <div className="grid grid-cols-7 gap-2">
          {diasDelMes.map((dia) => {
            const postsEnEsteDia = postsFiltrados.filter((p) => p.dia === dia);
            const esHoy = dia === 7;

            return (
              <div
                key={dia}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, dia)}
                className={`min-h-[125px] rounded-2xl border p-2 flex flex-col justify-between transition-all ${
                  esHoy
                    ? 'border-indigo-500/60 bg-indigo-950/20 shadow-lg shadow-indigo-500/10'
                    : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                {/* Cabecera del día */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black ${
                      esHoy
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400'
                    }`}
                  >
                    {dia}
                  </span>

                  <button
                    onClick={() => {
                      setDiaSeleccionado(dia);
                      setModalNuevoPost(true);
                    }}
                    className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-800 transition"
                    title="Programar post este día"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                {/* Posts en el día */}
                <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[90px]">
                  {postsEnEsteDia.map((post) => (
                    <div
                      key={post.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, post.id)}
                      className="cursor-grab active:cursor-grabbing rounded-lg border border-slate-700/80 bg-slate-950/90 p-1.5 text-[10px] space-y-1 hover:border-indigo-500 transition shadow-sm group relative"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="flex items-center gap-1 font-bold text-slate-300">
                          <Clock className="h-2.5 w-2.5 text-indigo-400" />
                          <span>{post.hora}</span>
                        </span>
                        <span
                          className={`rounded px-1 text-[8px] font-black uppercase ${
                            post.redSocial === 'instagram'
                              ? 'bg-pink-600/30 text-pink-300'
                              : post.redSocial === 'facebook'
                              ? 'bg-blue-600/30 text-blue-300'
                              : post.redSocial === 'tiktok'
                              ? 'bg-purple-600/30 text-purple-300'
                              : 'bg-emerald-600/30 text-emerald-300'
                          }`}
                        >
                          {post.redSocial}
                        </span>
                      </div>

                      <p className="font-semibold text-slate-200 line-clamp-1 leading-snug">
                        {post.titulo}
                      </p>

                      {post.picoAudiencia && (
                        <span className="inline-block rounded bg-yellow-500/20 text-yellow-300 text-[8px] font-extrabold px-1">
                          {post.picoAudiencia}
                        </span>
                      )}

                      {/* Botón flotante eliminar */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          eliminarPost(post.id);
                        }}
                        className="hidden group-hover:block absolute top-1 right-1 p-0.5 rounded bg-rose-950/80 text-rose-400 hover:text-white"
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal para agendar nuevo post */}
      {modalNuevoPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0d1424] p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-teal-400" />
              <span>Agendar Publicación para el Día {diaSeleccionado}</span>
            </h3>

            <form onSubmit={agregarNuevoPost} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Título o Gancho del Post</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 🔥 Lanzamiento Nueva Colección con 30% OFF"
                  value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Hora de Publicación</label>
                  <input
                    type="time"
                    value={nuevaHora}
                    onChange={(e) => setNuevaHora(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Red Social Destino</label>
                  <select
                    value={nuevaRed}
                    onChange={(e) => setNuevaRed(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white"
                  >
                    <option value="instagram">Instagram Feed / Reels</option>
                    <option value="facebook">Facebook Fanpage</option>
                    <option value="tiktok">TikTok Video</option>
                    <option value="whatsapp">Estados de WhatsApp</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalNuevoPost(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-500 shadow-md"
                >
                  Confirmar y Agendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
