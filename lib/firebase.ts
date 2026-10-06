/**
 * Conector de Firebase Spark Plan (100% Gratis).
 * Utiliza la API REST nativa de Google Firebase / Firestore para 0 dependencias pesadas
 * y máximo rendimiento tanto en Vercel como en Firebase Hosting.
 */

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'segar-ai-marketing';
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export async function firestoreGetDocument(collection: string, docId: string) {
  if (!FIREBASE_API_KEY || FIREBASE_API_KEY.includes('MOCK')) {
    return null;
  }
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${collection}/${docId}?key=${FIREBASE_API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error('Error Firestore REST GET:', e);
    return null;
  }
}

export async function firestoreSetDocument(collection: string, docId: string, fields: Record<string, any>) {
  if (!FIREBASE_API_KEY || FIREBASE_API_KEY.includes('MOCK')) {
    return null;
  }
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${collection}/${docId}?key=${FIREBASE_API_KEY}`;
  try {
    const formattedFields: Record<string, any> = {};
    for (const [key, val] of Object.entries(fields)) {
      if (typeof val === 'string') formattedFields[key] = { stringValue: val };
      else if (typeof val === 'number') formattedFields[key] = { integerValue: val };
      else if (typeof val === 'boolean') formattedFields[key] = { booleanValue: val };
      else formattedFields[key] = { stringValue: JSON.stringify(val) };
    }

    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: formattedFields }),
    });
    return await res.json();
  } catch (e) {
    console.error('Error Firestore REST PATCH:', e);
    return null;
  }
}

export const firebaseConfig = {
  projectId: FIREBASE_PROJECT_ID,
  apiKey: FIREBASE_API_KEY,
};
