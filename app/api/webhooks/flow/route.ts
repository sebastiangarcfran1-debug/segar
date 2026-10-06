import { NextRequest, NextResponse } from 'next/server';
import { handleFlowConfirmation } from '@/lib/flow';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let token = '';

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      token = (formData.get('token') as string) || '';
    } else {
      const body = await req.json().catch(() => ({}));
      token = body.token || '';
    }

    if (!token) {
      const url = new URL(req.url);
      token = url.searchParams.get('token') || '';
    }

    const confirmed = await handleFlowConfirmation(token);
    return NextResponse.json({ received: true, confirmed });
  } catch (error: any) {
    console.error('Error en webhook de Flow.cl:', error);
    return NextResponse.json({ received: true, error: error.message }, { status: 200 });
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token') || '';
  if (token) {
    await handleFlowConfirmation(token);
  }
  return NextResponse.json({ status: 'Flow.cl Webhook endpoint online' });
}
