/**
 * Mango Farm — Firestore Data Seeder
 * 
 * Seeds the Firestore database with initial Mango Farm catalog data:
 * - Categories
 * - Products
 * - Banners
 * - Combos
 * - Popular Products showcase
 *
 * Usage: npx ts-node src/scripts/seed-mango-farm.ts
 */

import { Timestamp } from "firebase-admin/firestore";
import { firestore } from "../config/firebase";
import {
  getFirestoreCategoriesCollectionName,
  getFirestoreProductsCollectionName,
  getFirestoreCombosCollectionName,
  getFirestoreBannersCollectionName,
  getFirestorePopularProductsCollectionName,
} from "../config/catalog";

const now = Timestamp.now();

/* ─── Categories ─── */
const categories = [
  { category_id: 1, name: "Fresh Mangoes", slug: "fresh-mangoes", description: "Premium hand-picked mangoes from India's finest orchards — Alphonso, Kesar, Langra, Dasheri, and more.", image_url: "/assets/images/product_alphonso.png", sort_order: 1 },
  { category_id: 2, name: "Mango Pulp", slug: "mango-pulp", description: "100% pure Alphonso mango pulp — no added sugar, no preservatives. Perfect for smoothies, desserts, and cooking.", image_url: "/assets/images/product_pulp.png", sort_order: 2 },
  { category_id: 3, name: "Dried Mango", slug: "dried-mango", description: "Sun-dried and naturally sweetened mango slices and aam papad — healthy snacking, any time of year.", image_url: "/assets/images/product_dried_mango.png", sort_order: 3 },
  { category_id: 4, name: "Mango Pickles", slug: "mango-pickles", description: "Traditional Indian mango pickle made with cold-pressed mustard oil and family recipes.", image_url: "/assets/images/product_pickle.png", sort_order: 4 },
  { category_id: 5, name: "Gift Boxes", slug: "gift-boxes", description: "Beautifully curated mango gift hampers for personal and corporate gifting.", image_url: "/assets/images/product_gift_box.png", sort_order: 5 },
];

