'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  CheckCircle2,
  XCircle,
  PlusCircle,
  RefreshCw,
  Building,
  CreditCard,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { PlanType } from '@/lib/credits';

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    userId: '',
    plan: 'pro' as PlanType,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activarTransferencia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoUsuario.userId.trim()) return;

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'activar_transferencia',
          userId: nuevoUsuario.userId.trim(),
          plan: nuevoUsuario.plan,
        }),
      });
      const resJson = await res.json();
      if (resJson.success) {
        alert(`¡Usuario ${nuevoUsuario.userId} activado en Plan ${nuevoUsuario.plan}!`);
        setNuevoUsuario({ userId: '', plan: 'pro' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleEstado = async (userId: string) => {
    try {
      await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_activo',
          userId,
        }),
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Shield className="h-6 w-6 text-indigo-400" />
            Panel Super Administrador ($0 Costo)
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Control de ingresos MRR, activación manual de transferencias bancarias y vigilancia del Free Tier de Google Gemini.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Actualizar Datos</span>
        </button>
      </div>

      {/* Métricas Globales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">MRR Recurrente (CLP)</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            ${(data?.metrics?.mrrCLP || 44900).toLocaleString('es-CL')} CLP
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
            ~${data?.metrics?.mrrUSD || 50} USD mensuales
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Usuarios Activos</span>
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{data?.metrics?.totalUsuariosActivos || 2}</div>
          <span className="text-[11px] text-indigo-400 font-semibold mt-1 block">Membresías al día</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Consumo Gemini Free Tier</span>
            <Activity className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{data?.metrics?.totalGeminiCalls || 14} <span className="text-xs text-slate-500 font-normal">/ 1.500 llamadas/día</span></div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
            100% dentro del límite $0
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Gasto Servidor / BD</span>
            <Shield className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">$0 CLP</div>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">Firebase Spark & Pollinations</span>
        </div>
      </div>

      {/* Formulario de Activación Manual de Transferencia */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <PlusCircle className="h-4 w-4 text-indigo-400" />
          Activar Membresía por Transferencia Bancaria Manual
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Cuando el cliente te envía el comprobante de Banco Estado / Cuenta RUT a tu WhatsApp, digita su ID o email aquí para habilitar su cuenta de inmediato.
        </p>

        <form onSubmit={activarTransferencia} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="ID de Usuario o Email (ej: cliente_cafe@gmail.com)..."
            value={nuevoUsuario.userId}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, userId: e.target.value })}
            className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />

          <select
            value={nuevoUsuario.plan}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, plan: e.target.value as PlanType })}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
          >
            <option value="emprendedor">Plan Emprendedor ($15.000 CLP)</option>
            <option value="pro">Plan Pro ($29.900 CLP)</option>
            <option value="agencia">Plan Agencia ($59.900 CLP)</option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition shrink-0"
          >
            Activar Cuenta
          </button>
        </form>
      </div>

      {/* Lista de Usuarios Registrados */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-indigo-400" />
          Usuarios Registrados en Firestore / Base de Datos
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3 px-3">Usuario / Negocio</th>
                <th className="pb-3 px-3">Plan</th>
                <th className="pb-3 px-3">Uso Posts</th>
                <th className="pb-3 px-3">Uso Closer</th>
                <th className="pb-3 px-3">Método Pago</th>
                <th className="pb-3 px-3">Estado</th>
                <th className="pb-3 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data?.users?.map((u: any) => (
                <tr key={u.userId} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{u.nombre || u.userId}</div>
                    <div className="text-[10px] text-slate-400">{u.email || u.rubro || 'Cliente Pyme'}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="rounded-full bg-indigo-500/20 text-indigo-300 px-2 py-0.5 text-[10px] font-bold uppercase">
                      {u.plan}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-mono">
                    {u.postsUsados} / {u.plan === 'emprendedor' ? 30 : u.plan === 'pro' ? 100 : 300}
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-mono">
                    {u.closerRespuestasUsadas || 0}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-300">
                      {u.origenPago === 'mercadopago' ? (
                        <>
                          <CreditCard className="h-3 w-3 text-indigo-400" /> Mercado Pago
                        </>
                      ) : (
                        <>
                          <Building className="h-3 w-3 text-emerald-400" /> Transferencia
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {u.activo ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-semibold text-[11px]">
                        <XCircle className="h-3.5 w-3.5" /> Pausado
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => toggleEstado(u.userId)}
                      className="py-1 px-3 rounded-lg border border-slate-700 bg-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition"
                    >
                      {u.activo ? 'Pausar' : 'Reactivar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
