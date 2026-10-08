import fs from 'fs';
import path from 'path';
import os from 'os';
import { PlanType, UserCredits, PLANES } from './credits';

// En Vercel / Linux Serverless (Amazon Linux 2), process.cwd() es de solo lectura.
// os.tmpdir() resuelve a /tmp en Linux y al directorio temporal válido en cualquier SO.
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const LOCAL_DB_PATH = isServerless
  ? path.join(os.tmpdir(), '.local-db.json')
  : path.join(process.cwd(), '.local-db.json');

// Memoria caché para persistencia dentro de la vida útil del worker serverless
let memoryCacheDb: LocalDatabase | null = null;

export interface ClientRecord extends UserCredits {
  email?: string;
  nombre?: string;
  passwordHash?: string;
  role?: 'admin' | 'user';
  rubro?: string;
  instagram?: string;
  telefono?: string;
  estrategiaPersonalizada?: string;
  notasEquipo?: string;
  fechaExpiracion?: string;
  estadoPago?: 'al_dia' | 'pendiente_transferencia' | 'moroso' | 'inactivo' | 'expirado';
  brandKit?: {
    logoUrl?: string;
    colores?: string[];
    tonoVoz?: string;
    eslogan?: string;
  };
  // Integraciones Meta (Auto-Publishing Instagram & Facebook)
  metaAccessToken?: string;
  metaPageId?: string;
  metaInstagramAccountId?: string;
  autoPublishEnabled?: boolean;

  // Integraciones Meta WhatsApp Cloud API
  whatsappPhoneNumberId?: string;
  whatsappAccessToken?: string;
  whatsappBusinessAccountId?: string;
  whatsappAutoReplyEnabled?: boolean;

  // Ciclo de facturación y Marca Blanca
  billingCycle?: 'mensual' | 'anual';
  whiteLabel?: {
    enabled: boolean;
    agencyName?: string;
    logoUrl?: string;
    customDomain?: string;
  };

  // Métricas ROI y CRM
  roiMetrics?: {
    leadsGenerados: number;
    ventasEstimadasCLP: number;
    horasAhorradas: number;
    costoAgenciaAhorradoCLP: number;
  };
}

export interface WhatsAppLead {
  id: string;
  userId: string;
  phone: string;
  name?: string;
  lastMessage: string;
  aiReply?: string;
  timestamp: string;
  status: 'nuevo' | 'cotizando' | 'cerrado';
  dealValueCLP?: number;
}

export interface AutoPublishLog {
  id: string;
  userId: string;
  platform: 'instagram' | 'facebook';
  caption: string;
  imageUrl?: string;
  status: 'publicado' | 'programado' | 'fallido';
  timestamp: string;
  permalink?: string;
  error?: string;
}

export interface SystemSettings {
  telegramBotToken?: string;
  telegramChatId?: string;
  flowApiKey?: string;
  flowSecretKey?: string;
  flowEnv?: 'sandbox' | 'production';
  whatsappVentas?: string;
  geminiApiKey?: string;
  metaAppId?: string;
  metaAppSecret?: string;
  whatsappVerifyToken?: string;
}

export interface LocalDatabase {
  users: Record<string, ClientRecord>;
  onboardings: Record<string, any>;
  posts: Record<string, any[]>;
  anuncios: Record<string, any[]>;
  chats: Record<string, any[]>;
  transactions: any[];
  teamMembers: Array<{ id: string; nombre: string; email: string; rol: string }>;
  settings?: SystemSettings;
  whatsappLeads?: WhatsAppLead[];
  autoPublishLogs?: AutoPublishLog[];
  metrics: {
    totalGeminiCalls: number;
    totalPollinationsImages: number;
    totalRevenueCLP: number;
  };
}

