import fs from 'fs';
import path from 'path';
import { PlanType, UserCredits, PLANES } from './credits';

// Ruta para almacenamiento local de desarrollo si Firestore no está inicializado
const LOCAL_DB_PATH = path.join(process.cwd(), '.local-db.json');

export interface LocalDatabase {
  users: Record<string, UserCredits & { email?: string; nombre?: string; rubro?: string; instagram?: string }>;
  onboardings: Record<string, any>;
  posts: Record<string, any[]>;
  anuncios: Record<string, any[]>;
  chats: Record<string, any[]>;
  transactions: any[];
  metrics: {
    totalGeminiCalls: number;
    totalPollinationsImages: number;
    totalRevenueCLP: number;
  };
}

function getDefaultDatabase(): LocalDatabase {
  return {
    users: {
      demo_user: {
        userId: 'demo_user',
        email: 'demo@segar.ai',
        nombre: 'Negocio Demo Chile',
        rubro: 'Comercio / Tienda Online',
        instagram: '@demo.chile',
        plan: 'emprendedor',
        postsUsados: 5,
        anunciosUsados: 1,
        closerRespuestasUsadas: 18,
        periodoInicio: new Date().toISOString(),
        activo: true,
        origenPago: 'mercadopago',
      },
    },
    onboardings: {},
    posts: {},
    anuncios: {},
    chats: {},
    transactions: [
      {
        id: 'trx_demo_01',
        userId: 'demo_user',
        plan: 'emprendedor',
        montoCLP: 15000,
        metodo: 'mercadopago',
        estado: 'approved',
        fecha: new Date().toISOString(),
      },
    ],
    metrics: {
      totalGeminiCalls: 12,
      totalPollinationsImages: 10,
      totalRevenueCLP: 15000,
    },
  };
}

export function readLocalDb(): LocalDatabase {
  try {
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      const initial = getDefaultDatabase();
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const data = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
    return JSON.parse(data) as LocalDatabase;
  } catch (err) {
    console.error('Error leyendo base de datos local:', err);
    return getDefaultDatabase();
  }
}

export function writeLocalDb(db: LocalDatabase): void {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error escribiendo base de datos local:', err);
  }
}

// Helpers universales para obtener usuario y actualizar créditos
export function getUserCredits(userId: string = 'demo_user'): UserCredits {
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
      activo: true,
      origenPago: 'trial',
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
  metodo: 'mercadopago' | 'transferencia' | 'admin_manual',
  montoCLP: number
): void {
  const db = readLocalDb();
  db.users[userId] = {
    userId,
    plan,
    postsUsados: 0,
    anunciosUsados: 0,
    closerRespuestasUsadas: 0,
    periodoInicio: new Date().toISOString(),
    activo: true,
    origenPago: metodo,
  };

  db.transactions.push({
    id: `trx_${Date.now()}`,
    userId,
    plan,
    montoCLP,
    metodo,
    estado: 'approved',
    fecha: new Date().toISOString(),
  });

  db.metrics.totalRevenueCLP += montoCLP;
  writeLocalDb(db);
}
