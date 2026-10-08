/**
 * Publicador Automático Oficial para Meta Graph API (Instagram & Facebook).
 * Utiliza los endpoints oficiales 100% gratuitos de Meta para publicar contenido
 * diario sin necesidad de pagar plataformas como Buffer o Hootsuite.
 */

const META_PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN;
const META_FACEBOOK_PAGE_ID = process.env.META_FACEBOOK_PAGE_ID;
const META_INSTAGRAM_ACCOUNT_ID = process.env.META_INSTAGRAM_ACCOUNT_ID;

export interface PublishResult {
  success: boolean;
  network: 'instagram' | 'facebook';
  postId?: string;
  error?: string;
  mock?: boolean;
}

/**
 * Publica una imagen con copy en Instagram Business / Creator
 * utilizando la Content Publishing API oficial de Instagram.
 */
export async function publishToInstagram(params: {
  imageUrl: string;
  caption: string;
}): Promise<PublishResult> {
  const { imageUrl, caption } = params;

  if (
    !META_PAGE_ACCESS_TOKEN ||
    !META_INSTAGRAM_ACCOUNT_ID ||
    META_PAGE_ACCESS_TOKEN.includes('EAAG...') ||
    META_INSTAGRAM_ACCOUNT_ID.includes('12345')
  ) {
    console.log('[META MOCK] Publicación automática simulada en Instagram:', {
      imageUrl,
      caption: caption.slice(0, 100) + '...',
    });
    return {
      success: true,
      network: 'instagram',
      postId: `mock_ig_${Date.now()}`,
      mock: true,
    };
  }

  try {
    // Paso 1: Crear el contenedor de medios en Instagram
    const containerRes = await fetch(
      `https://graph.facebook.com/v19.0/${META_INSTAGRAM_ACCOUNT_ID}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: caption,
          access_token: META_PAGE_ACCESS_TOKEN,
        }),
      }
    );

    const containerData = await containerRes.json();
    if (!containerRes.ok || !containerData.id) {
      console.error('Error creando contenedor en Instagram:', containerData);
      return {
        success: false,
        network: 'instagram',
        error: containerData.error?.message || 'Error creando contenedor en Instagram',
      };
    }

    const creationId = containerData.id;

    // Paso 2: Publicar el contenedor en el feed de Instagram
    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${META_INSTAGRAM_ACCOUNT_ID}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: META_PAGE_ACCESS_TOKEN,
        }),
      }
    );

    const publishData = await publishRes.json();
    if (!publishRes.ok || !publishData.id) {
      console.error('Error publicando en Instagram:', publishData);
      return {
        success: false,
        network: 'instagram',
        error: publishData.error?.message || 'Error publicando contenedor en Instagram',
      };
    }

    return {
      success: true,
      network: 'instagram',
      postId: publishData.id,
    };
  } catch (err: any) {
    console.error('Excepción publicando en Instagram:', err);
    return {
      success: false,
      network: 'instagram',
      error: err.message,
    };
  }
}

/**
 * Publica una foto y texto en una Página de Facebook Oficial.
 */
export async function publishToFacebookPage(params: {
  imageUrl: string;
  message: string;
}): Promise<PublishResult> {
  const { imageUrl, message } = params;

  if (
    !META_PAGE_ACCESS_TOKEN ||
    !META_FACEBOOK_PAGE_ID ||
    META_PAGE_ACCESS_TOKEN.includes('EAAG...') ||
    META_FACEBOOK_PAGE_ID.includes('12345')
  ) {
    console.log('[META MOCK] Publicación automática simulada en Facebook Page:', {
      imageUrl,
      message: message.slice(0, 100) + '...',
    });
    return {
      success: true,
      network: 'facebook',
      postId: `mock_fb_${Date.now()}`,
      mock: true,
    };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${META_FACEBOOK_PAGE_ID}/photos`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: imageUrl,
          message: message,
          access_token: META_PAGE_ACCESS_TOKEN,
        }),
      }
    );

    const data = await res.json();
    if (!res.ok || !data.id) {
      console.error('Error publicando en Facebook Page:', data);
      return {
        success: false,
        network: 'facebook',
        error: data.error?.message || 'Error publicando foto en Facebook',
      };
    }

    return {
      success: true,
      network: 'facebook',
      postId: data.id,
    };
  } catch (err: any) {
    console.error('Excepción publicando en Facebook:', err);
    return {
      success: false,
      network: 'facebook',
      error: err.message,
    };
  }
}
