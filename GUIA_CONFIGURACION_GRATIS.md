# 📋 CHECKLIST OFICIAL DE CONFIGURACIÓN $0 COSTO — SEGAR AI MARKETING

Esta guía contiene el paso a paso exacto para obtener todas las credenciales y accesos **100% GRATIS** sin pagar mensualidades ni suscripciones.

---

## 1. 🤖 Cómo Crear tu Bot de Telegram en @BotFather (100% Gratis e Ilimitado)

Telegram ofrece su API de bots de forma totalmente gratuita y sin límites de mensajes.

### Pasos:
1. Abre tu aplicación de **Telegram** en el celular o computador.
2. En el buscador de Telegram, busca el usuario oficial verificado: **`@BotFather`** (tiene insignia azul de verificación).
3. Presiona el botón **Iniciar** o escribe `/start`.
4. Escribe el comando: `/newbot`.
5. BotFather te pedirá un **nombre para tu bot** (ej: `Segar Marketing Asistente`).
6. Luego te pedirá un **username único** que termine en `bot` (ej: `segar_marketing_chile_bot`).
7. BotFather te responderá con tu **HTTP API TOKEN** (se ve así: `7123456789:AAH...`).
8. Copia ese token y pégalo en tu archivo `.env.local` en:
   ```env
   TELEGRAM_BOT_TOKEN=7123456789:AAH...
   ```
9. **Obtener tu Chat ID personal:**
   - En Telegram busca el bot **`@userinfobot`** y dale a `/start`.
   - Te responderá con tu `Id` numérico (ej: `123456789`).
   - Pégalo en tu `.env.local`:
     ```env
     TELEGRAM_ADMIN_CHAT_ID=123456789
     ```
10. **Activar el Webhook de Segar AI:**
    - Una vez desplegado tu proyecto en Vercel o con un dominio público (ej: `https://tu-dominio.com`), abre esta URL en tu navegador:
      ```
      https://api.telegram.org/bot<TU_TELEGRAM_BOT_TOKEN>/setWebhook?url=https://tu-dominio.com/api/telegram/webhook
      ```
    - Recibirás: `{"ok":true,"result":true,"description":"Webhook was set"}`. ¡Listo! Ya recibes posts para aprobar en tu celular.

---

## 2. ⚡ Cómo Sacar tu Gemini API Key Gratis (1.500 llamadas/día sin costo)

Google ofrece el **AI Studio Free Tier** con acceso completo a `gemini-2.0-flash` y `gemini-1.5-flash` a $0 USD.

