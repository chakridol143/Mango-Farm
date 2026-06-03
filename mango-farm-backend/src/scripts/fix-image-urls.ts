import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { join } from 'path';

// One-off (re-runnable) migration: rewrite any absolute localhost/127.0.0.1 image
// URLs stored on products into domain-relative paths (e.g.
// "http://localhost:5173/images/box.png" -> "/images/box.png") so they resolve
// against whatever host serves the frontend in development AND production.

dotenv.config({ path: join(__dirname, '../../.env') });

const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

if (!privateKey) {
  console.error('FIREBASE_PRIVATE_KEY missing in .env');
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

const db = admin.firestore();
const PRODUCTS_COLLECTION = process.env.FIREBASE_PRODUCTS_COLLECTION || 'products';

const IMAGE_FIELDS = [
  'image_url', 'image_url1', 'image_url2', 'image_url3', 'image_url4', 'image_url5',
  'image_url6', 'image_url7', 'image_url8', 'image_url9', 'image_url10',
];

// Returns a domain-relative path if the value is an absolute localhost URL, else null.
function toRelative(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const match = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(\/.*)?$/i.exec(trimmed);
  if (!match) return null; // not a localhost absolute URL → leave it alone
  return match[1] || '/';
}

async function run() {
  const snap = await db.collection(PRODUCTS_COLLECTION).get();
  console.log(`Scanning ${snap.size} product docs in "${PRODUCTS_COLLECTION}"…`);
  let updated = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const patch: Record<string, string> = {};
    for (const field of IMAGE_FIELDS) {
      const relative = toRelative(data[field]);
      if (relative !== null && relative !== data[field]) {
        patch[field] = relative;
      }
    }
    if (Object.keys(patch).length) {
      await doc.ref.update(patch);
      updated += 1;
      console.log(`  ✓ ${doc.id}:`, patch);
    }
  }

  console.log(`Done. Updated ${updated} product(s).`);
}

run()
  .catch((err) => {
    console.error('FIX IMAGE URLS ERROR:', err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
