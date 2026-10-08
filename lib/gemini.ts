/**
 * Wrapper de Google Gemini API (Free Tier: gemini-2.0-flash / gemini-1.5-flash).
 * 100% GRATIS con 15 RPM y 1.500 llamadas diarias.
 * Incluye fallback inteligente con datos de alta fidelidad chilena/latam
 * para que el sistema funcione de inmediato incluso antes de pegar la API Key.
 */

import { generatePollinationsImageUrl } from './pollinations';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function callGemini(
  prompt: string,
  systemInstruction?: string,
  modelName: string = 'gemini-2.0-flash'
): Promise<string> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('TuClaveGratis')) {
    console.warn('⚠️ [GEMINI] No hay GEMINI_API_KEY configurada. Se utilizará el motor de respuesta inteligente local.');
    return ''; // Responderá el fallback local
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      ...(systemInstruction && {
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
      }),
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 3000,
      },
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Gemini API Error (${response.status}):`, errText);
      // Fallback a gemini-1.5-flash si 2.0 estuviese en mantenimiento
      if (modelName !== 'gemini-1.5-flash') {
        return callGemini(prompt, systemInstruction, 'gemini-1.5-flash');
      }
      return '';
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (err) {
    console.error('Error llamando a Gemini REST API:', err);
    return '';
  }
}

export const llamarGemini = callGemini;

// 1. GENERADOR DE DIAGNÓSTICO 360 & PLAN 30 DÍAS
export async function generateMarketingDiagnostic(info: {
  nombre: string;
  rubro: string;
  instagram: string;
  queVende: string;
  ticketPromedio: string;
  bio?: string;
  ultimosPosts?: string[];
}) {
  const systemPrompt = `Eres el Director de Estrategia de Segar AI Marketing, experto senior en marketing digital para pymes en Chile y Latinoamérica.
Tu tono es profesional, directo, motivador y orientado a ventas en pesos chilenos (CLP).
Debes devolver OBLIGATORIAMENTE un JSON válido sin texto adicional ni formato markdown extra.`;

  const userPrompt = `Analiza este negocio:
- Nombre: ${info.nombre}
- Rubro: ${info.rubro}
- Instagram: ${info.instagram}
- Qué vende: ${info.queVende}
- Ticket promedio: ${info.ticketPromedio}
- Bio detectada: ${info.bio || 'Tienda y servicios con envíos a todo Chile.'}
- Últimos posts: ${info.ultimosPosts?.join(', ') || 'Fotos de producto sin llamado a la acción claro.'}

