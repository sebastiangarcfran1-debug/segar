# 🚀 SEGAR AI MARKETING — Arquitectura $0 USD & Blueprint de Lanzamiento

**SEGAR AI MARKETING** es una plataforma SaaS diseñada para operar al 100% dentro de los límites gratuitos (*Free Tiers generosos*) de los proveedores más estables del mercado tecnológico actual. Ningún costo fijo mensual antes de facturar.

---

## 🏗️ 1. Matriz de Costo Cero ($0/mes)

| Componente | Proveedor / Servicio | Plan / Free Tier | Costo Fijo | Límite Gratuito |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend & API** | Next.js 14 + Vercel / Firebase Hosting | Hobby / Spark | **$0** | 100GB ancho de banda, hosting SSL ilimitado |
| **Base de Datos** | Firebase Cloud Firestore | Spark Free Plan | **$0** | 50.000 lecturas/día, 20.000 escrituras/día, 1GB data |
| **Autenticación** | Firebase Authentication | Spark Free Plan | **$0** | Hasta 50.000 usuarios activos mensuales (MAU) |
| **IA Textos y Diagnósticos** | Google Gemini API (`gemini-2.0-flash` / `gemini-1.5-flash`) | AI Studio Free Tier | **$0** | 15 peticiones por minuto (RPM), 1.500 al día (suficiente para ~50 clientes activos iniciales) |
| **IA Generación Gráfica** | Pollinations.ai API + Gemini Imagen | API Abierta sin API Key | **$0** | Ilimitado para prompts en cola, generación rápida SDXL/Flux |
| **Guiones & Recursos Video** | Pexels API + Plantillas CapCut Mobile/Web | Cuenta gratuita de Pexels | **$0** | 200 llamadas/hora, banco libre de royalties |
| **Pasarela de Cobros** | Mercado Pago Checkout Pro + Webhooks | Modelo Comisiones | **$0 fijo** | 0 mensualidad. Solo comisión por transacción exitosa (~3.19% + IVA en Chile) |
| **Cobro Alternativo** | Transferencia Bancaria Manual + WhatsApp | Directo a Banco Estado / Cuenta RUT / Santander | **$0** | 0% comisión, activación manual desde SuperAdmin o Bot |
| **Bot de Aprobación** | Telegram Bot API | BotFather Oficial | **$0** | Ilimitado para mensajes interactivos y botones inline |
| **Mensajería Omnicanal** | WhatsApp Cloud API + Meta Graph API | Meta for Developers | **$0** | 1.000 conversaciones iniciadas por usuarios/mes gratis |
| **Generación de Reportes** | jsPDF + HTML2Canvas (Cliente) | Client-side Open Source | **$0** | 0 recursos de servidor consumidos |

---

## 📐 2. Arquitectura del Sistema

```
[ Cliente Final / Pyme ]
          │
          ▼
   [ Next.js 14 App Router + Tailwind UI ]
          │
   ┌──────┴─────────────────────────────────────────┐
   │                                                │
[ Landing & Planes ]                      [ Dashboard Pyme / Admin ]
   │                                                │
   ├── MercadoPago Checkout                         ├── 1. Diagnóstico 360 & PDF
   │   └── Webhook -> Firestore                    ├── 2. Generador 30 Posts (Gemini + Pollinations)
   ├── Transferencia Manual -> WhatsApp             ├── 3. Creador de Anuncios + Guiones Video
   │                                                ├── 4. Closer de Ventas IA (Meta / WhatsApp)
   │                                                └── 5. Modo Agencia (Autoventa Segar)
   │
   ▼
[ Firebase Cloud Firestore & Auth ]
   │
   ├── /users/{uid} ─── (rol, plan, créditos usados, fecha expiración)
   ├── /onboardings/{uid} ─── (rubro, bio, Instagram, diagnóstico generado)
   ├── /posts/{postId} ─── (copys, imagenURL, estado: borrador/aprobado/publicado)
   ├── /closer_conversations/{chatId} ─── (historial clientes, contexto del negocio)
   └── /system_config/referrals ─── (link referido, recompensas)
          │
          ▼
[ Telegram Bot (Segar Control Bot) ]
   ├── Notifica: "Nuevo post generado para [Empresa]"
   └── Botones: [✅ Aprobar y Publicar] [✏️ Corregir con IA] [❌ Descartar]
```

---

## 🔒 3. Estrategia Antiquiebra (Control de Créditos)

Para garantizar que el Free Tier de Gemini nunca se exceda, el sistema implementa **cuotas duras** almacenadas en Firestore por cada ciclo de 30 días:

- **Plan Emprendedor ($15.000 CLP / ~$17 USD):**
  - 30 posts mensuales (1 por día)
  - 5 sets de anuncios (25 copys/headlines + 15 guiones)
  - 200 respuestas automáticas del Closer IA
- **Plan Pro ($29.900 CLP / ~$33 USD):**
  - 100 posts mensuales
  - 15 sets de anuncios
  - 1.000 respuestas del Closer IA
- **Plan Agencia ($59.900 CLP / ~$67 USD):**
  - Hasta 3 marcas simultáneas
  - 300 posts mensuales
  - Respuestas Closer IA ampliadas (3.000/mes)

---

## 🎯 4. Plan de Acción y Despliegue Inmediato

1. **Estructura Base**: Next.js 14 con TypeScript, Tailwind, Lucide React y Firebase SDK.
2. **Pasarela Mercado Pago**: Rutas `/api/checkout/mercadopago` y webhook seguro `/api/webhooks/mercadopago`.
3. **Flujo de Transferencia Bancaria**: Generador de comprobante con enlace directo a WhatsApp pre-llenado con mensaje de confirmación y RUT.
4. **Fábrica de Contenido**: Endpoint de Gemini 2.0 Flash con prompts en español chileno/latino adaptados a ventas directas + URLs dinámicas de Pollinations.ai.
5. **Bot de Telegram**: Integración completa con webhook y callbacks interactivos para aprobar/rechazar o pedir correcciones automáticas.
6. **Módulo Closer de Ventas**: Simulador de Inbox unificado e integración directa con WhatsApp Cloud API / Meta Graph API con memoria de catálogo.
7. **Modo Agencia & Referidos**: Generador de autoventa para conseguir las primeras 250 suscripciones sin gastar $1 en anuncios.
8. **Super Admin Dashboard**: Métricas de MRR, activación manual de pagos por transferencia y control de consumo.
