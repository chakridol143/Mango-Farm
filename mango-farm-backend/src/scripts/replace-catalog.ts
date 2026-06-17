/**
 * Mango Farm — Replace Catalog
 *
 * DESTRUCTIVE: wipes the existing catalog and replaces it with the 3 real
 * mango varieties currently sold (10 kg boxes, prices incl. GST + transport):
 *
 *   1. Banginpally                       — ₹1200 / 10 kg box
 *   2. Khader (Alphonso of Andhra)        — ₹1400 / 10 kg box
 *   3. Kalepadu (Chittoor district)       — ₹1200 / 10 kg box
 *
 * What it touches (per "full catalog reset"):
 *   - products         → deleted, replaced with the 3 varieties
 *   - categories       → deleted, replaced with a single "Mangoes" category
 *   - combos           → deleted (old ones referenced demo products)
 *   - popular_products → rebuilt from the 3 varieties (doc "main")
 *   - banners          → LEFT UNTOUCHED
 *
 * Safety: DRY RUN by default — prints what it would change and writes nothing.
 * Pass --confirm to actually perform the wipe + seed.
 *
 * Run against PRODUCTION with Railway env injected:
 *   railway run npx ts-node src/scripts/replace-catalog.ts            # preview
 *   railway run npx ts-node src/scripts/replace-catalog.ts --confirm  # apply
 */

import { Timestamp } from "firebase-admin/firestore";
import { firestore } from "../config/firebase";
import {
  getFirestoreCategoriesCollectionName,
  getFirestoreCombosCollectionName,
  getFirestorePopularProductsCollectionName,
  getFirestoreProductsCollectionName,
} from "../config/catalog";

const CONFIRM = process.argv.includes("--confirm") || process.argv.includes("--yes");
const now = Timestamp.now();

const CATEGORY_NAME = "Mangoes";
const CATEGORY_SLUG = "mangoes";
const CATEGORY_ID = 1;
// Existing high-quality assets in the frontend's public/ folder, matched per variety.
const CATEGORY_IMAGE = "/images/hero.png"; // orchard-sunset hero shot

/* ─── The real catalog ─── */
const category = {
  category_id: CATEGORY_ID,
  name: CATEGORY_NAME,
  slug: CATEGORY_SLUG,
  description:
    "Naturally ripened, farm-fresh mangoes from South India — sold by the 10 kg box. All prices include GST and transport.",
  image_url: CATEGORY_IMAGE,
  sort_order: 1,
};

const products = [
  {
    product_id: 1,
    name: "Banginpally Mango — 10 kg Box",
    slug: "banginpally-mango-10kg-box",
    sub_name: "Andhra's Classic",
    description:
      "Banginpally (Benishan) — Andhra Pradesh's most loved table mango. Large, golden-yellow, firm and fibre-free with a clean, honeyed sweetness. Naturally ripened and delivered as a 10 kg box.",
    details:
      "Variety: Banginpally (Benishan)\nOrigin: Andhra Pradesh\nPack: 10 kg box\nRipening: Natural (no carbide)\nPrice includes GST and transport.",
    price: 1200,
    stock_quantity: 100,
    image_url: "/assets/images/products/royale_box.png", // crate labeled "Banganapalle mangoes"
  },
  {
    product_id: 2,
    name: "Khader Mango — 10 kg Box",
    slug: "khader-mango-10kg-box",
    sub_name: "The Alphonso of Andhra",
    description:
      "Khader — known as the Alphonso of Andhra. Rich, intensely aromatic and sweet, with smooth fibre-free flesh. A premium variety, naturally ripened and delivered as a 10 kg box.",
    details:
      "Variety: Khader (Alphonso of Andhra)\nOrigin: Andhra Pradesh\nPack: 10 kg box\nRipening: Natural (no carbide)\nPrice includes GST and transport.",
    price: 1400,
    stock_quantity: 100,
    image_url: "/assets/images/fresh_mango.png", // premium cut-mango hero shot
  },
  {
    product_id: 3,
    name: "Kalepadu Mango — 10 kg Box",
    slug: "kalepadu-mango-10kg-box",
    sub_name: "Chittoor's Specialty",
    description:
      "Kalepadu — a unique variety native to the Chittoor district of Andhra Pradesh. Distinctive flavour, soft juicy flesh and a rich aroma you won't find elsewhere. Naturally ripened and delivered as a 10 kg box.",
    details:
      "Variety: Kalepadu\nOrigin: Chittoor district, Andhra Pradesh\nPack: 10 kg box\nRipening: Natural (no carbide)\nPrice includes GST and transport.",
    price: 1200,
    stock_quantity: 100,
    image_url: "/images/sliced.png", // elegant plated mango slices
  },
  {
    product_id: 4,
    name: "Rumani Mango — 10 kg Box",
    slug: "rumani-mango-10kg-box",
    sub_name: "The Apple Mango",
    description:
      "Rumani (Apple Rumani) — a late-season South Indian variety prized for its distinctive round, apple-like shape and golden-yellow skin. Fibre-free, silky and exceptionally juicy with a refreshing sweet-and-tangy flavour. Naturally ripened and delivered as a 10 kg box.",
    details:
      "Variety: Rumani (Apple Rumani)\nOrigin: South India (Tamil Nadu / Andhra Pradesh)\nPack: 10 kg box\nRipening: Natural (no carbide)\nPrice includes GST and transport.",
    price: 1200,
    stock_quantity: 100,
    image_url: "/assets/images/products/mango-rumani.webp", // real Rumani product photo
  },
];