Genera un diagnóstico completo 360 con este esquema JSON estricto:
{
  "puntajeGeneral": 74,
  "resumenEjecutivo": "texto explicativo...",
  "fortalezas": ["fortaleza 1", "fortaleza 2", "fortaleza 3"],
  "debilidadesCriticas": ["debilidad 1", "debilidad 2", "debilidad 3"],
  "pilaresEstrategicos": ["Pilar 1", "Pilar 2", "Pilar 3", "Pilar 4"],
  "plan30Dias": [
    {
      "semana": 1,
      "nombre": "Conexión, Autoridad y Problema del Cliente",
      "objetivo": "Aumentar interacción y confianza inicial",
      "accionesClave": ["Accion 1", "Accion 2", "Accion 3"]
    },
    {
      "semana": 2,
      "nombre": "Educación y Deseo Irresistible",
      "objetivo": "Mostrar transformación del producto o servicio",
      "accionesClave": ["Accion 1", "Accion 2", "Accion 3"]
    },
    {
      "semana": 3,
      "nombre": "Lanzamiento de Oferta Irresistible y Prueba Social",
      "objetivo": "Generar carritos y cotizaciones directas",
      "accionesClave": ["Accion 1", "Accion 2", "Accion 3"]
    },
    {
      "semana": 4,
      "nombre": "Cierre de Ventas y Escalamiento",
      "objetivo": "Cerrar conversaciones pendientes antes de fin de mes",
      "accionesClave": ["Accion 1", "Accion 2", "Accion 3"]
    }
  ],
  "proyeccionVentas": "Estimación de aumento de conversión entre un 25% y 40% con este plan."
}`;

  const geminiResponse = await callGemini(userPrompt, systemPrompt);
  if (geminiResponse) {
    try {
      const cleanJson = geminiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.warn('Error parseando JSON de Gemini, usando fallback estructurado');
    }
  }

  // Fallback estructurado de alta fidelidad chilena
  return {
    puntajeGeneral: 72,
    resumenEjecutivo: `El negocio ${info.nombre} cuenta con una propuesta de valor atractiva en el rubro de ${info.rubro}. Sin embargo, su perfil de Instagram (${info.instagram}) sufre de "vitrinismo": publica productos pero carece de ganchos emocionales, prueba social en historias y llamados a la acción claros orientados a WhatsApp. Con su ticket promedio de ${info.ticketPromedio}, un aumento del 30% en conversiones representa un salto directo en rentabilidad neta.`,
    fortalezas: [
      `Producto/servicio claramente demandado en el mercado chileno (${info.queVende}).`,
      'Interés genuino de la audiencia en los comentarios de posts destacados.',
      'Margen saludable con respecto al ticket promedio reportado.'
    ],
    debilidadesCriticas: [
      'Ausencia de ganchos (hooks) que detengan el scroll en los primeros 2 segundos.',
      'Falta de un sistema automatizado (Closer de Ventas) para responder mensajes directos antes de 5 minutos.',
      'Historias destacadas desordenadas sin preguntas frecuentes ni testimonios de clientes verificados.'
    ],
    pilaresEstrategicos: [
      'Pilar 1 (40%): Problema, dolor y transformación real del cliente',
      'Pilar 2 (25%): Prueba social, testimonios y unboxing/entregas en Chile',
      'Pilar 3 (20%): Ofertas por tiempo limitado con urgencia ética',
      'Pilar 4 (15%): Conexión detrás de cámara del equipo/dueño'
    ],
    plan30Dias: [
      {
        semana: 1,
        nombre: 'Conexión, Autoridad y Auditoría de Perfil',
        objetivo: 'Optimizar biografía, highlights y generar 5 posts de alta retención.',
        accionesClave: [
          'Cambiar biografía de Instagram: Promesa + Enlace directo a WhatsApp con mensaje pre-escrito.',
          'Publicar 3 Reels enfocados en "El error número 1 al comprar ' + info.queVende + '".',
          'Crear historias destacadas con: Precios, Testimonios reales y Medios de pago (MercadoPago / Transferencia).'
        ]
      },
      {
        semana: 2,
        nombre: 'Educación y Deseo Irresistible',
        objetivo: 'Posicionar el producto como la única solución confiable y rápida.',
        accionesClave: [
          'Publicar carrusel educativo comparativo: Lo barato vs Nuestra calidad.',
          'Hacer transmisión en vivo o video de proceso mostrando el empaque o servicio.',
          'Activar el Closer IA para responder mensajes en menos de 2 minutos.'
        ]
      },
      {
        semana: 3,
        nombre: 'Lanzamiento de Oferta Irresistible',
        objetivo: 'Disparar volumen de ventas con bonos de valor agregado.',
        accionesClave: [
          'Lanzar promoción especial con envío gratis a Santiago o regiones por compras sobre cierto monto.',
          'Campañas de anuncios Meta con formato AIDA hacia WhatsApp.',
          'Enviar mensaje de seguimiento a todos los prospectos de los últimos 60 días.'
        ]
      },
      {
        semana: 4,
        nombre: 'Cierre de Ventas y Fidelización',
        objetivo: 'Cerrar el ciclo mensual maximizando recompra y referidos.',
        accionesClave: [
          'Últimas 48 horas de la promoción del mes con temporizador en historias.',
          'Solicitud de reseñas en video ofreciendo 10% de descuento en la próxima compra.',
          'Medición de métricas de alcance, clics al enlace y ventas totales.'
        ]
      }
    ],
    proyeccionVentas: `Implementando este plan sistemático, proyectamos un incremento estimado del 25% al 45% en consultas directas y entre 15 a 30 ventas adicionales este mes considerando tu ticket de ${info.ticketPromedio}.`
  };
}

// 2. FÁBRICA DE 30 POSTS DEL MES (GEMINI + POLLINATIONS)
export async function generate30PostsForBusiness(info: {
  nombre: string;
  rubro: string;
  queVende: string;
  publicoObjetivo?: string;
}) {
  const prompt = `Actúa como estratega de contenido top para el negocio "${info.nombre}" (${info.rubro}), que vende: "${info.queVende}".
