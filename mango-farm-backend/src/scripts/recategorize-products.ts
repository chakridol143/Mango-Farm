import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Tidy the catalog taxonomy so every product belongs to one clean, consistent
// category (and the storefront filter tabs look intentional). The 5 categories are
// reshaped to actually fit the 9 products: "Mango Pickles" (no products) becomes
// "Pantry & Gourmet" (jam / honey / tea). Both category_id AND the category_name /
// category string are set, because the Shop filters by the string.

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
const PRODUCTS = process.env.FIREBASE_PRODUCTS_COLLECTION || 'products';
const CATEGORIES = process.env.FIREBASE_CATEGORIES_COLLECTION || 'categories';

type CategoryDef = {
  category_id: number;
  name: string;
  slug: string;
  image_url: string;
  description: string;
  sort_order: number;
};

const CATEGORY_DEFS: CategoryDef[] = [
  { category_id: 1, name: 'Fresh Mangoes', slug: 'fresh-mangoes', sort_order: 1,
    image_url: '/assets/images/fresh_mango.png',
    description: 'Sun-ripened, hand-picked Banganapalle & Alphonso mangoes, shipped fresh from our orchards.' },
  { category_id: 2, name: 'Mango Pulp', slug: 'mango-pulp', sort_order: 2,
    image_url: '/assets/images/products/mango_puree.png',
    description: '100% pure mango pulp & puree — no added sugar. Perfect for smoothies, desserts and cooking.' },
  { category_id: 3, name: 'Dried Mango', slug: 'dried-mango', sort_order: 3,
    image_url: '/assets/images/dried_mango.png',
    description: 'Naturally sun-dried mango — chewy, sweet and guilt-free snacking all year round.' },
  { category_id: 4, name: 'Pantry & Gourmet', slug: 'pantry-gourmet', sort_order: 4,
    image_url: '/assets/images/products/orchard_honey.png',
    description: 'Artisan mango jam, orchard honey and mango-leaf tea — gourmet treats from the grove.' },
  { category_id: 5, name: 'Gift Boxes', slug: 'gift-boxes', sort_order: 5,
    image_url: '/assets/images/products/royale_box.png',
    description: 'Beautifully curated mango hampers — the perfect gift for every occasion.' },
];

// product_id -> category_id
const PRODUCT_CATEGORY: Record<number, number> = {
  1: 1,    // Alphonso Premium Box      -> Fresh Mangoes
  2: 4,    // Artisan Mango Jam         -> Pantry & Gourmet
  3: 1,    // Sliced Mango Platter      -> Fresh Mangoes
  4: 1,    // Farm Fresh Harvest        -> Fresh Mangoes
  5001: 5, // Banganapalle Royale Box   -> Gift Boxes
  5002: 2, // Golden Mango Puree        -> Mango Pulp
  5003: 3, // Sun-Dried Mango Jewels    -> Dried Mango
  5004: 4, // Mango Orchard Honey       -> Pantry & Gourmet
  5005: 4, // Mango Leaf & Green Tea    -> Pantry & Gourmet
};

const defById = new Map(CATEGORY_DEFS.map((d) => [d.category_id, d]));

async function run() {
  // 1) Reshape category docs (match by category_id field; works regardless of doc id).
  const catSnap = await db.collection(CATEGORIES).get();
  const seen = new Set<number>();
  let catUpdated = 0;
  for (const doc of catSnap.docs) {
    const id = Number(doc.data().category_id);
    const def = defById.get(id);
    if (!def) continue;
    seen.add(id);
    await doc.ref.set(
      { category_id: def.category_id, name: def.name, slug: def.slug,
        description: def.description, image_url: def.image_url, sort_order: def.sort_order,
        updated_at: admin.firestore.Timestamp.now() },
      { merge: true }
    );
    catUpdated += 1;
  }
  // Create any category def missing from the collection.
  for (const def of CATEGORY_DEFS) {
    if (seen.has(def.category_id)) continue;
    await db.collection(CATEGORIES).doc(`category-${def.category_id}`).set(
      { ...def, updated_at: admin.firestore.Timestamp.now() },
      { merge: true }
    );
    catUpdated += 1;
  }
  console.log(`Categories updated: ${catUpdated}`);

  // 2) Assign each product its category (id + name + slug + string).
  const prodSnap = await db.collection(PRODUCTS).get();
  let prodUpdated = 0;
  for (const doc of prodSnap.docs) {
    const pid = Number(doc.data().product_id);
    const catId = PRODUCT_CATEGORY[pid];
    if (!catId) continue;
    const def = defById.get(catId)!;
    await doc.ref.set(
      { category_id: def.category_id, category_name: def.name,
        category: def.name, category_slug: def.slug,
        updated_at: admin.firestore.Timestamp.now() },
      { merge: true }
    );
    prodUpdated += 1;
    console.log(`  ✓ ${doc.id} (pid ${pid}) -> ${def.name}`);
  }
  console.log(`Products recategorized: ${prodUpdated}`);
}

run()
  .catch((err) => { console.error('RECATEGORIZE ERROR:', err); process.exit(1); })
  .finally(() => process.exit(0));