/* ─── Products ─── */
const products = [
  {
    product_id: 1, name: "Alphonso Mango Box (1 Dozen)", slug: "alphonso-mango-box", sub_name: "King of Mangoes",
    description: "Premium Ratnagiri Alphonso — the undisputed king. Buttery smooth, fiber-free, intensely aromatic. Each mango is handpicked at optimal maturity and naturally ripened. 1 dozen (approximately 3-4 kg).",
    details: "Origin: Ratnagiri, Maharashtra\nVariety: Alphonso (Hapus)\nGrade: Premium A+\nRipening: Natural (no carbide)\nPack: 12 mangoes, individually wrapped",
    price: 1499, stock_quantity: 100, category_id: 1, category_name: "Fresh Mangoes", category_slug: "fresh-mangoes",
    image_url: "/assets/images/product_alphonso.png", is_active: true, created_at: now,
  },
  {
    product_id: 2, name: "Kesar Mango Box (1 Dozen)", slug: "kesar-mango-box", sub_name: "Saffron Queen",
    description: "Gujarat's pride — Kesar mangoes with their signature saffron-colored flesh and intoxicating aroma. Sweet, fragrant, and utterly irresistible. 1 dozen (approximately 3 kg).",
    details: "Origin: Junagadh, Gujarat\nVariety: Kesar\nGrade: Premium\nRipening: Natural\nPack: 12 mangoes",
    price: 899, stock_quantity: 150, category_id: 1, category_name: "Fresh Mangoes", category_slug: "fresh-mangoes",
    image_url: "/assets/images/product_kesar.png", is_active: true, created_at: now,
  },
  {
    product_id: 3, name: "Langra Mango Box (1 Dozen)", slug: "langra-mango-box", sub_name: "Green Gold",
    description: "The beloved Langra from Varanasi — stays green even when perfectly ripe. Incredibly sweet with a unique aromatic flavor. A North Indian favorite. 1 dozen.",
    details: "Origin: Varanasi, UP\nVariety: Langra\nGrade: Premium\nRipening: Natural\nPack: 12 mangoes",
    price: 649, stock_quantity: 120, category_id: 1, category_name: "Fresh Mangoes", category_slug: "fresh-mangoes",
    image_url: "/assets/images/product_alphonso.png", is_active: true, created_at: now,
  },
  {
    product_id: 4, name: "Dasheri Mango Box (1 Dozen)", slug: "dasheri-mango-box", sub_name: "Lucknow's Finest",
    description: "Completely fiber-free with honey-sweet juice — Dasheri is Lucknow's most celebrated mango variety. Delicate, sweet, and perfect for eating fresh. 1 dozen.",
    details: "Origin: Lucknow, UP\nVariety: Dasheri\nGrade: Premium\nRipening: Natural\nPack: 12 mangoes",
    price: 599, stock_quantity: 100, category_id: 1, category_name: "Fresh Mangoes", category_slug: "fresh-mangoes",
    image_url: "/assets/images/product_kesar.png", is_active: true, created_at: now,
  },
  {
    product_id: 5, name: "Totapuri Mango Box (2 Dozen)", slug: "totapuri-mango-box", sub_name: "Versatile Classic",
    description: "The workhorse mango — tangy, firm, and versatile. Perfect for salads, chutneys, juices, and cooking. A South Indian staple. 2 dozen value pack.",
    details: "Origin: Karnataka\nVariety: Totapuri\nGrade: A\nRipening: Natural\nPack: 24 mangoes",
    price: 449, stock_quantity: 200, category_id: 1, category_name: "Fresh Mangoes", category_slug: "fresh-mangoes",
    image_url: "/assets/images/product_alphonso.png", is_active: true, created_at: now,
  },
  {
    product_id: 6, name: "Chausa Mango Box (1 Dozen)", slug: "chausa-mango-box", sub_name: "Juice Bomb",
    description: "The famous 'sucking mango' — impossibly juicy with a unique sucking technique. Chausa is all about the juice! A late-season treat. 1 dozen.",
    details: "Origin: Bihar/UP\nVariety: Chausa\nGrade: Premium\nRipening: Natural\nPack: 12 mangoes",
    price: 549, stock_quantity: 80, category_id: 1, category_name: "Fresh Mangoes", category_slug: "fresh-mangoes",
    image_url: "/assets/images/product_kesar.png", is_active: true, created_at: now,
  },
  {
    product_id: 7, name: "Premium Alphonso Mango Pulp", slug: "alphonso-mango-pulp", sub_name: "Pure & Natural",
    description: "100% pure Alphonso mango pulp — thick, luscious, and deeply flavorful. No added sugar, no preservatives, no artificial colors. Perfect for smoothies, lassi, desserts, ice cream, and baking. 850g jar.",
    details: "Ingredients: 100% Alphonso Mango Pulp\nWeight: 850g\nShelf Life: 12 months\nStorage: Cool, dry place. Refrigerate after opening.",
    price: 399, stock_quantity: 300, category_id: 2, category_name: "Mango Pulp", category_slug: "mango-pulp",
    image_url: "/assets/images/product_pulp.png", is_active: true, created_at: now,
  },
  {
    product_id: 8, name: "Dried Mango Slices", slug: "dried-mango-slices", sub_name: "Healthy Snacking",
    description: "Sun-dried mango slices made from ripe Alphonso mangoes. No added sugar, no preservatives — just pure, chewy, naturally sweet mango goodness. Perfect anytime snack. 200g pack.",
    details: "Ingredients: 100% Dried Mango\nWeight: 200g\nShelf Life: 6 months\nStorage: Store in cool, dry place. Seal after opening.",
    price: 299, stock_quantity: 250, category_id: 3, category_name: "Dried Mango", category_slug: "dried-mango",
    image_url: "/assets/images/product_dried_mango.png", is_active: true, created_at: now,
  },
  {
    product_id: 9, name: "Mango Aam Papad", slug: "mango-aam-papad", sub_name: "Traditional Treat",
    description: "Traditional aam papad made from sun-dried mango pulp and a hint of spice. A nostalgic Indian treat that brings back childhood memories. 250g pack.",
    details: "Ingredients: Mango Pulp, Sugar, Spices\nWeight: 250g\nShelf Life: 8 months\nStorage: Cool, dry place.",
    price: 199, stock_quantity: 200, category_id: 3, category_name: "Dried Mango", category_slug: "dried-mango",
    image_url: "/assets/images/product_dried_mango.png", is_active: true, created_at: now,
  },
  {
    product_id: 10, name: "Traditional Mango Pickle", slug: "mango-pickle-traditional", sub_name: "Family Recipe",
    description: "Authentic Indian mango pickle made with raw mangoes, cold-pressed mustard oil, and a traditional spice blend. Handmade using our family's time-honored recipe. No artificial preservatives. 400g jar.",
    details: "Ingredients: Raw Mango, Mustard Oil, Spices (Fenugreek, Mustard Seeds, Red Chili, Turmeric), Salt\nWeight: 400g\nShelf Life: 12 months\nStorage: Cool, dry place.",
    price: 249, stock_quantity: 180, category_id: 4, category_name: "Mango Pickles", category_slug: "mango-pickles",
    image_url: "/assets/images/product_pickle.png", is_active: true, created_at: now,
  },
  {
    product_id: 11, name: "Premium Mango Gift Hamper", slug: "mango-gift-hamper-premium", sub_name: "Luxury Collection",
    description: "Our finest gift box — 6 premium Alphonso mangoes, 1 jar of mango pulp, dried mango slices, and a handwritten greeting card. Beautifully wrapped in a wooden crate with golden ribbon. Perfect for festivals, birthdays, or corporate gifting.",
    details: "Contents: 6 Alphonso Mangoes + 1 Mango Pulp (500g) + 1 Dried Mango (200g) + Greeting Card\nPackaging: Wooden crate with golden ribbon\nCustomization: Available on request",
    price: 2999, stock_quantity: 50, category_id: 5, category_name: "Gift Boxes", category_slug: "gift-boxes",
    image_url: "/assets/images/product_gift_box.png", is_active: true, created_at: now,
  },
  {
    product_id: 12, name: "Mango Farm Sampler Box", slug: "mango-sampler-box", sub_name: "Taste Everything",
    description: "Can't decide? Get a taste of all our bestsellers — 3 Alphonso + 3 Kesar + 3 Dasheri mangoes, plus a mini jar of mango pulp and dried mango slices. The perfect introduction to Mango Farm.",
    details: "Contents: 3 Alphonso + 3 Kesar + 3 Dasheri + Mini Pulp + Mini Dried Mango\nPack: Mixed variety sampler\nGreat for: First-time buyers, tasting parties",
    price: 1299, stock_quantity: 75, category_id: 5, category_name: "Gift Boxes", category_slug: "gift-boxes",
    image_url: "/assets/images/product_gift_box.png", is_active: true, created_at: now,
  },
];