function getDefaultDatabase(): LocalDatabase {
  return {
    settings: {
      telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
      telegramChatId: process.env.TELEGRAM_ADMIN_CHAT_ID || '',
      flowApiKey: process.env.FLOW_API_KEY || '',
      flowSecretKey: process.env.FLOW_SECRET_KEY || '',
      flowEnv: (process.env.FLOW_ENV as any) || 'sandbox',
      whatsappVentas: process.env.WHATSAPP_VENTAS_CHILE || '56991842110',
      geminiApiKey: process.env.GEMINI_API_KEY || '',
    },
    users: {
      demo_user: {
        userId: 'demo_user',
        email: 'demo@segar.ai',
        nombre: 'Boutique Bella Santiago',
        rubro: 'Moda y Ropa Femenina',
        instagram: '@boutiquebella.cl',
        telefono: '+56991842110',
        plan: 'pro',
        postsUsados: 12,
        anunciosUsados: 3,
        closerRespuestasUsadas: 45,
        periodoInicio: new Date().toISOString(),
        fechaExpiracion: new Date(Date.now() + 30 * 86400000).toISOString(),
        activo: true,
        origenPago: 'mercadopago',
        estadoPago: 'al_dia',
        notasEquipo: 'Cliente VIP transferido por Copec Pay. Prefiere publicaciones de vestidos los días jueves y ofertas flash los domingos.',
        estrategiaPersonalizada: '1. Ganchos de escasez ("Solo 5 unidades en stock"). 2. Carruseles mostrando cómo combinar outfits. 3. Envíos gratis sobre $40.000 a todo Chile.',
        brandKit: {
          colores: ['#6366f1', '#ec4899', '#0f172a'],
          tonoVoz: 'Canchero, cercano y con urgencia comercial',
          eslogan: 'Moda exclusiva para mujeres con estilo propio',
        },
      },
      cliente_patagonia: {
        userId: 'cliente_patagonia',
        email: 'contacto@cafepatagonia.cl',
        nombre: 'Cafetería & Tostaduría Patagonia',
        rubro: 'Gastronomía y Café de Especialidad',
        instagram: '@cafepatagonia.cl',
        telefono: '+56987654321',
        plan: 'emprendedor',
        postsUsados: 8,
        anunciosUsados: 1,
        closerRespuestasUsadas: 24,
        periodoInicio: new Date().toISOString(),
        fechaExpiracion: new Date(Date.now() + 25 * 86400000).toISOString(),
        activo: true,
        origenPago: 'transferencia',
        estadoPago: 'al_dia',
        notasEquipo: 'Pagó por Copec Pay. Quieren posicionar su café en grano para despachos a regiones.',
        estrategiaPersonalizada: '1. Reels de preparación espresso y latte art. 2. Promociones de combo desayuno de 8 a 11 AM.',
      },
      cliente_dental: {
        userId: 'cliente_dental',
        email: 'admin@clinicasilva.cl',
        nombre: 'Clínica Dental Silva',
        rubro: 'Salud y Odontología Estética',
        instagram: '@clinicadentalsilva',
        telefono: '+56976543210',
        plan: 'agencia',
        postsUsados: 42,
        anunciosUsados: 8,
        closerRespuestasUsadas: 180,
        periodoInicio: new Date().toISOString(),
        fechaExpiracion: new Date(Date.now() + 28 * 86400000).toISOString(),
        activo: true,
        origenPago: 'mercadopago',
        estadoPago: 'al_dia',
        notasEquipo: 'Manejan 2 sucursales en Las Condes y Providencia. Atienden WhatsApp intensivamente con el Closer IA.',
        estrategiaPersonalizada: '1. Casos antes y después de blanqueamiento. 2. Promociones de evaluación gratuita con agendamiento rápido por WhatsApp.',
      },
    },
    onboardings: {},
    posts: {},
    anuncios: {},
    chats: {},
    teamMembers: [
      { id: 'tm_1', nombre: 'Director General (Tú)', email: 'operaciones.segar.ant@gmail.com', rol: 'Super Admin' },
      { id: 'tm_2', nombre: 'Account Manager VIP', email: 'soporte@segar.ai', rol: 'Estratega de Cuentas' },
    ],
    transactions: [
      {
        id: 'trx_demo_01',
        userId: 'demo_user',
        plan: 'pro',
        montoCLP: 29900,
        metodo: 'copec_pay',
        estado: 'approved',
        fecha: new Date().toISOString(),
      },
      {
        id: 'trx_demo_02',
        userId: 'cliente_patagonia',
        plan: 'emprendedor',
        montoCLP: 15000,
        metodo: 'transferencia',
        estado: 'approved',
        fecha: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        id: 'trx_demo_03',
        userId: 'cliente_dental',
        plan: 'agencia',
        montoCLP: 59900,
        metodo: 'flow_webpay',
        estado: 'approved',
        fecha: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    ],
    metrics: {
      totalGeminiCalls: 38,
      totalPollinationsImages: 25,
      totalRevenueCLP: 104800,
    },
  };
}

export function readLocalDb(): LocalDatabase {
  if (memoryCacheDb) {
    return memoryCacheDb;
  }
  try {
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      const initial = getDefaultDatabase();
      try {
        fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      } catch (writeErr) {
        console.warn('Usando base en memoria (Linux read-only):', writeErr);
      }
      memoryCacheDb = initial;
      return initial;
    }
    const data = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
    memoryCacheDb = JSON.parse(data) as LocalDatabase;
    return memoryCacheDb;
  } catch (err) {
    console.error('Error leyendo base de datos local:', err);
    memoryCacheDb = memoryCacheDb || getDefaultDatabase();
    return memoryCacheDb;
  }
}

