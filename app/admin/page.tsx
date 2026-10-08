'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Edit3,
  Trash2,
  Send,
  Sparkles,
  Search,
  MessageSquare,
  FileText,
  Copy,
  Check,
  LogOut,
  Save,
  Zap,
  Bot,
  ExternalLink,
  Play,
  Pause,
  Ban,
  Clock,
} from 'lucide-react';
import { PlanType, PLANES } from '@/lib/credits';
import { ClientRecord } from '@/lib/db';

export default function AdminControlPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // Integraciones en vivo: Telegram & Flow.cl
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [flowApiKey, setFlowApiKey] = useState('');
  const [flowSecretKey, setFlowSecretKey] = useState('');
  const [flowEnv, setFlowEnv] = useState<'sandbox' | 'production'>('sandbox');
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [telegramResult, setTelegramResult] = useState<any>(null);
  const [simulandoTelegram, setSimulandoTelegram] = useState(false);
  const [simulacionResult, setSimulacionResult] = useState<any>(null);
  const [testingFlow, setTestingFlow] = useState(false);
  const [flowResult, setFlowResult] = useState<any>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Datos globales
  const [data, setData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('todos');

  // Modales
  const [modalNuevoCliente, setModalNuevoCliente] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClientRecord | null>(null);
  const [modalEstrategia, setModalEstrategia] = useState(false);
  const [generandoEstrategia, setGenerandoEstrategia] = useState(false);
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Formulario nuevo cliente
  const [formNuevo, setFormNuevo] = useState({
    userId: '',
    nombre: '',
    email: '',
    telefono: '+569',
    rubro: '',
    instagram: '@',
    plan: 'pro' as PlanType,
    metodoPago: 'copec_pay',
    montoCLP: 29900,
    notasEquipo: '',
    estrategiaPersonalizada: '',
  });

  // Verificar sesión existente al cargar
  useEffect(() => {
    const savedToken = localStorage.getItem('segar_admin_token') || sessionStorage.getItem('segar_admin_token');
    if (savedToken) {
      verificarYRecuperar(savedToken);
    } else {
      // Intentar auto-login si ya existe cookie JWT de admin
      verificarYRecuperar('segar2026');
    }
  }, []);

  const verificarYRecuperar = async (key: string) => {
    setLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin', {
        headers: {
          'Authorization': `Bearer ${key}`,
          'x-admin-key': key,
        },
      });

      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.settings) {
          if (json.settings.telegramBotToken) setTelegramBotToken(json.settings.telegramBotToken);
          if (json.settings.telegramChatId) setTelegramChatId(json.settings.telegramChatId);
          if (json.settings.flowApiKey) setFlowApiKey(json.settings.flowApiKey);
          if (json.settings.flowSecretKey) setFlowSecretKey(json.settings.flowSecretKey);
          if (json.settings.flowEnv) setFlowEnv(json.settings.flowEnv);
        }
        setIsAuthenticated(true);
        localStorage.setItem('segar_admin_token', key);
      } else {
        localStorage.removeItem('segar_admin_token');
        setIsAuthenticated(false);
        setAuthError('Se requiere autorización de Super Administrador.');
      }
    } catch (err) {
      console.error(err);
      setAuthError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKeyInput.trim()) return;
    verificarYRecuperar(adminKeyInput.trim());
  };

  const handleLogout = async () => {
    localStorage.removeItem('segar_admin_token');
    sessionStorage.removeItem('segar_admin_token');
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setIsAuthenticated(false);
    setAdminKeyInput('');
    setData(null);
  };

  const getAdminToken = () => {
    return localStorage.getItem('segar_admin_token') || 'segar2026';
  };

  const ejecutarAccionAdmin = async (body: any) => {
    const token = getAdminToken();
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-admin-key': token,
        },
        body: JSON.stringify({ ...body, adminKey: token }),
      });
      const resJson = await res.json();
      if (!res.ok) {
        alert(resJson.error || 'Ocurrió un error');
        return null;
      }
      return resJson;
    } catch (err) {
      console.error(err);
      alert('Error ejecutando la acción');
      return null;
    }
  };

  const recargarDatos = async () => {
    const token = getAdminToken();
    await verificarYRecuperar(token);
  };

  const showNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  // 1-CLICK ACTIONS EXCLUSIVAS
  const handleActivarCuenta = async (userId: string, nombre: string) => {
    const result = await ejecutarAccionAdmin({
      action: 'activar_cuenta',
      userId,
    });
    if (result && result.success) {
      showNotification(`✅ Cuenta "${nombre}" activada exitosamente por 30 días.`);
      recargarDatos();
    }
  };

  const handlePausarCuenta = async (userId: string, nombre: string) => {
    const result = await ejecutarAccionAdmin({
      action: 'pausar_cuenta',
      userId,
    });
    if (result && result.success) {
      showNotification(`⏸️ Cuenta "${nombre}" pausada. Alerta enviada a Telegram.`);
      recargarDatos();
    }
  };

  const handleSuspenderCuenta = async (userId: string, nombre: string) => {
    if (!confirm(`¿Estás seguro de suspender/marcar como expirada la cuenta de "${nombre}"? El acceso a /dashboard quedará bloqueado.`)) {
      return;
    }
    const result = await ejecutarAccionAdmin({
      action: 'suspender_cuenta',
      userId,
    });
    if (result && result.success) {
      showNotification(`🚫 Cuenta "${nombre}" suspendida/expirada. Alerta enviada a Telegram.`);
      recargarDatos();
    }
  };

  const handleEliminarCliente = async (userId: string, nombre: string) => {
    if (!confirm(`¿Eliminar permanentemente a "${nombre}"? Esta acción borrará sus datos.`)) {
      return;
    }
    const result = await ejecutarAccionAdmin({
      action: 'eliminar_cliente',
      userId,
    });
    if (result && result.success) {
      showNotification(`🗑️ Cliente "${nombre}" eliminado.`);
      if (clienteSeleccionado?.userId === userId) {
        setClienteSeleccionado(null);
      }
      recargarDatos();
    }
  };

  const handleGuardarConfig = async () => {
    setSavingSettings(true);
    setSettingsSaved(false);
    const token = getAdminToken();
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-admin-key': token,
        },
        body: JSON.stringify({
          action: 'guardar_config',
          settings: {
            telegramBotToken: telegramBotToken.trim(),
            telegramChatId: telegramChatId.trim(),
            flowApiKey: flowApiKey.trim(),
            flowSecretKey: flowSecretKey.trim(),
            flowEnv,
          },
        }),
      });
      const resJson = await res.json();
      if (resJson.success) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 4000);
      } else {
        alert(resJson.error || 'Error al guardar la configuración.');
      }
    } catch (err: any) {
      alert('Error de conexión: ' + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleTestTelegram = async () => {
    setTestingTelegram(true);
    setTelegramResult(null);
    const token = getAdminToken();
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-admin-key': token,
        },
        body: JSON.stringify({
          action: 'probar_telegram',
          token: telegramBotToken.trim(),
          chatId: telegramChatId.trim(),
        }),
      });
      const resJson = await res.json();
      setTelegramResult(resJson);
      if (resJson.success) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 4000);
      }
    } catch (err: any) {
      setTelegramResult({ success: false, error: err.message });
    } finally {
      setTestingTelegram(false);
    }
  };

  const handleSimularVentaTelegram = async () => {
    setSimulandoTelegram(true);
    setSimulacionResult(null);
    const token = getAdminToken();
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-admin-key': token,
        },
        body: JSON.stringify({
          action: 'simular_venta_telegram',
          chatId: telegramChatId.trim(),
        }),
      });
      const resJson = await res.json();
      setSimulacionResult(resJson);
    } catch (err: any) {
      setSimulacionResult({ success: false, message: err.message });
    } finally {
      setSimulandoTelegram(false);
    }
  };

  const handleTestFlow = async () => {
    setTestingFlow(true);
    setFlowResult(null);
    const token = getAdminToken();
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-admin-key': token,
        },
        body: JSON.stringify({
          action: 'probar_flow',
          apiKey: flowApiKey.trim(),
          secretKey: flowSecretKey.trim(),
          env: flowEnv,
        }),
      });
      const resJson = await res.json();
      setFlowResult(resJson);
      if (resJson.success) {
        if (resJson.detectedEnv) {
          setFlowEnv(resJson.detectedEnv);
        }
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 4000);
      }
    } catch (err: any) {
      setFlowResult({ success: false, error: err.message });
    } finally {
      setTestingFlow(false);
    }
  };

  const handleCrearCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await ejecutarAccionAdmin({
      action: 'crear_cliente',
      ...formNuevo,
    });
    if (result && result.success) {
      showNotification(`¡Cliente "${formNuevo.nombre}" registrado exitosamente!`);
      setModalNuevoCliente(false);
      setFormNuevo({
        userId: '',
        nombre: '',
        email: '',
        telefono: '+569',
        rubro: '',
        instagram: '@',
        plan: 'pro',
        metodoPago: 'copec_pay',
        montoCLP: 29900,
        notasEquipo: '',
        estrategiaPersonalizada: '',
      });
      recargarDatos();
    }
  };

  const handleGuardarCliente = async () => {
    if (!clienteSeleccionado) return;
    const result = await ejecutarAccionAdmin({
      action: 'modificar_cliente',
      userId: clienteSeleccionado.userId,
      updates: clienteSeleccionado,
    });
    if (result && result.success) {
      showNotification('¡Ficha del cliente actualizada exitosamente!');
      recargarDatos();
    }
  };

  const handleAjustarCreditos = async (userId: string, postsDelta: number, closerDelta: number) => {
    const result = await ejecutarAccionAdmin({
      action: 'ajustar_creditos',
      userId,
      postsDelta,
      closerDelta,
    });
    if (result && result.success) {
      if (clienteSeleccionado && clienteSeleccionado.userId === userId) {
        setClienteSeleccionado(result.client);
      }
      recargarDatos();
    }
  };

  const handleGenerarEstrategiaIA = async () => {
    if (!clienteSeleccionado) return;
    setGenerandoEstrategia(true);
    const result = await ejecutarAccionAdmin({
      action: 'generar_estrategia_ia',
      userId: clienteSeleccionado.userId,
      nombre: clienteSeleccionado.nombre,
      rubro: clienteSeleccionado.rubro,
      focoVentas: 'Venta de temporada y captación de clientes de ticket medio/alto',
      tono: 'Canchero, confiable y con fuerte llamado a la acción comercial',
    });
    setGenerandoEstrategia(false);
    if (result && result.success) {
      setClienteSeleccionado({
        ...clienteSeleccionado,
        estrategiaPersonalizada: result.estrategia,
      });
      showNotification('¡Estrategia VIP generada con Gemini 2.0 Flash!');
      recargarDatos();
    }
  };

  // Filtrado de usuarios
  const usuarios = data?.users || [];
  const usuariosFiltrados = usuarios.filter((u: ClientRecord) => {
    const matchSearch =
      (u.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.rubro || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.telefono || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchPlan = planFilter === 'todos' || u.plan === planFilter;
    return matchSearch && matchPlan;
  });

  // PANTALLA DE ACCESO PROTEGIDO
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col justify-center items-center p-6 text-white relative">
        <div className="max-w-md w-full rounded-3xl border border-indigo-500/30 bg-[#0d1424] p-8 shadow-2xl text-center space-y-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Shield className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-xl font-black">PANEL SUPER ADMINISTRADOR</h1>
            <p className="text-xs text-slate-400 mt-1">Acceso restringido únicamente para personal directivo de Segar AI Marketing</p>
          </div>

          {authError && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-950/40 border border-rose-500/30 p-3 text-xs text-rose-300 text-left">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Clave Maestra de Administrador</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={adminKeyInput}
                  onChange={(e) => setAdminKeyInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                <Lock className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 active:scale-95 transition disabled:opacity-50"
            >
              {loading ? 'Verificando credenciales...' : 'Desbloquear Panel Administrativo'}
            </button>
          </form>

          <Link href="/" className="inline-block text-xs text-slate-400 hover:text-white transition">
            ← Volver a la Landing Page
          </Link>
        </div>
      </div>
    );
  }

  // PANTALLA PRINCIPAL DEL SUPER PANEL ADMINISTRATIVO
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 p-4 sm:p-8 space-y-8">
      {/* Notificación flotante de acción rápida */}
      {actionSuccessMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 p-4 text-xs font-bold text-emerald-300 shadow-2xl backdrop-blur-xl animate-bounce">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Header Superior del Super Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-400 mb-2 border border-indigo-500/20">
            <Shield className="h-3.5 w-3.5" />
            <span>CENTRO DE MANDO DIRECTIVO GLOBAL (/admin)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <span>Super Panel Administrativo</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Control integral de clientes, activación de membresías Webpay/Copec Pay con 1 clic, historial de transacciones y centro de integraciones en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalNuevoCliente(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:opacity-95 transition"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ Registrar Nuevo Cliente</span>
          </button>

          <button
            onClick={recargarDatos}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refrescar</span>
          </button>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600/30 border border-indigo-500/30 px-3.5 py-2.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-600 hover:text-white transition"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Ver Modo Cliente</span>
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 px-3.5 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-900/50 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Métricas Maestras de Facturación y Clientes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">MRR Facturado</span>
            <DollarSign className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            ${(data?.metrics?.mrrCLP || 0).toLocaleString('es-CL')} CLP
          </div>
          <span className="text-[11px] text-emerald-400 font-bold mt-1 block">
            ~${data?.metrics?.mrrUSD || 0} USD recurrente mensual
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Membresías Activas</span>
            <Users className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {data?.metrics?.totalUsuariosActivos || 0}
            <span className="text-xs text-slate-500 font-normal"> / {data?.metrics?.totalClientes || 0} registrados</span>
          </div>
          <span className="text-[11px] text-indigo-400 font-semibold mt-1 block">
            Clientes con acceso habilitado a /dashboard
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Margen de Ganancia</span>
            <TrendingUp className="h-5 w-5 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400">100% Margen</div>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">
            Costo Servidor: $0 CLP (Free Tier Vercel)
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Llamadas Gemini 2.0</span>
            <Activity className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {data?.metrics?.geminiFreeTierRestante || 1500}
            <span className="text-xs text-slate-500 font-normal"> / 1.500 gratis/día</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold mt-1 block">
            Capacidad disponible para hoy
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TABLA PRINCIPAL: USUARIOS Y CONTROL DE ESTADOS CON 1 CLIC */}
      {/* ========================================================= */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-400" />
              <span>Gestión de Clientes y Estado de Suscripciones</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Controla con un solo clic el acceso de los clientes al panel privado (/dashboard).
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar cliente, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="todos">Todos los Planes</option>
              <option value="emprendedor">Emprendedor ($15.000)</option>
              <option value="pro">Pro ($29.900)</option>
              <option value="agencia">Agencia ($59.900)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3 px-3">Cliente / Negocio</th>
                <th className="pb-3 px-3">Plan Contratado</th>
                <th className="pb-3 px-3">Estado Suscripción</th>
                <th className="pb-3 px-3">Vigencia / Vencimiento</th>
                <th className="pb-3 px-3">Consumo Posts</th>
                <th className="pb-3 px-3 text-right">Acciones Directas (1 Clic)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No se encontraron clientes registrados con ese criterio.
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((u: ClientRecord) => {
                  const isExpired = u.fechaExpiracion ? new Date(u.fechaExpiracion) < new Date() : false;
                  const isActivo = u.activo && !isExpired;

                  return (
                    <tr key={u.userId} className="hover:bg-slate-800/40 transition">
                      {/* Cliente */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{u.nombre || u.userId}</span>
                          {u.role === 'admin' && (
                            <span className="rounded bg-purple-500/20 text-purple-300 px-1.5 py-0.2 text-[9px] font-black uppercase">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-slate-300">{u.email || 'Sin email'}</span>
                          {u.telefono && <span className="text-emerald-400 font-mono">• {u.telefono}</span>}
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="py-3 px-3">
                        <span className="rounded-full bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 text-[10px] font-black uppercase">
                          {u.plan}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5 font-mono">
                          {u.plan === 'emprendedor' ? '$15.000 CLP' : u.plan === 'pro' ? '$29.900 CLP' : '$59.900 CLP'}
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="py-3 px-3">
                        {isActivo ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold">
                            <CheckCircle2 className="h-3 w-3" /> Activo (Al día)
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2.5 py-0.5 text-[10px] font-bold">
                            <XCircle className="h-3 w-3" /> Expirado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold">
                            <Clock className="h-3 w-3" /> Inactivo / Pendiente
                          </span>
                        )}
                      </td>

                      {/* Vigencia */}
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-300">
                        {u.fechaExpiracion ? (
                          <span>{new Date(u.fechaExpiracion).toLocaleDateString('es-CL')}</span>
                        ) : (
                          <span className="text-slate-500">Sin fecha</span>
                        )}
                      </td>

                      {/* Consumo */}
                      <td className="py-3 px-3 font-mono text-slate-300">
                        {u.postsUsados} / {u.plan === 'emprendedor' ? 30 : u.plan === 'pro' ? 100 : 300}
                      </td>

                      {/* Botones de Acción 1-Clic */}
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* 1. Activar (+30 Días) */}
                          <button
                            onClick={() => handleActivarCuenta(u.userId, u.nombre || u.userId)}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600 hover:text-white px-2.5 py-1 text-[11px] font-bold transition border border-emerald-500/30"
                            title="Activar cuenta por 30 días"
                          >
                            <Play className="h-3 w-3" />
                            <span>Activar (+30d)</span>
                          </button>

                          {/* 2. Pausar */}
                          {isActivo && (
                            <button
                              onClick={() => handlePausarCuenta(u.userId, u.nombre || u.userId)}
                              className="inline-flex items-center gap-1 rounded-lg bg-amber-600/30 text-amber-300 hover:bg-amber-600 hover:text-white px-2.5 py-1 text-[11px] font-bold transition border border-amber-500/30"
                              title="Pausar cuenta y bloquear acceso"
                            >
                              <Pause className="h-3 w-3" />
                              <span>Pausar</span>
                            </button>
                          )}

                          {/* 3. Suspender / Expirar */}
                          <button
                            onClick={() => handleSuspenderCuenta(u.userId, u.nombre || u.userId)}
                            className="p-1.5 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white transition"
                            title="Suspender cuenta / Marcar como expirada"
                          >
                            <Ban className="h-3.5 w-3.5" />
                          </button>

                          {/* 4. Editar Ficha Completa */}
                          <button
                            onClick={() => setClienteSeleccionado(u)}
                            className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white transition"
                            title="Ver ficha, créditos y estrategia"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>

                          {/* 5. Eliminar */}
                          <button
                            onClick={() => handleEliminarCliente(u.userId, u.nombre || u.userId)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition"
                            title="Eliminar cliente"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* HISTORIAL DE TRANSACCIONES DE FLOW.CL Y COPEC PAY        */}
      {/* ========================================================= */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-400" />
              <span>Historial de Transacciones (Flow.cl Webpay & Copec Pay)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Registro inmutable de cobros exitosos procesados a través de la pasarela Flow o transferencia directa.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {data?.transactions?.length || 0} transacciones registradas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3 px-3">ID Transacción</th>
                <th className="pb-3 px-3">Cliente / ID Usuario</th>
                <th className="pb-3 px-3">Plan</th>
                <th className="pb-3 px-3">Monto en $ CLP</th>
                <th className="pb-3 px-3">Método</th>
                <th className="pb-3 px-3">Fecha y Hora</th>
                <th className="pb-3 px-3 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {(data?.transactions || []).length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Aún no se han registrado transacciones de pago.
                  </td>
                </tr>
              ) : (
                [...(data?.transactions || [])].reverse().map((trx: any) => (
                  <tr key={trx.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-mono text-indigo-300 font-bold">
                      {trx.id}
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      {trx.userId}
                    </td>
                    <td className="py-3 px-3 uppercase font-bold text-indigo-400">
                      {trx.plan}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                      ${(trx.montoCLP || 0).toLocaleString('es-CL')} CLP
                    </td>
                    <td className="py-3 px-3">
                      {trx.metodo === 'flow_webpay' ? (
                        <span className="text-indigo-400 font-bold">💳 Flow / Webpay</span>
                      ) : trx.metodo === 'copec_pay' ? (
                        <span className="text-amber-400 font-bold">⛽ Copec Pay</span>
                      ) : (
                        <span className="text-emerald-400 font-bold">🏦 Transferencia</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                      {trx.fecha ? new Date(trx.fecha).toLocaleString('es-CL') : 'Reciente'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                        <CheckCircle2 className="h-3 w-3" /> Aprobado
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* CENTRO DE INTEGRACIONES: TELEGRAM BOT & FLOW.CL          */}
      {/* ========================================================= */}
      <div className="rounded-3xl border border-indigo-500/30 bg-[#0d1424] p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-400 mb-1 border border-indigo-500/30">
              <Zap className="h-3.5 w-3.5" />
              <span>CANALES OPERATIVOS EN VIVO</span>
            </div>
            <h3 className="text-lg font-black text-white">
              Centro de Integraciones: Telegram Bot & Flow.cl
            </h3>
            <p className="text-xs text-slate-400">
              Configura y valida en tiempo real las alertas a tu celular y la pasarela de pagos Webpay Plus.
            </p>
          </div>

          <button
            onClick={handleGuardarConfig}
            disabled={savingSettings}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 active:scale-95 transition"
          >
            <Save className="h-4 w-4" />
            <span>{savingSettings ? 'Guardando...' : settingsSaved ? '¡Credenciales Guardadas!' : 'Guardar Credenciales'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card Telegram */}
          <div className="rounded-2xl border border-slate-800 bg-[#090f1d] p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-black text-purple-400">
                  <Bot className="h-4 w-4" />
                  <span>1. BOT DE TELEGRAM (Alertas y Aprobaciones Móviles)</span>
                </span>
                <span className={`h-2.5 w-2.5 rounded-full ${telegramBotToken ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Telegram Bot Token (HTTP API)</label>
                <input
                  type="text"
                  placeholder="Ej: 8918876529:AAHgfR7usXrN5ulJwI1pXVJmY1SRnuxUpWk"
                  value={telegramBotToken}
                  onChange={(e) => setTelegramBotToken(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
                />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] text-slate-500">Obtenlo en 30 segundos con @BotFather</p>
                  <a
                    href="https://t.me/BotFather"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-purple-400 hover:text-purple-300 font-bold"
                  >
                    <span>Abrir @BotFather</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Tu Chat ID Personal de Telegram</label>
                <input
                  type="text"
                  placeholder="Ej: 8948607426"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
                />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] text-slate-500">Tu ID numérico personal</p>
                  <a
                    href="https://t.me/userinfobot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-purple-400 hover:text-purple-300 font-bold"
                  >
                    <span>Abrir @userinfobot</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {telegramResult && (
                <div className={`rounded-xl border p-3 text-xs ${
                  telegramResult.success
                    ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
                    : 'border-rose-500/30 bg-rose-950/40 text-rose-300'
                }`}>
                  <p className="font-bold">{telegramResult.success ? '✅ ' + telegramResult.message : '❌ ' + telegramResult.error}</p>
                </div>
              )}

              {simulacionResult && (
                <div className={`rounded-xl border p-3 text-xs ${
                  simulacionResult.success
                    ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
                    : 'border-rose-500/30 bg-rose-950/40 text-rose-300'
                }`}>
                  <p className="font-bold">{simulacionResult.success ? '✅ ' + simulacionResult.message : '❌ ' + (simulacionResult.error || simulacionResult.message)}</p>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleTestTelegram}
                disabled={testingTelegram}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 py-2.5 text-xs font-bold text-white shadow-md transition disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{testingTelegram ? 'Validando conexión...' : '📲 Enviar Mensaje de Prueba a mi Celular'}</span>
              </button>

              <button
                onClick={handleSimularVentaTelegram}
                disabled={simulandoTelegram || !telegramChatId}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-purple-500/30 py-2 text-xs font-semibold text-purple-300 transition disabled:opacity-40"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{simulandoTelegram ? 'Enviando alerta simulada...' : '🔔 Probar Alerta de Venta Simulada'}</span>
              </button>
            </div>
          </div>

          {/* Card Flow.cl */}
          <div className="rounded-2xl border border-slate-800 bg-[#090f1d] p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-black text-indigo-400">
                  <CreditCard className="h-4 w-4" />
                  <span>2. PASARELA FLOW.CL (Webpay Plus, Débito y Tarjetas)</span>
                </span>
                <span className={`h-2.5 w-2.5 rounded-full ${flowApiKey ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Flow API Key</label>
                <input
                  type="text"
                  placeholder="Ej: 3D6A1234-5678-..."
                  value={flowApiKey}
                  onChange={(e) => setFlowApiKey(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Flow Secret Key</label>
                <input
                  type="password"
                  placeholder="••••••••••••••••••••••••"
                  value={flowSecretKey}
                  onChange={(e) => setFlowSecretKey(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Entorno de Flow</label>
                  <select
                    value={flowEnv}
                    onChange={(e) => setFlowEnv(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="production">Producción (Cobro Real Webpay)</option>
                    <option value="sandbox">Sandbox (Pruebas sin cobro)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Respaldo Automático</label>
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-2 text-[10px] text-emerald-300 font-bold">
                    🛡️ Copec Pay Activo como respaldo
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3 text-[11px] text-slate-300 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-indigo-300">💡 Claves de API de Flow:</p>
                  <a
                    href="https://www.flow.cl/app/web/misdatos.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 font-bold"
                  >
                    <span>Ir a Flow.cl</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <p className="text-[10px] text-slate-400">
                  Obtén tu API Key y Secret Key desde <strong>flow.cl ➔ Mis Datos ➔ Claves de API</strong>. Selecciona Producción si tu cuenta es comercial estándar.
                </p>
              </div>

              {flowResult && (
                <div className={`rounded-xl border p-3 text-xs ${
                  flowResult.success
                    ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
                    : 'border-rose-500/30 bg-rose-950/40 text-rose-300'
                }`}>
                  <p className="font-bold">{flowResult.success ? '✅ ' + flowResult.message : '❌ ' + flowResult.error}</p>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleTestFlow}
                disabled={testingFlow}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-bold text-white shadow-md transition disabled:opacity-50"
              >
                <CreditCard className="h-3.5 w-3.5" />
                <span>{testingFlow ? 'Validando con Flow.cl...' : '💳 Probar Credenciales con Flow.cl'}</span>
              </button>

              <a
                href="/checkout/success?plan=pro&flow_mock=true"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-indigo-500/30 py-2 text-xs font-semibold text-indigo-300 transition block text-center"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>⚡ Probar Flujo de Pago Webpay (Simulado)</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL / FICHA 360° DE CLIENTE Y ESTRATEGIA VIP            */}
      {/* ========================================================= */}
      {clienteSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl border border-slate-700 bg-[#0d1424] p-6 sm:p-8 shadow-2xl my-8">
            <button
              onClick={() => setClienteSeleccionado(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">
                  Ficha de Cliente #{clienteSeleccionado.userId}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {clienteSeleccionado.nombre || clienteSeleccionado.userId}
                </h3>
                <p className="text-xs text-slate-400">
                  {clienteSeleccionado.rubro || 'Comercio'} • {clienteSeleccionado.email || 'Sin email'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleActivarCuenta(clienteSeleccionado.userId, clienteSeleccionado.nombre || clienteSeleccionado.userId)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Activar (+30d)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePausarCuenta(clienteSeleccionado.userId, clienteSeleccionado.nombre || clienteSeleccionado.userId)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600/30 text-amber-300 border border-amber-500/30 px-3 py-2 text-xs font-bold hover:bg-amber-600 hover:text-white transition"
                >
                  <Pause className="h-3.5 w-3.5" />
                  <span>Pausar</span>
                </button>
              </div>
            </div>

            {/* Ajustes de Créditos */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <span className="text-xs text-slate-400 block mb-1">Posts Utilizados</span>
                  <div className="text-xl font-bold text-white font-mono">{clienteSeleccionado.postsUsados || 0}</div>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => handleAjustarCreditos(clienteSeleccionado.userId, 10, 0)}
                      className="rounded-lg bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:text-white"
                    >
                      +10 Posts
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAjustarCreditos(clienteSeleccionado.userId, -10, 0)}
                      className="rounded-lg bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:text-white"
                    >
                      -10 Posts
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <span className="text-xs text-slate-400 block mb-1">Respuestas Closer IA</span>
                  <div className="text-xl font-bold text-white font-mono">{clienteSeleccionado.closerRespuestasUsadas || 0}</div>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => handleAjustarCreditos(clienteSeleccionado.userId, 0, 100)}
                      className="rounded-lg bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:text-white"
                    >
                      +100 Tokens
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAjustarCreditos(clienteSeleccionado.userId, 0, -100)}
                      className="rounded-lg bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:text-white"
                    >
                      -100 Tokens
                    </button>
                  </div>
                </div>
              </div>

              {/* Generador de Estrategia Maestra con Gemini */}
              <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" />
                    Estrategia Maestra de 30 Días con Gemini 2.0
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerarEstrategiaIA}
                    disabled={generandoEstrategia}
                    className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md hover:brightness-110 disabled:opacity-50"
                  >
                    {generandoEstrategia ? 'Generando con Gemini...' : '⚡ Generar Estrategia VIP'}
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={clienteSeleccionado.estrategiaPersonalizada || ''}
                  onChange={(e) => setClienteSeleccionado({ ...clienteSeleccionado, estrategiaPersonalizada: e.target.value })}
                  placeholder="Aquí aparecerá el plan estratégico de 30 días generado por Gemini..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs text-white font-mono leading-relaxed focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Notas del equipo */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notas Internas</label>
                <textarea
                  rows={2}
                  value={clienteSeleccionado.notasEquipo || ''}
                  onChange={(e) => setClienteSeleccionado({ ...clienteSeleccionado, notasEquipo: e.target.value })}
                  placeholder="Anotaciones de soporte, acuerdos comerciales, etc."
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setClienteSeleccionado(null)}
                  className="rounded-xl px-4 py-2.5 text-xs text-slate-400 hover:text-white"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={handleGuardarCliente}
                  className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL REGISTRAR NUEVO CLIENTE                             */}
      {/* ========================================================= */}
      {modalNuevoCliente && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-700 bg-[#0d1424] p-6 shadow-2xl my-8">
            <button
              onClick={() => setModalNuevoCliente(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <PlusCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Registrar Nuevo Cliente VIP</h3>
                <p className="text-xs text-slate-400">Activación directa de membresía para transferencias o ventas manuales</p>
              </div>
            </div>

            <form onSubmit={handleCrearCliente} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Nombre Comercial del Negocio</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Joyería Aurora Santiago"
                  value={formNuevo.nombre}
                  onChange={(e) => {
                    const nombre = e.target.value;
                    const autoId = nombre.toLowerCase().replace(/[^a-z0-9]/g, '_');
                    setFormNuevo({ ...formNuevo, nombre, userId: autoId });
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">ID Único de Acceso</label>
                  <input
                    type="text"
                    required
                    placeholder="joyeria_aurora"
                    value={formNuevo.userId}
                    onChange={(e) => setFormNuevo({ ...formNuevo, userId: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-indigo-300 font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Rubro</label>
                  <input
                    type="text"
                    placeholder="Joyas, Moda, Gourmet..."
                    value={formNuevo.rubro}
                    onChange={(e) => setFormNuevo({ ...formNuevo, rubro: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    placeholder="contacto@joyeria.cl"
                    value={formNuevo.email}
                    onChange={(e) => setFormNuevo({ ...formNuevo, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    placeholder="+569..."
                    value={formNuevo.telefono}
                    onChange={(e) => setFormNuevo({ ...formNuevo, telefono: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Plan</label>
                  <select
                    value={formNuevo.plan}
                    onChange={(e) => {
                      const p = e.target.value as PlanType;
                      const monto = p === 'emprendedor' ? 15000 : p === 'pro' ? 29900 : 59900;
                      setFormNuevo({ ...formNuevo, plan: p, montoCLP: monto });
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-bold focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="emprendedor">Plan Emprendedor ($15.000)</option>
                    <option value="pro">Plan Pro ($29.900)</option>
                    <option value="agencia">Plan Agencia ($59.900)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Método de Pago</label>
                  <select
                    value={formNuevo.metodoPago}
                    onChange={(e) => setFormNuevo({ ...formNuevo, metodoPago: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="copec_pay">Copec Pay (Transferencia)</option>
                    <option value="flow_webpay">Flow.cl (Webpay / Tarjeta)</option>
                    <option value="transferencia">Banco Estado / Cuenta RUT</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalNuevoCliente(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition"
                >
                  Crear y Activar Membresía
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
