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
  1: { id: 1, name: 'Fresh Mangoes' },
  2: { id: 4, name: 'Pantry & Gourmet' },
  3: { id: 1, name: 'Fresh Mangoes' },
  4: { id: 1, name: 'Fresh Mangoes' },
};

const products = [
  {
    id: "prod_1",
    name: "Alphonso Premium Box",
    description: "A luxurious wooden crate filled with perfect, ripe, glowing Alphonso mangoes. Hand-picked from our sun-kissed farms for the ultimate sweetness.",
    price: 49.99,
    image: "/images/box.png",
    stock: 100
  },
  {
    id: "prod_2",
    name: "Artisan Mango Jam",
    description: "Sleek, premium artisan glass jar of glowing golden mango jam. Made with 100% organic mangoes and no artificial preservatives.",
    price: 14.99,
    image: "/images/jam.png",
    stock: 50
  },
  {
    id: "prod_3",
    name: "Sliced Mango Platter",
    description: "Perfectly sliced, ready-to-eat Alphonso mangoes served fresh. A vivid contrast of flavor and aesthetics.",
    price: 24.99,
    image: "/images/sliced.png",
    stock: 20
  },
  {
    id: "prod_4",
    name: "Farm Fresh Harvest",
    description: "A vibrant collection of the finest mangoes straight from the heart of our farms. Rich greens and bright oranges.",
    price: 39.99,
    image: "/images/hero.png",
    stock: 200
  }
];

async function seed() {
  console.log("Seeding Firestore...");
  const batch = db.batch();
  for (const prod of products) {
    const pid = parseInt(prod.id.replace('prod_', ''), 10);
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
      category_name: cat.name,
      category: cat.name,
      stock_quantity: prod.stock,
      is_active: true
    });
  }
  await batch.commit();
  console.log("Seeding complete!");
}

seed().catch(console.error).finally(() => process.exit(0));