export function writeLocalDb(db: LocalDatabase): void {
  memoryCacheDb = db;
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Aviso: Escribiendo en memoria por entorno Linux serverless:', err);
  }
}

// Helpers para obtención y actualización de usuarios
export function getUserCredits(userId: string = 'demo_user'): ClientRecord {
  const db = readLocalDb();
  let user = db.users[userId];
  if (!user) {
    user = {
      userId,
      plan: 'emprendedor',
      postsUsados: 0,
      anunciosUsados: 0,
      closerRespuestasUsadas: 0,
      periodoInicio: new Date().toISOString(),
      fechaExpiracion: new Date(Date.now() + 30 * 86400000).toISOString(),
      activo: true,
      origenPago: 'trial',
      estadoPago: 'al_dia',
    };
    db.users[userId] = user;
    writeLocalDb(db);
  }
  return user;
}

export function incrementUserUsage(
  userId: string = 'demo_user',
  type: 'post' | 'anuncio' | 'closer',
  amount: number = 1
): void {
  const db = readLocalDb();
  if (!db.users[userId]) {
    getUserCredits(userId);
  }
  if (type === 'post') db.users[userId].postsUsados += amount;
  if (type === 'anuncio') db.users[userId].anunciosUsados += amount;
  if (type === 'closer') db.users[userId].closerRespuestasUsadas += amount;

  db.metrics.totalGeminiCalls += 1;
  writeLocalDb(db);
}

export function activateUserSubscription(
  userId: string,
  plan: PlanType,
  metodo: 'mercadopago' | 'transferencia' | 'admin_manual' | 'copec_pay' | 'flow_webpay',
  montoCLP: number,
  clientMetadata?: Partial<ClientRecord>
): ClientRecord {
  const db = readLocalDb();
  let targetUserId = userId;
  let existing = db.users[targetUserId];

  // Si no se encuentra por userId pero se proporcionó un email, buscar usuario existente por email
  if (!existing && clientMetadata?.email) {
    const userByEmail = findUserByEmail(clientMetadata.email);
    if (userByEmail) {
      existing = userByEmail;
      targetUserId = userByEmail.userId;
    }
  }

  const now = Date.now();
  const isAnual = clientMetadata?.billingCycle === 'anual';
  const daysToExtend = isAnual ? 365 : 30;

  // Extender 30 días (o 365 días en anual) exactos a partir de la expiración actual (si aún no vence) o desde hoy
  const baseTime = existing?.fechaExpiracion && new Date(existing.fechaExpiracion).getTime() > now
    ? new Date(existing.fechaExpiracion).getTime()
    : now;

  const updated: ClientRecord = {
    ...(existing || {}),
    userId: targetUserId,
    plan,
    postsUsados: 0,
    anunciosUsados: 0,
    closerRespuestasUsadas: 0,
    periodoInicio: new Date().toISOString(),
    fechaExpiracion: new Date(baseTime + daysToExtend * 86400000).toISOString(),
    activo: true,
    origenPago: metodo,
    estadoPago: 'al_dia',
    ...clientMetadata,
  };

  db.users[targetUserId] = updated;

  db.transactions.push({
    id: `trx_flow_${Date.now()}`,
    userId: targetUserId,
    plan,
    montoCLP,
    metodo,
    estado: 'approved',
    fecha: new Date().toISOString(),
  });

  db.metrics.totalRevenueCLP += montoCLP;
  writeLocalDb(db);
  return updated;
}