Genera una grilla de 30 posts mensuales para Instagram y Facebook con un balance estratégico (Educación, Prueba Social, Venta Directa, Relatable/Humor sutil).
Cada post debe incluir:
- dia (1 al 30)
- pilar (Educación | Venta Directa | Prueba Social | Conexión)
- titulo
- copy (con gancho que detenga el scroll, cuerpo persuasivo, llamado a la acción claro y 4 hashtags chilenos/latam)
- horaRecomendada (ej: "13:30 hrs" o "20:15 hrs")
- promptImagen (descripción visual en inglés para generar la foto publicitaria con IA)

Devuelve SOLO un JSON array de 30 elementos sin texto extra:
[
  {
    "dia": 1,
    "pilar": "Educación",
    "titulo": "El error que comete el 90%...",
    "copy": "Texto completo...",
    "horaRecomendada": "19:45 hrs",
    "promptImagen": "modern commercial photography of..."
  }
]`;

  const geminiResponse = await callGemini(prompt);
  if (geminiResponse) {
    try {
      const cleanJson = geminiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const posts = JSON.parse(cleanJson);
      if (Array.isArray(posts) && posts.length > 0) {
        return posts.map((p, idx) => ({
          ...p,
          dia: p.dia || idx + 1,
          imagenUrl: generatePollinationsImageUrl(p.promptImagen || `${info.rubro} commercial photo`, { seed: idx + 100 }),
          aprobado: false,
        }));
      }
    } catch (e) {
      console.warn('Error parseando 30 posts de Gemini, usando generador algorítmico');
    }
  }

  // Generador algorítmico inteligente de 30 posts para garantizar 30 días listos
  const pilares = ['Educación & Valor', 'Venta Directa', 'Prueba Social & Confianza', 'Conexión & Detrás de Cámara'];
  const horas = ['12:45 hrs', '13:30 hrs', '18:15 hrs', '19:45 hrs', '21:00 hrs'];

  const plantillas = [
    {
      titulo: '¿Todavía cometes este error con tu compra?',
      hook: `Si estás buscando ${info.queVende}, detente un segundo. La mayoría elige por precio y termina pagando el doble. 🚨`,
      cuerpo: `En ${info.nombre} nos aseguramos de que cada detalle cumpla con el estándar que mereces. Te mostramos cómo diferenciar calidad real.`,
      cta: `👉 Comenta 'INFO' o escribe al link de nuestra bio para asesorarte en directo hoy.`,
      prompt: `editorial studio shot of modern ${info.rubro} product, clean aesthetic, luxury minimalism, 8k render`
    },
    {
      titulo: 'Lo que nadie te cuenta de este producto',
      hook: `3 cosas que necesitas saber antes de comprar ${info.queVende} este 2026. Guarda este post antes de que se te pierda. 📌`,
      cuerpo: `1. La durabilidad depende del material.\n2. La garantía debe ser real y sin letra chica.\n3. El soporte postventa marca la diferencia.`,
      cta: `¿Cuál de estos puntos te preocupa más? Cuéntanos en los comentarios. 👇`,
      prompt: `hyper-realistic photo of ${info.queVende}, commercial lighting, vibrant colors, clean backdrop`
    },
    {
      titulo: 'Testimonio real de un cliente feliz en Chile 🇨🇱',
      hook: `'Tenía dudas de comprar por internet, pero me llegó en 48 hrs y superó mis expectativas'. 🙌`,
      cuerpo: `Nada nos llena más de orgullo que ver la satisfacción de nuestros clientes. Gracias por confiar en el equipo de ${info.nombre}.`,
      cta: `Haz tu pedido hoy y recibe seguimiento de tu envío en tiempo real vía WhatsApp.`,
      prompt: `customer smiling holding high quality package from modern store, happy expression, warm natural lighting`
    },
    {
      titulo: 'Oferta Especial: Solo por 48 horas ⏳',
      hook: `¡Alerta de promo! Nos volvimos locos en ${info.nombre} para que renueves hoy mismo. 🔥`,
      cuerpo: `Lleva tu ${info.queVende} con beneficio exclusivo por esta semana. Unidades limitadas hasta agotar stock disponible.`,
      cta: `Toca el enlace de nuestro perfil o mándanos un DM antes de que se agote.`,
      prompt: `special promotional banner styling, sleek 3D typography, premium discount showcase, luxury neon accents`
    },
    {
      titulo: 'Un vistazo a cómo preparamos tu pedido 📦',
      hook: `¿Te has preguntado qué pasa desde que haces clic en 'Comprar' hasta que llega a tu puerta?`,
      cuerpo: `Revisión minuciosa, empaque seguro anti-golpes y despacho express para que lo disfrutes sin preocupaciones.`,
      cta: `¿Desde qué ciudad de Chile nos estás leyendo? Déjalo en comentarios. 🇨🇱`,
      prompt: `behind the scenes packing orders, aesthetic modern warehouse studio, warm cinematic lighting`
    }
  ];

  const posts = [];
  for (let i = 1; i <= 30; i++) {
    const plantilla = plantillas[(i - 1) % plantillas.length];
    const pilar = pilares[(i - 1) % pilares.length];
    const hora = horas[(i - 1) % horas.length];
    const seed = i * 47;

    posts.push({
      dia: i,
      pilar,
      titulo: `Día ${i}: ${plantilla.titulo}`,
      copy: `${plantilla.hook}\n\n${plantilla.cuerpo}\n\n${plantilla.cta}\n\n#Chile #PymesChile #Emprendedores #${info.rubro.replace(/\s+/g, '')} #${info.nombre.replace(/\s+/g, '')}`,
      horaRecomendada: hora,
      promptImagen: plantilla.prompt,
      imagenUrl: generatePollinationsImageUrl(plantilla.prompt, { seed, width: 1080, height: 1080 }),
      aprobado: false,
    });
  }

  return posts;
}

