import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../../.env') });

const serviceAccountStr = process.env.FIREBASE_PRIVATE_KEY 
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

if (!serviceAccountStr) {
  console.error("FIREBASE_PRIVATE_KEY missing in .env");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: serviceAccountStr
  })
});

const db = admin.firestore();

type Cat = { id: number; name: string };
const CATEGORY_BY_PID: Record<number, Cat> = {
  5001: { id: 5, name: 'Gift Boxes' },
  5002: { id: 2, name: 'Mango Pulp' },
  5003: { id: 3, name: 'Dried Mango' },
  5004: { id: 4, name: 'Pantry & Gourmet' },
  5005: { id: 4, name: 'Pantry & Gourmet' },
};

const products = [
  {
    id: "prod_unique_1",
    name: "Banganapalle Royale Box",
    description: "A premium wooden crate containing 6 handpicked, flawlessly ripened Banganapalle mangoes resting on natural straw. Shot in a bright, sunlit organic farm setting, delivering the ultimate luxury fruit experience.",
    price: 59.99,
    image: "/assets/images/products/royale_box.png",
    category: "Premium Harvest",
    stock: 50
  },
  {
    id: "prod_unique_2",
    name: "Golden Mango Puree",
    description: "A sleek, minimalist 500ml glass jar filled with thick, vibrant organic Banganapalle mango puree. Perfect for desserts, smoothies, or enjoying straight from the spoon. No added sugars.",
    price: 18.99,
    image: "/assets/images/products/mango_puree.png",
    category: "Pantry",
    stock: 100
  },
  {
    id: "prod_unique_3",
    name: "Sun-Dried Mango Jewels",
    description: "A beautifully packaged, eco-friendly kraft pouch revealing naturally sweet, sun-dried mango slices with a warm golden orange hue. A guilt-free, chewy snack made from pure Banganapalle mangoes.",
    price: 14.99,
    image: "/assets/images/products/dried_jewels.png",
    category: "Snacks",
    stock: 150
  },
  {
    id: "prod_unique_4",
    name: "Mango Orchard Honey",
    description: "A rustic, elegant jar of raw, unpasteurized honey glowing amber. Collected directly from hives nestled within our flowering mango orchards, carrying subtle floral notes of mango blossoms.",
    price: 22.50,
    image: "/assets/images/products/orchard_honey.png",
    category: "Pantry",
    stock: 75
  },
  {
    id: "prod_unique_5",
    name: "Mango Leaf & Green Tea Blend",
    description: "A premium matte-finish tin of loose-leaf tea, expertly blending high-grade green tea with dried mango leaves and delicate mango blossoms. Rich in antioxidants with a smooth, fruity finish.",
    price: 16.99,
    image: "/assets/images/products/mango_tea.png",
    category: "Beverages",
    stock: 120
  }
];

async function seed() {
  console.log("Seeding Unique Products to Firestore...");
  const batch = db.batch();
  for (const prod of products) {
    const pid = parseInt(prod.id.replace('prod_unique_', '500'), 10); // Unique IDs 5001+
    const cat = CATEGORY_BY_PID[pid] || { id: 1, name: 'Fresh Mangoes' };
    const ref = db.collection('products').doc(prod.id);
    batch.set(ref, {
      id: prod.id,
      product_id: pid,
      name: prod.name,
      description: prod.description,
      price: prod.price,
      image_url: prod.image,
      category_id: cat.id,
      category: cat.name, // string used by the storefront filter
      category_name: cat.name,
      category_slug: cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      stock_quantity: prod.stock,
      stock: prod.stock,
      is_active: true
    }, { merge: true }); // Merge in case they exist
  }
  await batch.commit();
  console.log("Seeding complete! Added 5 unique premium products.");
}

seed().catch(console.error).finally(() => process.exit(0));
