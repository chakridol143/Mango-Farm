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

const products = [
  {
    id: "prod_1",
    name: "Alphonso Premium Box",
    description: "A luxurious wooden crate filled with perfect, ripe, glowing Alphonso mangoes. Hand-picked from our sun-kissed farms for the ultimate sweetness.",
    price: 49.99,
    image: "http://localhost:5173/images/box.png",
    category: "Fresh Fruit",
    stock: 100
  },
  {
    id: "prod_2",
    name: "Artisan Mango Jam",
    description: "Sleek, premium artisan glass jar of glowing golden mango jam. Made with 100% organic mangoes and no artificial preservatives.",
    price: 14.99,
    image: "http://localhost:5173/images/jam.png",
    category: "Pantry",
    stock: 50
  },
  {
    id: "prod_3",
    name: "Sliced Mango Platter",
    description: "Perfectly sliced, ready-to-eat Alphonso mangoes served fresh. A vivid contrast of flavor and aesthetics.",
    price: 24.99,
    image: "http://localhost:5173/images/sliced.png",
    category: "Ready to Eat",
    stock: 20
  },
  {
    id: "prod_4",
    name: "Farm Fresh Harvest",
    description: "A vibrant collection of the finest mangoes straight from the heart of our farms. Rich greens and bright oranges.",
    price: 39.99,
    image: "http://localhost:5173/images/hero.png",
    category: "Fresh Fruit",
    stock: 200
  }
];

async function seed() {
  console.log("Seeding Firestore...");
  const batch = db.batch();
  for (const prod of products) {
    const ref = db.collection('products').doc(prod.id);
    batch.set(ref, {
      id: prod.id,
      product_id: parseInt(prod.id.replace('prod_', '')),
      name: prod.name,
      description: prod.description,
      price: prod.price,
      image_url: prod.image, 
      category_id: 1, 
      stock_quantity: prod.stock,
      is_active: 1
    });
  }
  await batch.commit();
  console.log("Seeding complete!");
}

seed().catch(console.error).finally(() => process.exit(0));
