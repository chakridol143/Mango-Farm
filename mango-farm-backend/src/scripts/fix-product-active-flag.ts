import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Data-integrity fix: some product docs stored `is_active` as the number 1 instead
// of the boolean true. The catalog query uses where("is_active", "==", true), and
// Firestore equality is strictly typed, so 1 !== true — those products silently
// disappear from the storefront. This normalizes is_active to a real boolean.

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
const COLL = process.env.FIREBASE_PRODUCTS_COLLECTION || 'products';

// Coerce any "truthy" representation (1, "1", "true", true) to boolean true; else false.
function toBool(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (value === undefined || value === null || value === '') return true; // default active
  const s = String(value).trim().toLowerCase();
  return s === '1' || s === 'true' || s === 'yes';
}

async function run() {
  const snap = await db.collection(COLL).get();
  console.log(`Scanning ${snap.size} product docs in "${COLL}"…`);
  let updated = 0;

  for (const doc of snap.docs) {
    const raw = doc.data().is_active;
    if (typeof raw === 'boolean') continue; // already correct
    const next = toBool(raw);
    await doc.ref.update({ is_active: next });
    updated += 1;
    console.log(`  ✓ ${doc.id}: is_active ${JSON.stringify(raw)} (${typeof raw}) -> ${next}`);
  }

  console.log(`Done. Normalized ${updated} product(s).`);
}

run()
  .catch((err) => {
    console.error('FIX ACTIVE FLAG ERROR:', err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
