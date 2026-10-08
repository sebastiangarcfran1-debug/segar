import { NextRequest, NextResponse } from 'next/server';

export interface BusinessKnowledge {
  nombreNegocio: string;
  rubro: string;
  whatsapp: string;
  direccion: string;
  ciudad: string;
  coberturaEnvios: string;
  horarioAtencion: string;
  metodosPago: string;
  productosPrincipales: Array<{
    nombre: string;
    precioCLP: string;
    descripcion: string;
  }>;
  politicaEnvioGarantia: string;
  preguntasFrecuentes: Array<{
    pregunta: string;
    respuesta: string;
  }>;
  notasEspeciales: string;
}

// Almacén en memoria por defecto
let storedKnowledge: BusinessKnowledge = {
  nombreNegocio: 'SEGAR AI MARKETING',
  rubro: 'Marketing y Crecimiento para Pymes',
  whatsapp: '+56 9 91842110',
  direccion: 'Atención Digital a todo Chile',
  ciudad: 'Santiago',
  coberturaEnvios: 'Todo Chile (Starken, Chilexpress, Blue Express o Entrega Digital Inmediata)',
  horarioAtencion: 'Lunes a Sábado de 09:00 a 20:00 hrs',
  metodosPago: 'Copec Pay, Transferencia Bancaria, Flow Webpay (Débito y Crédito)',
  productosPrincipales: [
    {
      nombre: 'Membresía Pyme Escala',
      precioCLP: '$15.000 CLP / mes',
      descripcion: 'Acceso a la plataforma, 30 posts generados, Closer de WhatsApp y diagnóstico.',
    },
    {
      nombre: 'Membresía Pro Crecimiento',
      precioCLP: '$29.900 CLP / mes',
      descripcion: 'Generación ilimitada de posts, carruseles, video ads, radar de competencia y Brand Kit.',
    },
    {
      nombre: 'Membresía Agencia VIP',
      precioCLP: '$59.900 CLP / mes',
      descripcion: 'Modo marca blanca, múltiples marcas, concierge prioritario y estrategias personalizadas.',
    },
  ],
  politicaEnvioGarantia: 'Garantía de activación inmediata y soporte directo 1 a 1 por WhatsApp.',
  preguntasFrecuentes: [
    {
      pregunta: '¿Tengo que pagar costos ocultos o servidores?',
      respuesta: 'No. El costo es $0 en infraestructura. La plataforma está optimizada para operar sin costos adicionales.',
    },
    {
      pregunta: '¿Cómo pago mi suscripción?',
      respuesta: 'Vía transferencia directa a Copec Pay (Cuenta Vista 12880008101, RUT 28800081-6) o por Webpay mediante Flow.cl.',
    },
  ],
  notasEspeciales: 'Enfocados en maximizar las ventas de las pymes de Chile y Latinoamérica con inteligencia artificial autónoma.',
};

export async function GET() {
  return NextResponse.json({ success: true, knowledge: storedKnowledge });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    storedKnowledge = {
      ...storedKnowledge,
      ...data,
    };
    return NextResponse.json({ success: true, knowledge: storedKnowledge });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error guardando base de conocimiento', detalle: error.message }, { status: 500 });
  }
}
