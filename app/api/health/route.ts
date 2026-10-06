import { NextResponse } from 'next/server';
import { readLocalDb } from '@/lib/db';

export async function GET() {
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('TuClaveGratis'));
  const flowConfigured = Boolean(process.env.FLOW_API_KEY && !process.env.FLOW_API_KEY.includes('tu-flow-api-key'));
  const telegramConfigured = Boolean(process.env.TELEGRAM_BOT_TOKEN && !process.env.TELEGRAM_BOT_TOKEN.includes('123456789:ABC'));
  const metaConfigured = Boolean(process.env.WHATSAPP_ACCESS_TOKEN && !process.env.WHATSAPP_ACCESS_TOKEN.includes('EAAG...'));

  const db = readLocalDb();

  return NextResponse.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    system: {
      name: 'SEGAR AI MARKETING',
      version: '1.0.0',
      fixedMonthlyCost: '$0 USD (100% Free Tier)',
    },
    integrations: {
      googleGeminiAI: {
        status: geminiConfigured ? 'connected' : 'local_high_fidelity_fallback',
        model: 'gemini-2.0-flash',
        dailyFreeLimit: 1500,
        usedToday: db.metrics.totalGeminiCalls,
      },
      pollinationsImageAI: {
        status: 'online_unlimited',
        model: 'flux',
        cost: '$0 (No API key required)',
      },
      flowChile: {
        status: flowConfigured ? 'production_ready' : 'instant_sandbox_ready',
        methods: ['Webpay Plus', 'Tarjetas Crédito/Débito', 'Mach', 'Servipag', 'Banco Estado'],
        monthlyCost: '$0 CLP (Sin costo fijo, solo comisión por venta concretada)',
      },
      telegramBot: {
        status: telegramConfigured ? 'bot_connected' : 'interactive_simulator_ready',
        cost: '$0 (Unlimited)',
      },
      metaWhatsApp: {
        status: metaConfigured ? 'connected' : 'ready_for_credentials',
        freeMonthlyConversations: 1000,
      },
    },
    database: {
      provider: 'Firestore Spark Plan Ready / Local High Performance Store',
      activeUsers: Object.values(db.users).filter((u) => u.activo).length,
      totalMRR_CLP: db.metrics.totalRevenueCLP,
    },
  });
}
