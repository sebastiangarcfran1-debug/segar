import { NextRequest, NextResponse } from 'next/server';
import { getUserRoiMetrics, getWhatsAppLeads } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  const userId = session?.userId || 'demo_user';

  const metrics = getUserRoiMetrics(userId);
  const leads = getWhatsAppLeads(userId);

  return NextResponse.json({
    metrics,
    leads: leads.slice(0, 10),
  });
}