/* ─── Banners ─── */
const banners = [
  {
    banner_id: 1, slug: "alphonso-season",
    image_url: "/assets/images/banner1.jpg",
    caption: "Season 2026 Now Live",
    title_top: "The King",
    title_accent: "Alphonso",
    title_bottom: "Has Arrived",
    description: "Premium Ratnagiri Alphonso — handpicked, naturally ripened, delivered in 48 hours. Experience the world's finest mango.",
    chips: [
      { icon: "leaf", label: "Organic" },
      { icon: "fruit", label: "Carbide-Free" },
      { icon: "box", label: "48hr Delivery" }
    ],
    primary_cta: { text: "Shop Alphonso", link: "/products" },
    secondary_cta: { text: "Learn More", link: "/learn/mango-varieties" },
    align: "left", is_active: true, sort_order: 1, created_at: now,
  },
  {
    banner_id: 2, slug: "orchard-fresh",
    image_url: "/assets/images/banner2.jpg",
    caption: "From Our Orchards",
    title_top: "Farm-Fresh",
    title_accent: "Mangoes",
    title_bottom: "To Your Door",
    description: "Direct from orchards in Ratnagiri, Junagadh, and Lucknow. No middlemen, no chemicals — just pure, sun-ripened goodness.",
    chips: [
      { icon: "leaf", label: "No Middlemen" },
      { icon: "sparkle", label: "Natural Ripening" },
      { icon: "drop", label: "Farm Fresh" }
    ],
    primary_cta: { text: "Explore Varieties", link: "/products" },
    secondary_cta: { text: "Our Story", link: "/about" },
    align: "right", is_active: true, sort_order: 2, created_at: now,
  },
  {
    banner_id: 3, slug: "gift-collection",
    image_url: "/assets/images/banner3.jpg",
    caption: "Premium Gifting",
    title_top: "Gift the",
    title_accent: "Sunshine",
    title_bottom: "",
    description: "Beautifully curated mango gift hampers — perfect for festivals, birthdays, or saying thank you with nature's sweetest fruit.",
    chips: [
      { icon: "box", label: "Premium Packaging" },
      { icon: "sparkle", label: "Custom Cards" },
      { icon: "fruit", label: "Corporate Gifting" }
    ],
    primary_cta: { text: "Shop Gift Boxes", link: "/products" },
    align: "left", is_active: true, sort_order: 3, created_at: now,
  },
];

