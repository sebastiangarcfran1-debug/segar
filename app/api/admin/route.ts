import { NextRequest, NextResponse } from 'next/server';
import { readLocalDb, activateUserSubscription, writeLocalDb } from '@/lib/db';
import { PlanType, PLANES } from '@/lib/credits';

export async function GET() {
  const db = readLocalDb();
  
  // Calcular MRR real sumando las suscripciones activas
  let mrrCLP = 0;
  Object.values(db.users).forEach((u) => {
    if (u.activo && u.plan !== 'gratis_trial') {
      mrrCLP += PLANES[u.plan]?.precioCLP || 0;
    }
  });

  return NextResponse.json({
    users: Object.values(db.users),
    transactions: db.transactions,
    metrics: {
      ...db.metrics,
      mrrCLP,
      mrrUSD: Math.round(mrrCLP / 900), // Estimación CLP a USD
      totalUsuariosActivos: Object.values(db.users).filter(u => u.activo).length,
      // Límites de Gemini Free Tier para vigilar
      geminiFreeTierRestante: Math.max(0, 1500 - db.metrics.totalGeminiCalls),
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userId, plan, montoCLP, password } = body;

    const adminSecret = process.env.ADMIN_PASSWORD || 'segar2026';
    if (password && password !== adminSecret) {
      return NextResponse.json({ error: 'Contraseña de administrador incorrecta' }, { status: 401 });
    }

    if (action === 'activar_transferencia') {
      const planInfo = PLANES[plan as PlanType] || PLANES.emprendedor;
      const monto = montoCLP || planInfo.precioCLP;
      activateUserSubscription(userId, plan as PlanType, 'transferencia', monto);
      return NextResponse.json({ success: true, message: `Usuario ${userId} activado en plan ${plan}` });
    }

    if (action === 'toggle_activo') {
      const db = readLocalDb();
      if (db.users[userId]) {
        db.users[userId].activo = !db.users[userId].activo;
        writeLocalDb(db);
        return NextResponse.json({ success: true, estado: db.users[userId].activo });
      }
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Acción no reconocida' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