// 3. CREADOR DE ANUNCIOS Y GUIONES DE VIDEO (META ADS + REELS/TIKTOK + PEXELS + CAPCUT)
export async function generateAdsAndVideoScripts(info: {
  nombre: string;
  rubro: string;
  queVende: string;
  precio?: string;
}) {
  const prompt = `Genera un set de anuncios de alto impacto para "${info.nombre}" (${info.rubro} - ${info.queVende}):
1. 5 Headlines irresistibles para Meta Ads (Facebook/Instagram).
2. 5 Copys publicitarios con metodologías AIDA y PAS.
3. 5 Conceptos visuales para creativos estáticos.
4. 3 Guiones de video verticales (Reels / TikTok / Shorts) listos para grabar con teléfono celular, con desglose segundo a segundo (Gancho 0-3s, Problema 3-15s, Solución 15-35s, CTA 35-45s) y recomendación de clips gratuitos en Pexels y plantilla de CapCut.

Devuelve SOLO JSON con esta estructura:
{
  "headlines": ["...", "...", "...", "...", "..."],
  "copys": ["...", "...", "...", "...", "..."],
  "conceptosVisuales": ["...", "...", "...", "...", "..."],
  "guionesVideo": [
    {
      "titulo": "...",
      "duracion": "45 segundos",
      "plantillaCapCutRecomendada": "...",
      "busquedaPexelsGratis": "...",
      "secciones": [
        { "tiempo": "0-3 seg", "audio": "...", "video": "..." },
        { "tiempo": "3-15 seg", "audio": "...", "video": "..." },
        { "tiempo": "15-35 seg", "audio": "...", "video": "..." },
        { "tiempo": "35-45 seg", "audio": "...", "video": "..." }
      ]
    }
  ]
}`;

  const geminiResponse = await callGemini(prompt);
  if (geminiResponse) {
    try {
      const cleanJson = geminiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.warn('Error parseando anuncios de Gemini, usando fallback de conversión');
    }
  }

  // Fallback de alta conversión para Chile/Latam
  return {
    headlines: [
      `¿Cansado de buscar ${info.queVende} de calidad en Chile? Descubre ${info.nombre}.`,
      `El secreto que las grandes marcas no quieren que sepas sobre ${info.queVende}.`,
      `Compra con confianza: Envíos garantizados y pago seguro con MercadoPago.`,
      `Últimos cupos con precio de lanzamiento: Renueva hoy y nota la diferencia.`,
      `Por qué más de 500 clientes en todo el país ya eligieron a ${info.nombre}.`
    ],
    copys: [
      `🚨 ATENCIÓN CHILE: Si estás buscando ${info.queVende}, no cometas el error de comprar sin ver esto primero.\n\nEn ${info.nombre} creamos la solución definitiva pensando en tu comodidad y presupuesto.\n\n✅ Calidad certificada\n✅ Despacho rápido a todo Chile\n✅ Pagos seguros en cuotas sin interés con MercadoPago y Transferencia\n\n👉 Haz clic en el botón de abajo y pide el tuyo antes de que se agote el stock disponible.`,
      `¿Te ha pasado que compras algo y no dura ni un mes? A nosotros también nos pasó. 😤\n\nPor eso en ${info.nombre} nos obsesionamos con ofrecerte ${info.queVende} que realmente supere tus expectativas.\n\nSin letra chica ni sorpresas desagradables.\n\n📲 Toca 'Más información' y consulta directamente con nuestro equipo por WhatsApp.`,
      `Transforma tu día a día con lo mejor en ${info.rubro}. ✨\n\nNo dejes para mañana lo que puedes solucionar hoy con ${info.nombre}.\n\n🔥 Promoción de la semana activa hasta las 23:59 hrs.\n\n👇 Presiona el enlace y obtén atención inmediata.`,
      `La solución probada que estabas esperando en ${info.rubro}.\n\nDiseñado especialmente para quienes valoran su tiempo y buscan resultados reales con ${info.queVende}.\n\n💳 Paga en hasta 6 cuotas con MercadoPago o transferencia bancaria directa.\n\n¡Haz tu pedido en línea en menos de 2 minutos!`,
      `Miles de personas ya lo comprobaron. Ahora es tu turno. 🌟\n\nDescubre por qué ${info.nombre} es la opción preferida en ${info.rubro}.\n\n📦 Envío con número de seguimiento directo a tu teléfono.\n\n👉 Clic aquí para ver catálogo completo y precios.`
    ],
    conceptosVisuales: [
      `Foto dividida estilo 'Antes vs Después' mostrando el problema común versus la solución de ${info.nombre}.`,
      `Primer plano del producto (${info.queVende}) sobre fondo neutro con badge circular: 'Envío a todo Chile 🇨🇱'.`,
      `Captura de pantalla de chat de WhatsApp con reseña de 5 estrellas de un cliente chileno real.`,
      `Composición publicitaria minimalista con tipografía de alto contraste: 'Calidad que se nota'.`,
      `Foto lifestyle del cliente utilizando el servicio/producto con expresión de alivio y satisfacción.`
    ],
    guionesVideo: [
      {
        titulo: "El Mito vs La Realidad (Gancho de Curiosidad)",
        duracion: "40 segundos",
        plantillaCapCutRecomendada: "CapCut Trend: 'Wait for it - Beat Zoom Cut' (Gratis en app CapCut)",
        busquedaPexelsGratis: `Pexels Search: '${info.rubro} lifestyle' o 'happy customer'`,
        secciones: [
          { tiempo: "0-3 seg", audio: "¡Para de hacer esto si quieres comprar " + info.queVende + "!", video: "Tú frente a cámara apuntando al lente o haciendo gesto de alto con la mano." },
          { tiempo: "3-15 seg", audio: "El 90% de la gente comete el error de irse por lo más barato y termina perdiendo tiempo y plata.", video: "Muestra un producto roto o mala experiencia con cara de frustración." },
          { tiempo: "15-30 seg", audio: "En " + info.nombre + " cambiamos las reglas: calidad garantizada, atención por WhatsApp en minutos y envíos seguros.", video: "Transición rápida mostrando tu producto impecable en mano o en uso." },
          { tiempo: "30-40 seg", audio: "Toca el link del perfil y llévate el tuyo hoy antes de que suba de precio.", video: "Texto en pantalla: 'Link en Bio 📲' señalando hacia abajo." }
        ]
      },
      {
        titulo: "Unboxing y Detrás de Escena con Celular",
        duracion: "35 segundos",
        plantillaCapCutRecomendada: "CapCut: 'Aesthetic Vlog / ASMR Packaging' (Gratis)",
        busquedaPexelsGratis: "Pexels Search: 'packing order shipping box'",
        secciones: [
          { tiempo: "0-3 seg", audio: "Acompáñame a preparar el pedido más grande del día en " + info.nombre + ".", video: "Toma cenital (desde arriba) de la mesa de empaque colocando la caja." },
          { tiempo: "3-15 seg", audio: "Este cliente nos pidió " + info.queVende + " y le agregamos un regalo sorpresa por ser su primera compra.", video: "Colocando el producto cuidadosamente con papel seda y sticker de la marca." },
          { tiempo: "15-28 seg", audio: "Sellamos con cinta de seguridad, rotulamos para Starken/Chilexpress y listo para despegar.", video: "Sonido ASMR de la cinta de embalaje y etiqueta de despacho." },
          { tiempo: "28-35 seg", audio: "¿Quieres que el próximo paquete lleve tu nombre? Escríbenos al WhatsApp.", video: "Tú sonriendo levantando la caja lista." }
        ]
      },
      {
        titulo: "Respondiendo la pregunta más frecuente",
        duracion: "30 segundos",
        plantillaCapCutRecomendada: "CapCut: 'Green Screen Q&A Talking Head' (Gratis)",
        busquedaPexelsGratis: "Pexels Search: 'customer service phone'",
        secciones: [
          { tiempo: "0-3 seg", audio: "'¿Oye, pero de verdad hacen envíos a todo Chile y es seguro?'", video: "Pantalla verde con captura del comentario de un seguidor de Instagram." },
          { tiempo: "3-15 seg", audio: "¡Totalmente! Despachamos todos los días desde Arica a Punta Arenas con número de seguimiento.", video: "Tú explicando con energía y mostrando la pantalla del computador con los despachos." },
          { tiempo: "15-25 seg", audio: "Además puedes pagar con tarjeta por MercadoPago o por transferencia bancaria.", video: "Muestra los logos de MercadoPago y bancos en pantalla." },
          { tiempo: "25-30 seg", audio: "Déjanos tu duda en los comentarios y te respondemos en el siguiente video.", video: "CTA con llamada a comentar." }
        ]
      }
    ]
  };
}