/* ─── Combos ─── */
const combos = [
  {
    combo_id: 1, name: "Mango Lovers Combo Pack", slug: "mango-lovers-combo",
    description: "All our bestselling fresh mango varieties in one order — Alphonso, Kesar, and Dasheri. The perfect way to taste India's finest.",
    badge: "Best Value", product_ids: [1, 2, 4], discount_percent: 12,
    is_active: true, sort_order: 1, created_at: now,
  },
  {
    combo_id: 2, name: "Complete Mango Experience", slug: "complete-mango-experience",
    description: "Fresh Alphonso mangoes + Mango Pulp + Dried Mango Slices — everything mango in one delivery.",
    badge: "Most Popular", product_ids: [1, 7, 8], discount_percent: 15,
    is_active: true, sort_order: 2, created_at: now,
  },
];

/* ─── Popular Products ─── */
const popularShowcase = {
  section_id: "main",
  eyebrow: "Season's Finest",
  title: "Most Loved Mangoes",
  is_active: true,
  items: [
    { item_id: 1, name: "Alphonso Mango Box", tagline: "King of Mangoes", caption: "Best Seller", button_text: "Shop Alphonso", link: "/products", image_url: "/assets/images/product_alphonso.png", is_featured: true, is_active: true, sort_order: 10 },
    { item_id: 2, name: "Kesar Mango Box", tagline: "Saffron Sweetness", caption: "Trending", button_text: "Shop Kesar", link: "/products", image_url: "/assets/images/product_kesar.png", is_featured: false, is_active: true, sort_order: 20 },
    { item_id: 3, name: "Premium Gift Hamper", tagline: "Perfect for Gifting", caption: "New", button_text: "Shop Gift Box", link: "/products", image_url: "/assets/images/product_gift_box.png", is_featured: false, is_active: true, sort_order: 30 },
    { item_id: 4, name: "Alphonso Mango Pulp", tagline: "Pure & Natural", caption: "Year-Round", button_text: "Shop Pulp", link: "/products", image_url: "/assets/images/product_pulp.png", is_featured: false, is_active: true, sort_order: 40 },
    { item_id: 5, name: "Dried Mango Slices", tagline: "Healthy Snacking", caption: "Popular", button_text: "Shop Dried Mango", link: "/products", image_url: "/assets/images/product_dried_mango.png", is_featured: false, is_active: true, sort_order: 50 },
  ],
  created_at: now,
};

/* ─── Seed Logic ─── */
async function seed() {
  console.log("🥭 Mango Farm — Seeding Firestore...\n");

  const categoriesCol = getFirestoreCategoriesCollectionName();
  const productsCol = getFirestoreProductsCollectionName();
  const combosCol = getFirestoreCombosCollectionName();
  const bannersCol = getFirestoreBannersCollectionName();
  const popularCol = getFirestorePopularProductsCollectionName();

  // Seed categories
  console.log(`📁 Seeding ${categories.length} categories...`);
  for (const cat of categories) {
    await firestore.collection(categoriesCol).doc(`category-${cat.category_id}`).set({
      ...cat, updated_at: now,
    }, { merge: true });
    console.log(`  ✅ ${cat.name}`);
  }

  // Seed products
  console.log(`\n📦 Seeding ${products.length} products...`);
  for (const prod of products) {
    await firestore.collection(productsCol).doc(`product-${prod.product_id}`).set({
      ...prod, updated_at: now,
    }, { merge: true });
    console.log(`  ✅ ${prod.name} — ₹${prod.price}`);
  }

  // Seed banners
  console.log(`\n🖼️  Seeding ${banners.length} banners...`);
  for (const banner of banners) {
    await firestore.collection(bannersCol).doc(`banner-${banner.banner_id}`).set({
      ...banner, updated_at: now,
    }, { merge: true });
    console.log(`  ✅ ${banner.caption}`);
  }

  // Seed combos
  console.log(`\n🎁 Seeding ${combos.length} combos...`);
  for (const combo of combos) {
    await firestore.collection(combosCol).doc(`combo-${combo.combo_id}`).set({
      ...combo, updated_at: now,
    }, { merge: true });
    console.log(`  ✅ ${combo.name}`);
  }

  // Seed popular products
  console.log(`\n⭐ Seeding popular products showcase...`);
  await firestore.collection(popularCol).doc("main").set({
    ...popularShowcase, updated_at: now,
  }, { merge: true });
  console.log(`  ✅ Popular showcase with ${popularShowcase.items.length} items`);

  console.log("\n🎉 Mango Farm Firestore seeding complete!");
  console.log(`   Categories: ${categories.length}`);
  console.log(`   Products:   ${products.length}`);
  console.log(`   Banners:    ${banners.length}`);
  console.log(`   Combos:     ${combos.length}`);
  console.log(`   Popular:    1 showcase`);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