// Métodos de gestión exclusiva de Super Admin
export function upsertClient(client: Partial<ClientRecord> & { userId: string }): ClientRecord {
  const db = readLocalDb();
  const existing = db.users[client.userId] || {
    userId: client.userId,
    plan: 'emprendedor' as PlanType,
    postsUsados: 0,
    anunciosUsados: 0,
    closerRespuestasUsadas: 0,
    periodoInicio: new Date().toISOString(),
    fechaExpiracion: new Date(Date.now() + 30 * 86400000).toISOString(),
    activo: true,
    origenPago: 'admin_manual',
    estadoPago: 'al_dia',
  };

  const merged: ClientRecord = {
    ...existing,
    ...client,
    userId: client.userId,
  };

  db.users[client.userId] = merged;
  writeLocalDb(db);
  return merged;
}

export function deleteClient(userId: string): boolean {
  const db = readLocalDb();
  if (db.users[userId]) {
    delete db.users[userId];
    writeLocalDb(db);
    return true;
  }
  return false;
}

export function adjustCredits(userId: string, postsDelta: number, closerDelta: number): ClientRecord | null {
  const db = readLocalDb();
  const client = db.users[userId];
  if (!client) return null;

  client.postsUsados = Math.max(0, (client.postsUsados || 0) - postsDelta);
  client.closerRespuestasUsadas = Math.max(0, (client.closerRespuestasUsadas || 0) - closerDelta);
  writeLocalDb(db);
  return client;
}

export function getSystemSettings(): SystemSettings {
  const db = readLocalDb();
  return db.settings || {
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
    telegramChatId: process.env.TELEGRAM_ADMIN_CHAT_ID || '',
    flowApiKey: process.env.FLOW_API_KEY || '',
    flowSecretKey: process.env.FLOW_SECRET_KEY || '',
    flowEnv: (process.env.FLOW_ENV as any) || 'sandbox',
    whatsappVentas: process.env.WHATSAPP_VENTAS_CHILE || '56991842110',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
  };
}

export function updateSystemSettings(updates: Partial<SystemSettings>): SystemSettings {
  const db = readLocalDb();
  db.settings = {
    ...getSystemSettings(),
    ...updates,
  };
  writeLocalDb(db);
  return db.settings;
}

/**
 * Busca un usuario por su correo electrónico (case-insensitive)
 */
export function findUserByEmail(email: string): ClientRecord | null {
  if (!email) return null;
  const db = readLocalDb();
  const normalized = email.trim().toLowerCase();
  for (const user of Object.values(db.users)) {
    if (user.email && user.email.trim().toLowerCase() === normalized) {
      return user;
    }
  }
  return null;
}

/**
 * Registra un nuevo usuario con contraseña hasheada
 */