### Pasos:
1. Ingresa a: **[Google AI Studio](https://aistudio.google.com/)**.
2. Inicia sesión con cualquier cuenta de Google (Gmail).
3. En la esquina superior izquierda o en el menú lateral, haz clic en **"Get API key"** (Obtener clave de API).
4. Haz clic en el botón azul **"Create API key"**.
5. Selecciona "Create API key in new project" (Crear clave de API en un proyecto nuevo).
6. Copia la clave generada (empieza con `AIzaSy...`).
7. Pégala en tu archivo `.env.local`:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```
> 💡 **Nota de Costo $0:** No agregues tarjeta de crédito ni habilites facturación en Google Cloud. El plan gratuito no te cobrará nada y corta el servicio si superas las 15 llamadas por minuto en vez de facturar.

---

## 3. 💳 Cómo Sacar tus Credenciales de Flow.cl Gratis ($0 Costo Fijo)

**Flow.cl** es la pasarela de pagos chilena por excelencia para cobrar con **Webpay Plus (Débito y Crédito en cuotas), Mach, Servipag, Banco Estado y Cryptos**. No cobra costo de instalación ni mensualidad fija, solo comisión por venta concretada.

### Pasos:
1. Ingresa a: **[Flow.cl](https://www.flow.cl/)**.
2. Haz clic en **"Crear Cuenta"** (puedes registrarte como persona natural o como empresa con RUT).
3. Una vez dentro de tu panel de Flow, ve al menú superior derecho -> **"Mis Datos"** o **"Seguridad / API Keys"**.
4. Encontrarás tus credenciales de integración:
   - **API Key** (Identificador público)
   - **Secret Key** (Clave secreta de firma HMAC-SHA256)
5. Pégalas en tu archivo `.env.local` (o variables de entorno de Vercel):
   ```env
   FLOW_API_KEY=tu-api-key-de-flow
   FLOW_SECRET_KEY=tu-secret-key-de-flow
   FLOW_ENV=production
   ```
6. **Configurar el Webhook de Confirmación:**
   - La pasarela ya tiene configurada la URL de confirmación automática en el código hacia:
     `https://tu-dominio.com/api/webhooks/flow`
   - Cuando un cliente pague con Webpay o Mach, Flow notificará a ese endpoint y Segar AI activará la membresía del cliente al instante.
7. *Para pruebas (opcional):* Si quieres probar antes de pasar a producción, puedes crear una cuenta gratuita en **[Sandbox Flow](https://sandbox.flow.cl/)** y configurar `FLOW_ENV=sandbox`.

---

## 4. 💬 Qué Crear en developers.facebook.com (WhatsApp Cloud API & Meta Graph)

Meta regala **1.000 conversaciones iniciadas por usuarios al mes** a través de la API oficial de WhatsApp Cloud.

### Pasos:
1. Entra a: **[Meta for Developers](https://developers.facebook.com/)**.
2. Inicia sesión con tu perfil de Facebook.
3. En la esquina superior derecha, haz clic en **"Mis Apps"** (My Apps) -> **"Crear App"** (Create App).
4. Selecciona el tipo de caso de uso: **"Negocio"** (Business) o **"Otro"**.
5. Asigna un nombre a la app (ej: `Segar Closer Bot`) y vincula tu cuenta de Meta Business Manager (gratis).
6. En el panel de la aplicación, busca el producto **"WhatsApp"** y haz clic en **"Configurar"** (Set up).
7. Meta te asignará automáticamente un **número de prueba** y un **Token de Acceso Temporal**:
   - Copia el **Phone number ID**.
   - Copia el **WhatsApp Business Account ID**.
8. Pégalos en `.env.local`:
   ```env
   WHATSAPP_PHONE_NUMBER_ID=123456789012345
   WHATSAPP_ACCESS_TOKEN=EAAG...
   ```
9. **Configurar el Webhook en Meta:**
   - En el menú lateral de WhatsApp -> **"Configuración"** (Configuration) -> **"Webhook"**.
   - Callback URL: `https://tu-dominio.com/api/webhooks/meta`
   - Verify Token: `segar_marketing_meta_verify_token_2026` (el mismo valor que pusiste en tu `.env.local`).
   - Suscríbete al campo: **`messages`**.
   - Ahora, cada vez que un prospecto escriba a tu WhatsApp, el webhook de Segar AI recibirá el mensaje y el Closer responderá guiando a la venta.

---

## 5. 🔥 Firebase Spark Plan ($0 Costo - Base de Datos & Auth)

1. Ve a: **[Firebase Console](https://console.firebase.google.com/)**.
2. Haz clic en **"Crear un proyecto"** (selecciona el plan **Spark** - Free).
3. Ve a **Firestore Database** -> **Crear base de datos** (en modo producción o prueba).
4. Ve a **Authentication** -> **Comenzar** -> Habilita **Email/Contraseña** y **Google**.
5. En la configuración del proyecto (icono de engranaje) -> **General** -> En "Tus apps", crea una **Web App** `</>`.
6. Copia los valores del objeto `firebaseConfig` y colócalos en `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   ```

---

## 🚀 ¡Resumen de Costos Fijos Mensuales!

- Servidor web (Vercel / Firebase Hosting): **$0 / mes**
- Base de datos (Firestore Spark): **$0 / mes**
- IA Textos (Gemini 2.0 Flash Free Tier): **$0 / mes**
- IA Fotos (Pollinations.ai): **$0 / mes**
- Bot de Aprobación (Telegram Bot API): **$0 / mes**
- Closer de Ventas (WhatsApp Cloud API 1.000 conv): **$0 / mes**
- **TOTAL COSTO FIJO:** **$0 CLP / $0 USD al mes.**