// 4. CLOSER DE VENTAS CON IA (OPTIMIZADO PARA CERRAR TRATOS EN LATAM)
export async function runSalesCloserAI(params: {
  mensajeCliente: string;
  historial?: Array<{ emisor: 'cliente' | 'asistente'; texto: string }>;
  nombreNegocio: string;
  catalogoYPrecios: string;
  politicasEnvio?: string;
  enlacePagoMercadoPago?: string;
  whatsappVentas?: string;
}) {
  const systemPrompt = `Eres el CLOSER DE VENTAS ESTRELLA de "${params.nombreNegocio}".
Tu único y exclusivo objetivo es guiar al prospecto con amabilidad, empatía y técnica de ventas para concretar la compra en el menor número de mensajes posibles.
Pautas de tu personalidad:
1. Habla en español latino cálido y natural (usa modismos sutiles y respetuosos como '¡Hola! Qué gusto saludarte', 'por supuesto', 'te cuento').
2. NUNCA respondas con rodeos innecesarios. Sé conciso y claro.
3. Si el cliente pregunta precio, responde el precio con el valor agregado antes de dar la cifra.
4. Siempre termina con una pregunta de cierre (Técnica de doble alternativa: "¿Prefieres que te lo enviemos a domicilio o prefieres retiro?", "¿Te acomoda pagar con transferencia o tarjeta de crédito?").
5. Si el cliente está listo para comprar, dale el enlace de pago directo o indícale que confirme para pasarle los datos de transferencia.
6. Tu catálogo y reglas son:
${params.catalogoYPrecios}
${params.politicasEnvio ? `Políticas de envío: ${params.politicasEnvio}` : 'Envíos rápidos a todo Chile.'}`;

  const prompt = `Historial previo:
${params.historial?.map(h => `${h.emisor}: ${h.texto}`).join('\n') || 'Primer mensaje'}

Nuevo mensaje del cliente: "${params.mensajeCliente}"

Responde como el Closer de Ventas de la empresa:`;

  const geminiResponse = await callGemini(prompt, systemPrompt);
  if (geminiResponse) {
    return geminiResponse.trim();
  }

  // Fallback inteligente para el Closer
  const msgLower = params.mensajeCliente.toLowerCase();
  if (msgLower.includes('precio') || msgLower.includes('cuanto') || msgLower.includes('vale')) {
    return `¡Hola! Qué gusto saludarte. 🙌 Te cuento: nuestro catálogo cuenta con opciones diseñadas para darte la mejor calidad garantizada. Para darte el valor exacto, ¿buscas el producto para uso personal o para tu negocio? ¿Te gustaría entrega a domicilio o retiro?`;
  }
  if (msgLower.includes('pago') || msgLower.includes('comprar') || msgLower.includes('transferencia')) {
    return `¡Excelente elección! Puedes pagar con total tranquilidad a través de MercadoPago (hasta en cuotas con tarjeta) o por transferencia bancaria directa a nuestra Cuenta del Banco Estado. ¿Cuál medio de pago te resulta más cómodo para enviarte los datos en este instante? 📲`;
  }
  if (msgLower.includes('envio') || msgLower.includes('despacho') || msgLower.includes('santiago') || msgLower.includes('region')) {
    return `¡Hacemos despachos rápidos a todo el país! 📦 En Santiago entregamos entre 24 a 48 hrs y a regiones vía Starken / Chilexpress con número de seguimiento directo a tu WhatsApp. ¿A qué comuna o ciudad te gustaría recibirlo?`;
  }

  return `¡Hola! Con mucho gusto te asesoro. En ${params.nombreNegocio} estamos atentos para ayudarte a elegir la mejor opción. Cuéntame, ¿qué modelo o detalle específico te gustaría conocer para ayudarte a resolverlo hoy mismo? 😊`;
}

// 5. REESCRITURA CON FEEDBACK (USADO POR TELEGRAM BOT Y PANEL)
export async function rewritePostWithFeedback(originalText: string, userFeedback: string): Promise<string> {
  const prompt = `Eres un copywriter senior. El usuario solicita corregir el siguiente post de redes sociales:

POST ORIGINAL:
"""
${originalText}
"""

FEEDBACK DE CORRECCIÓN DEL DUEÑO:
"${userFeedback}"

Reescribe el post aplicando exactamente lo solicitado, manteniendo gancho llamativo, cuerpo persuasivo, llamado a la acción claro y hashtags relevantes en español.
Devuelve ÚNICAMENTE el nuevo texto del post:`;

  const response = await callGemini(prompt);
  if (response) return response.trim();

  return `[Versión Corregida con tu indicación: "${userFeedback}"]\n\n${originalText}\n\n👉 ¡Escríbenos ahora mismo y aprovecha esta oportunidad exclusiva!`;
}