export function createUserWithPassword(params: {
  email: string;
  nombre: string;
  passwordHash: string;
  plan?: PlanType;
  telefono?: string;
  rubro?: string;
  role?: 'admin' | 'user';
  activo?: boolean;
}): ClientRecord {
  const db = readLocalDb();
  const emailNorm = params.email.trim().toLowerCase();
  const userId = emailNorm.replace(/[^a-z0-9]/g, '_');

  const newUser: ClientRecord = {
    userId,
    email: emailNorm,
    nombre: params.nombre.trim(),
    passwordHash: params.passwordHash,
    role: params.role || (emailNorm === 'operaciones.segar.ant@gmail.com' ? 'admin' : 'user'),
    plan: params.plan || 'pro',
    telefono: params.telefono || '+569',
    rubro: params.rubro || 'Comercio General',
    postsUsados: 0,
    anunciosUsados: 0,
    closerRespuestasUsadas: 0,
    periodoInicio: new Date().toISOString(),
    fechaExpiracion: new Date(Date.now() + 30 * 86400000).toISOString(),
    activo: params.activo !== undefined ? params.activo : false,
    estadoPago: params.activo ? 'al_dia' : 'inactivo',
    origenPago: 'flow_webpay',
  };

  db.users[userId] = newUser;
  writeLocalDb(db);
  return newUser;
}

/**
 * Extiende la suscripción del usuario por 30 días exactos y resetea créditos mensuales
 */
export function extendUserSubscription(userId: string, days = 30): ClientRecord | null {
  const db = readLocalDb();
  const user = db.users[userId];
  if (!user) return null;

  const now = Date.now();
  const baseTime = user.fechaExpiracion && new Date(user.fechaExpiracion).getTime() > now
    ? new Date(user.fechaExpiracion).getTime()
    : now;

  user.activo = true;
  user.estadoPago = 'al_dia';
  user.periodoInicio = new Date().toISOString();
  user.fechaExpiracion = new Date(baseTime + days * 86400000).toISOString();
  user.postsUsados = 0;
  user.anunciosUsados = 0;
  user.closerRespuestasUsadas = 0;

  writeLocalDb(db);
  return user;
}

/**
 * Cambia el estado de activación y pago de un usuario
 */
export function setUserSubscriptionStatus(
  userId: string,
  activo: boolean,
  estadoPago: 'al_dia' | 'inactivo' | 'expirado'
): ClientRecord | null {
  const db = readLocalDb();
  const user = db.users[userId];
  if (!user) return null;

  user.activo = activo;
  user.estadoPago = estadoPago;
  writeLocalDb(db);
  return user;
}

/**
 * Verifica usuarios cuyas suscripciones hayan expirado y los marca como inactivos/expirados
 */
export function checkSubscriptionsExpiration(): { expiredUsers: ClientRecord[] } {
  const db = readLocalDb();
  const now = new Date();
  const expiredUsers: ClientRecord[] = [];

  for (const user of Object.values(db.users)) {
    if (user.role !== 'admin' && user.activo && user.fechaExpiracion) {
      const expDate = new Date(user.fechaExpiracion);
      if (expDate < now) {
        user.activo = false;
        user.estadoPago = 'expirado';
        expiredUsers.push(user);
      }
    }
  }

  if (expiredUsers.length > 0) {
    writeLocalDb(db);
  }

  return { expiredUsers };
}

/**
 * Guarda o actualiza un lead capturado por el bot de WhatsApp Cloud
 */