const popularShowcase = {
  section_id: "main",
  eyebrow: "Season's Finest",
  title: "Our Mango Varieties",
  is_active: true,
  items: products.map((p, i) => ({
    item_id: i + 1,
    name: p.name.replace(" — 10 kg Box", ""),
    tagline: p.sub_name,
    caption: i === 1 ? "Premium" : "Best Seller",
    button_text: "Shop Now",
    link: "/products",
    image_url: p.image_url,
    is_featured: i === 1, // feature Khader (premium)
    is_active: true,
    sort_order: (i + 1) * 10,
  })),
  created_at: now,
};

/* ─── Helpers ─── */
async function wipeCollection(name: string): Promise<number> {
  const snap = await firestore.collection(name).get();
  if (snap.empty) return 0;

  if (CONFIRM) {
    // Chunk deletes to stay under Firestore's 500-op batch limit.
    for (let i = 0; i < snap.docs.length; i += 450) {
      const batch = firestore.batch();
      for (const doc of snap.docs.slice(i, i + 450)) {
        batch.delete(doc.ref);
      }
      await batch.commit();
    }
  }
  return snap.size;
}

/* ─── Main ─── */
async function run() {
  const productsCol = getFirestoreProductsCollectionName();
  const categoriesCol = getFirestoreCategoriesCollectionName();
  const combosCol = getFirestoreCombosCollectionName();
  const popularCol = getFirestorePopularProductsCollectionName();

  console.log(`\n🥭 Mango Farm — Replace Catalog  ${CONFIRM ? "(APPLY)" : "(DRY RUN — no writes)"}\n`);
  console.log("Target collections:");
  console.log(`  products:         ${productsCol}`);
  console.log(`  categories:       ${categoriesCol}`);
  console.log(`  combos:           ${combosCol}`);
  console.log(`  popular_products: ${popularCol}`);
  console.log(`  banners:          (left untouched)\n`);

  console.log("1) Wiping old catalog...");
  const deletedProducts = await wipeCollection(productsCol);
  const deletedCategories = await wipeCollection(categoriesCol);
  const deletedCombos = await wipeCollection(combosCol);
  const deletedPopular = await wipeCollection(popularCol);
  const verb = CONFIRM ? "Deleted" : "Would delete";
  console.log(`   ${verb}: ${deletedProducts} products, ${deletedCategories} categories, ${deletedCombos} combos, ${deletedPopular} popular docs`);

  console.log("\n2) Seeding category...");
  if (CONFIRM) {
    await firestore.collection(categoriesCol).doc(`category-${category.category_id}`).set({ ...category, updated_at: now }, { merge: true });
  }
  console.log(`   ${CONFIRM ? "✅" : "would add"} ${category.name}`);

  console.log("\n3) Seeding products...");
  for (const p of products) {
    const doc = {
      ...p, // includes each variety's own image_url
      category_id: CATEGORY_ID,
      category_name: CATEGORY_NAME,
      category_slug: CATEGORY_SLUG,
      is_active: true,
      created_at: now,
      updated_at: now,
    };
    if (CONFIRM) {
      await firestore.collection(productsCol).doc(`product-${p.product_id}`).set(doc, { merge: true });
    }
    console.log(`   ${CONFIRM ? "✅" : "would add"} ${p.name} — ₹${p.price}`);
  }

  console.log("\n4) Rebuilding popular-products showcase...");
  if (CONFIRM) {
    await firestore.collection(popularCol).doc("main").set({ ...popularShowcase, updated_at: now }, { merge: true });
  }
  console.log(`   ${CONFIRM ? "✅" : "would set"} showcase with ${popularShowcase.items.length} items`);

  if (!CONFIRM) {
    console.log("\n⚠️  DRY RUN — nothing was written. Re-run with --confirm to apply.");
  } else {
    console.log("\n🎉 Catalog replaced: 1 category, 3 products, popular showcase rebuilt. Banners untouched.");
  }
}

run()
  .catch((err) => {
    console.error("❌ Replace catalog failed:", err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
