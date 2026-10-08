'use client';

import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  Plus,
  Phone,
  DollarSign,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  MoreVertical,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface Prospecto {
  id: string;
  nombre: string;
  telefono: string;
  productoInteres: string;
  valorEstimadoCLP: number;
  etapa: 'nuevo' | 'conversando' | 'cotizado' | 'cerrado' | 'fiel';
  notas: string;
  fechaContacto: string;
}

export default function CrmPipelinePage() {
  const [prospectos, setProspectos] = useState<Prospecto[]>([
    {
      id: 'lead-1',
      nombre: 'Camila Soto Valdés',
      telefono: '56991842110',
      productoInteres: 'Chaqueta Biker Cuero Vegano',
      valorEstimadoCLP: 39990,
      etapa: 'conversando',
      notas: 'Preguntó por talla M en color negro. Interesada en envío a Providencia.',
      fechaContacto: 'Hoy 11:20 hrs',
    },
    {
      id: 'lead-2',
      nombre: 'Ignacio Morales',
      telefono: '56987654321',
      productoInteres: 'Membresía Pro Crecimiento',
      valorEstimadoCLP: 29900,
      etapa: 'cotizado',
      notas: 'Se le envió datos de transferencia Copec Pay. Pendiente comprobante.',
      fechaContacto: 'Ayer 18:45 hrs',
    },
    {
      id: 'lead-3',
      nombre: 'Francisca Araya',
      telefono: '56912345678',
      productoInteres: 'Vestido Gala Noche',
      valorEstimadoCLP: 54900,
      etapa: 'cerrado',
      notas: '¡Pagó por Copec Pay! Despacho programado con Starken.',
      fechaContacto: '05 Oct',
    },
    {
      id: 'lead-4',
      nombre: 'Roberto Fernández',
      telefono: '56944332211',
      productoInteres: 'Pack 2x1 Jeans Flare',
      valorEstimadoCLP: 45000,
      etapa: 'nuevo',
      notas: 'Escribió por anuncio de Instagram pidiendo precios.',
      fechaContacto: 'Hoy 12:05 hrs',
    },
  ]);

  const [modalNuevoLead, setModalNuevoLead] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoTelefono, setNuevoTelefono] = useState('');
  const [nuevoProducto, setNuevoProducto] = useState('');
  const [nuevoValor, setNuevoValor] = useState(29900);
  const [nuevasNotas, setNuevasNotas] = useState('');
  const [notificacion, setNotificacion] = useState('');

  // Columnas Kanban
  const columnas = [
    { id: 'nuevo', titulo: '📥 Nuevos Leads', color: 'border-blue-500/40 bg-blue-950/10 text-blue-400' },
    { id: 'conversando', titulo: '💬 En Conversación', color: 'border-yellow-500/40 bg-yellow-950/10 text-yellow-400' },
    { id: 'cotizado', titulo: '📑 Cotización Enviada', color: 'border-purple-500/40 bg-purple-950/10 text-purple-400' },
    { id: 'cerrado', titulo: '💰 Venta Cerrada', color: 'border-emerald-500/40 bg-emerald-950/10 text-emerald-400' },
    { id: 'fiel', titulo: '⭐ Cliente Recurrente', color: 'border-teal-500/40 bg-teal-950/10 text-teal-400' },
  ];

  // Métricas
  const totalLeads = prospectos.length;
  const valorTotalPipeline = prospectos.reduce((acc, p) => acc + p.valorEstimadoCLP, 0);
  const ventasCerradas = prospectos.filter((p) => p.etapa === 'cerrado' || p.etapa === 'fiel');
  const valorVentasCerradas = ventasCerradas.reduce((acc, p) => acc + p.valorEstimadoCLP, 0);
  const tasaConversion = totalLeads > 0 ? Math.round((ventasCerradas.length / totalLeads) * 100) : 0;

  const moverEtapa = (id: string, direccion: 'siguiente' | 'anterior') => {
    const orden: Prospecto['etapa'][] = ['nuevo', 'conversando', 'cotizado', 'cerrado', 'fiel'];
    setProspectos((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const indiceActual = orden.indexOf(p.etapa);
        const nuevoIndice =
          direccion === 'siguiente'
            ? Math.min(orden.length - 1, indiceActual + 1)
            : Math.max(0, indiceActual - 1);
        return { ...p, etapa: orden[nuevoIndice] };
      })
    );
  };

  const eliminarLead = (id: string) => {
    setProspectos(prospectos.filter((p) => p.id !== id));
    mostrarNotificacion('Prospecto eliminado del embudo.');
  };

  const handleCrearLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre.trim() || !nuevoTelefono.trim()) return;

    const lead: Prospecto = {
      id: `lead-${Date.now()}`,
      nombre: nuevoNombre,
      telefono: nuevoTelefono.replace(/\D/g, ''),
      productoInteres: nuevoProducto || 'Consulta General',
      valorEstimadoCLP: Number(nuevoValor) || 0,
      etapa: 'nuevo',
      notas: nuevasNotas,
      fechaContacto: 'Reciente',
    };

    setProspectos([...prospectos, lead]);
    setNuevoNombre('');
    setNuevoTelefono('');
    setNuevoProducto('');
    setNuevasNotas('');
    setModalNuevoLead(false);
    mostrarNotificacion('¡Nuevo prospecto agregado al embudo de ventas!');
  };

  const mostrarNotificacion = (msg: string) => {
    setNotificacion(msg);
    setTimeout(() => setNotificacion(''), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 mb-2">
            <Users className="h-3.5 w-3.5" />
            <span>GOHIGHLEVEL CRM SUITE • PIPELINE DE VENTAS KANBAN</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Embudo de Ventas & CRM de Clientes
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            No pierdas ninguna venta en WhatsApp. Mueve tus prospectos a lo largo de las etapas del embudo,
            calcula el dinero en juego en $ CLP y abre conversaciones de cierre en 1 solo clic.
          </p>
        </div>

        <button
          onClick={() => setModalNuevoLead(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:brightness-110 active:scale-95 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Registrar Prospecto</span>
        </button>
      </div>

      {notificacion && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-emerald-300 text-sm">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{notificacion}</span>
        </div>
      )}

      {/* Tarjetas de Métricas de Ventas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-4 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Prospectos</span>
          <p className="text-2xl font-black text-white">{totalLeads}</p>
          <span className="text-[10px] text-slate-400">En seguimiento activo</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-4 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pipeline en Juego</span>
          <p className="text-2xl font-black text-indigo-400">${valorTotalPipeline.toLocaleString('es-CL')} CLP</p>
          <span className="text-[10px] text-slate-400">Oportunidades abiertas</span>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Ventas Cobradas</span>
          <p className="text-2xl font-black text-emerald-300">${valorVentasCerradas.toLocaleString('es-CL')} CLP</p>
          <span className="text-[10px] text-emerald-400/80">{ventasCerradas.length} clientes ganados</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-4 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tasa de Cierre</span>
          <p className="text-2xl font-black text-yellow-400">{tasaConversion}%</p>
          <span className="text-[10px] text-slate-400">Efectividad de ventas</span>
        </div>
      </div>

      {/* Tablero Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4 items-start">
        {columnas.map((col) => {
          const leadsEnColumna = prospectos.filter((p) => p.etapa === col.id);
          const totalColumna = leadsEnColumna.reduce((acc, p) => acc + p.valorEstimadoCLP, 0);

          return (
            <div
              key={col.id}
              className="min-w-[240px] rounded-2xl border border-slate-800 bg-[#0a0f1d] p-3 space-y-3 flex flex-col"
            >
              {/* Cabecera Columna */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div>
                  <h3 className="text-xs font-black text-white">{col.titulo}</h3>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    ${totalColumna.toLocaleString('es-CL')} CLP
                  </span>
                </div>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-black text-slate-300">
                  {leadsEnColumna.length}
                </span>
              </div>

              {/* Tarjetas de Prospectos */}
              <div className="space-y-3 flex-1">
                {leadsEnColumna.map((lead) => (
                  <div
                    key={lead.id}
                    className="rounded-xl border border-slate-700/80 bg-slate-900/90 p-3 space-y-2.5 hover:border-indigo-500/60 transition shadow-md group relative"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <h4 className="text-xs font-black text-white leading-snug">{lead.nombre}</h4>
                        <span className="text-[10px] text-slate-400 block">{lead.fechaContacto}</span>
                      </div>
                      <span className="rounded bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-[10px] font-extrabold px-1.5 py-0.5">
                        ${lead.valorEstimadoCLP.toLocaleString('es-CL')}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300">
                      <span className="font-semibold text-slate-400">Interés:</span> {lead.productoInteres}
                    </div>

                    {lead.notas && (
                      <p className="text-[10px] text-slate-400 bg-slate-950 p-2 rounded-lg italic">
                        "{lead.notas}"
                      </p>
                    )}

                    {/* Acciones */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                      {/* Botón WhatsApp */}
                      <a
                        href={`https://wa.me/${lead.telefono}?text=${encodeURIComponent(
                          `¡Hola ${lead.nombre}! Te escribo de parte de nuestro equipo respecto a tu consulta por ${lead.productoInteres}. ¿Cómo te podemos ayudar?`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white px-2 py-1 text-[10px] font-bold transition"
                      >
                        <MessageSquare className="h-3 w-3" />
                        <span>WhatsApp</span>
                      </a>

                      {/* Flechas de Etapa */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moverEtapa(lead.id, 'anterior')}
                          title="Retroceder etapa"
                          className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                        >
                          ←
                        </button>
                        <button
                          onClick={() => moverEtapa(lead.id, 'siguiente')}
                          title="Avanzar etapa"
                          className="p-1 rounded bg-indigo-600 text-white hover:bg-indigo-500"
                        >
                          →
                        </button>
                        <button
                          onClick={() => eliminarLead(lead.id)}
                          title="Eliminar"
                          className="p-1 rounded bg-slate-800 text-rose-400 hover:bg-rose-900/50"
                        >
                          <Trash2 className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {leadsEnColumna.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-800/80 p-4 text-center text-[11px] text-slate-500">
                    Sin prospectos en esta etapa
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nuevo Prospecto */}
      {modalNuevoLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0d1424] p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-400" />
              <span>Registrar Nuevo Prospecto al Embudo</span>
            </h3>

            <form onSubmit={handleCrearLead} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nombre y Apellido</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Marcelo Benítez"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Teléfono WhatsApp</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 56991842110"
                  value={nuevoTelefono}
                  onChange={(e) => setNuevoTelefono(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Producto o Consulta</label>
                <input
                  type="text"
                  placeholder="Ej: Membresía Pro o Producto específico"
                  value={nuevoProducto}
                  onChange={(e) => setNuevoProducto(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Valor Estimado en $ CLP</label>
                <input
                  type="number"
                  value={nuevoValor}
                  onChange={(e) => setNuevoValor(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-yellow-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Notas Rápidas</label>
                <textarea
                  rows={2}
                  placeholder="Detalles de la conversación..."
                  value={nuevasNotas}
                  onChange={(e) => setNuevasNotas(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalNuevoLead(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-md"
                >
                  Guardar en Embudo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