export function saveWhatsAppLead(lead: {
  userId: string;
  phone: string;
  name?: string;
  lastMessage: string;
  aiReply?: string;
  status?: 'nuevo' | 'cotizando' | 'cerrado';
  dealValueCLP?: number;
}): WhatsAppLead {
  const db = readLocalDb();
  if (!db.whatsappLeads) db.whatsappLeads = [];

  const existingIndex = db.whatsappLeads.findIndex(
    (l) => l.userId === lead.userId && l.phone === lead.phone
  );

  const updatedLead: WhatsAppLead = {
    id: existingIndex >= 0 ? db.whatsappLeads[existingIndex].id : `lead_${Date.now()}`,
    userId: lead.userId,
    phone: lead.phone,
    name: lead.name || (existingIndex >= 0 ? db.whatsappLeads[existingIndex].name : undefined),
    lastMessage: lead.lastMessage,
    aiReply: lead.aiReply,
    timestamp: new Date().toISOString(),
    status: lead.status || (existingIndex >= 0 ? db.whatsappLeads[existingIndex].status : 'nuevo'),
    dealValueCLP: lead.dealValueCLP || (existingIndex >= 0 ? db.whatsappLeads[existingIndex].dealValueCLP : 35000),
  };

  if (existingIndex >= 0) {
    db.whatsappLeads[existingIndex] = updatedLead;
  } else {
    db.whatsappLeads.unshift(updatedLead);
  }

  // Actualizar métricas de ROI
  const user = db.users[lead.userId];
  if (user) {
    if (!user.roiMetrics) {
      user.roiMetrics = {
        leadsGenerados: 0,
        ventasEstimadasCLP: 0,
        horasAhorradas: 0,
        costoAgenciaAhorradoCLP: 350000,
      };
    }
    user.roiMetrics.leadsGenerados = (user.roiMetrics.leadsGenerados || 0) + 1;
    user.roiMetrics.ventasEstimadasCLP = (user.roiMetrics.ventasEstimadasCLP || 0) + (updatedLead.dealValueCLP || 35000);
  }

  writeLocalDb(db);
  return updatedLead;
}

export function getWhatsAppLeads(userId: string): WhatsAppLead[] {
  const db = readLocalDb();
  const leads = db.whatsappLeads || [];
  if (!userId || userId === 'all') return leads;
  return leads.filter((l) => l.userId === userId);
}

/**
 * Registra un log de auto-publicación en Instagram o Facebook
 */
export function saveAutoPublishLog(log: Omit<AutoPublishLog, 'id'>): AutoPublishLog {
  const db = readLocalDb();
  if (!db.autoPublishLogs) db.autoPublishLogs = [];

  const newLog: AutoPublishLog = {
    id: `pub_${Date.now()}`,
    ...log,
  };

  db.autoPublishLogs.unshift(newLog);
  writeLocalDb(db);
  return newLog;
}

export function getAutoPublishLogs(userId: string): AutoPublishLog[] {
  const db = readLocalDb();
  const logs = db.autoPublishLogs || [];
  if (!userId || userId === 'all') return logs;
  return logs.filter((l) => l.userId === userId);
}

/**
 * Calcula y devuelve las métricas de ROI demostrable para el cliente
 */
export function getUserRoiMetrics(userId: string = 'demo_user') {
  const db = readLocalDb();
  const user = db.users[userId] || db.users['demo_user'] || {};
  const leads = getWhatsAppLeads(userId);

  const postsRealizados = user.postsUsados || 14;
  const horasAhorradas = Math.round(postsRealizados * 2.2); // ~2.2 hrs por post profesional con copy y diseño
  const leadsCount = leads.length > 0 ? leads.length : Math.max(8, postsRealizados * 3);
  const ventasEstimadas = leads.reduce((acc, l) => acc + (l.dealValueCLP || 35000), 0) || (leadsCount * 32000);
  const costoAgenciaAhorrado = 350000; // Costo base mensual de una agencia tradicional en Chile
  const inversionCliente = user.plan === 'emprendedor' ? 15000 : user.plan === 'agencia' ? 59900 : 29900;
  const retornoNeto = (ventasEstimadas + costoAgenciaAhorrado) - inversionCliente;
  const roiPorcentaje = Math.round((retornoNeto / inversionCliente) * 100);

  return {
    userId,
    plan: user.plan || 'pro',
    postsRealizados,
    horasAhorradas,
    leadsCount,
    ventasEstimadasCLP: ventasEstimadas,
    costoAgenciaAhorradoCLP: costoAgenciaAhorrado,
    inversionClienteCLP: inversionCliente,
    retornoNetoCLP: retornoNeto,
    roiPorcentaje,
  };
}
