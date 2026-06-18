import { Timestamp } from "firebase-admin/firestore";
import { firestore } from "../config/firebase";
import {
  AppliedCoupon,
  consumeCoupon,
  validateCouponForAmount,
} from "./coupon.service";
import {
  buildPricedItemsAndSubtotal,
  calculateTotalsFromSubtotal,
} from "./pricing.service";
import { fetchProductsByIds } from "./product-lookup.service";
import { postOrderToSheet } from "./sheet-webhook.service";

const ordersCollection = firestore.collection("orders");
const usersCollection = firestore.collection("users");

/**
 * Human-friendly order id: SUNANDMANGO-#### (four digits).
 * Retries on the rare collision so two orders can never share an id.
 */
async function generateOrderId(): Promise<string> {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const digits = Math.floor(1000 + Math.random() * 9000); // 1000–9999
    const candidate = `SUNANDMANGO-${digits}`;
    const existing = await ordersCollection.doc(candidate).get();
    if (!existing.exists) return candidate;
  }
  // Extremely unlikely fallback — guarantee uniqueness with extra entropy.
  return `SUNANDMANGO-${Date.now().toString().slice(-6)}`;
}

/**
 * Best-effort mirror of a placed order into the Google Sheet. Fire-and-forget:
 * it owns its own error handling and must never affect the checkout response.
 */
async function mirrorOrderToSheet(params: {
  uid: string;
  orderId: string;
  shipping: Record<string, any>;
  cartLines: CartLineForOrder[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode: string;
  paymentMethod: PaymentMethod;
  status: string;
}): Promise<void> {
  try {
    const userSnap = await usersCollection.doc(params.uid).get();
    const u = (userSnap.data() || {}) as Record<string, any>;
    const ship = params.shipping || {};
    const address = [
      ship.address,
      ship.city,
      [ship.state, ship.postal_code].filter(Boolean).join(" - "),
      ship.country,
    ]
      .filter(Boolean)
      .join(", ");
    const items = params.cartLines
      .map((line) => `${line.name} x${line.quantity}`)
      .join("; ");

    await postOrderToSheet({
      orderId: params.orderId,
      name: String(u.name || ""),
      email: String(u.email || ""),
      phone: String(ship.phone || u.phone || ""),
      address,
      items,
      subtotal: params.subtotal,
      discount: params.discount,
      total: params.total,
      coupon: params.couponCode,
      paymentMethod: params.paymentMethod,
      status: params.status,
    });
  } catch (err) {
    console.error("Failed to mirror order to sheet:", err);
  }
}

interface CreateOrderResult {
  orderId: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: string;
  coupon: { code: string; discountAmount: number } | null;
}

type PaymentMethod = "RAZORPAY" | "COD";

interface OrderHistoryItem {
  productId: number;
  name: string;
  imageUrl: string | null;
  quantity: number;
  price: number;
}

interface OrderHistory {
  orderId: string;
  orderDate: string | null;
  status: string;
  totalAmount: number;
  subtotalAmount: number;
  couponDiscountAmount: number;
  finalAmount: number;
  couponCode: string | null;
  shippingId: string;
  items: OrderHistoryItem[];
}

interface CartLineForOrder {
  product_id: number;
  quantity: number;
  price: number;
  name: string;
  image_url: string | null;
}

async function loadCartLines(uid: string): Promise<CartLineForOrder[]> {
  const cartSnap = await usersCollection.doc(uid).collection("cart").get();
  if (cartSnap.empty) return [];

  const productIds = cartSnap.docs
    .map((doc) => Number(doc.id))
    .filter((id) => Number.isFinite(id) && id > 0);

  const productMap = await fetchProductsByIds(productIds);

  return cartSnap.docs
    .map((doc) => {
      const data = doc.data() as Record<string, unknown>;
      const productId = Number(doc.id);
      if (!Number.isFinite(productId) || productId <= 0) return null;
      const product = productMap.get(productId);
      if (!product) return null;
      return {
        product_id: productId,
        quantity: Number(data.quantity) || 0,
        price: product.price,
        name: product.name,
        image_url: product.image_url,
      };
    })
    .filter((line): line is CartLineForOrder => line !== null && line.quantity > 0);
}

async function clearUserCart(uid: string): Promise<void> {
  const snap = await usersCollection.doc(uid).collection("cart").get();
  if (snap.empty) return;
  const batch = firestore.batch();
  snap.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
}

class OrderService {
  static async createOrder(
    uid: string,
    shippingId: string,
    paymentMethod: PaymentMethod = "RAZORPAY",
    couponCode?: string
  ): Promise<CreateOrderResult> {
    const normalizedPaymentMethod: PaymentMethod =
      paymentMethod === "COD" ? "COD" : "RAZORPAY";
    const orderStatus = "PENDING_PAYMENT";

    const shippingRef = usersCollection.doc(uid).collection("addresses").doc(shippingId);
    const shippingSnap = await shippingRef.get();
    if (!shippingSnap.exists) {
      throw new Error("Invalid shipping address");
    }

    const cartLines = await loadCartLines(uid);
    if (cartLines.length === 0) {
      throw new Error("Cart is empty");
    }

    const { pricedItems, subtotalPaise } = buildPricedItemsAndSubtotal(
      cartLines.map((line) => ({
        productId: line.product_id,
        quantity: line.quantity,
        mrpRupees: line.price,
      }))
    );

    const orderId = await generateOrderId();

    const result = await firestore.runTransaction(async (tx) => {
      const preCouponTotals = calculateTotalsFromSubtotal(subtotalPaise, 0);
      const appliedCoupon: AppliedCoupon | null = await validateCouponForAmount(
        tx,
        uid,
        preCouponTotals.subtotalAmount,
        couponCode
      );
      const totals = calculateTotalsFromSubtotal(
        subtotalPaise,
        appliedCoupon?.discountAmount || 0
      );

      const orderRef = ordersCollection.doc(orderId);
      const itemsForStorage = pricedItems.map((priced) => {
        const cartLine = cartLines.find((line) => line.product_id === priced.product_id);
        return {
          product_id: priced.product_id,
          name: cartLine?.name || "",
          image_url: cartLine?.image_url || null,
          quantity: priced.quantity,
          price: priced.discountedPrice,
          line_total: priced.lineTotal,
        };
      });

      tx.set(orderRef, {
        order_id: orderRef.id,
        user_id: uid,
        status: orderStatus,
        shipping_id: shippingId,
        payment_method: normalizedPaymentMethod,
        provider_order_id: null,
        coupon_id: appliedCoupon?.couponId || null,
        coupon_code: appliedCoupon?.code || null,
        subtotal_amount: totals.subtotalAmount,
        coupon_discount_amount: totals.couponDiscountAmount,
        final_amount: totals.totalAmount,
        total_amount: totals.totalAmount,
        items: itemsForStorage,
        order_date: Timestamp.now(),
        updated_at: Timestamp.now(),
      });

      if (appliedCoupon) {
        await consumeCoupon(tx, uid, orderRef.id, appliedCoupon);
      }

      return {
        orderId: orderRef.id,
        subtotalAmount: totals.subtotalAmount,
        couponDiscountAmount: totals.couponDiscountAmount,
        totalAmount: totals.totalAmount,
        coupon: appliedCoupon
          ? { code: appliedCoupon.code, discountAmount: totals.couponDiscountAmount }
          : null,
      };
    });

    if (normalizedPaymentMethod === "COD") {
      await clearUserCart(uid);
    }

    // Mirror the placed order into the Google Sheet (fire-and-forget — never blocks checkout).
    void mirrorOrderToSheet({
      uid,
      orderId: result.orderId,
      shipping: shippingSnap.data() as Record<string, any>,
      cartLines,
      subtotal: result.subtotalAmount,
      discount: result.couponDiscountAmount,
      total: result.totalAmount,
      couponCode: result.coupon?.code || "",
      paymentMethod: normalizedPaymentMethod,
      status: orderStatus,
    });

    return {
      orderId: result.orderId,
      totalAmount: result.totalAmount,
      paymentMethod: normalizedPaymentMethod,
      status: orderStatus,
      coupon: result.coupon,
    };
  }

  static async getOrdersByUser(uid: string): Promise<OrderHistory[]> {
    const snap = await ordersCollection.where("user_id", "==", uid).get();
    const orders: OrderHistory[] = snap.docs.map((doc) => {
      const data = doc.data() as Record<string, unknown>;
      const orderDate = data.order_date as Timestamp | undefined;
      const itemsRaw = Array.isArray(data.items)
        ? (data.items as Array<Record<string, unknown>>)
        : [];
      return {
        orderId: doc.id,
        orderDate: orderDate ? orderDate.toDate().toISOString() : null,
        status: String(data.status || ""),
        totalAmount: Number(data.total_amount) || 0,
        subtotalAmount: Number(data.subtotal_amount) || 0,
        couponDiscountAmount: Number(data.coupon_discount_amount) || 0,
        finalAmount: Number(data.final_amount) || 0,
        couponCode: (data.coupon_code as string) || null,
        shippingId: String(data.shipping_id || ""),
        items: itemsRaw.map((item) => ({
          productId: Number(item.product_id) || 0,
          name: String(item.name || "Product"),
          imageUrl: (item.image_url as string) || null,
          quantity: Number(item.quantity) || 0,
          price: Number(item.price) || 0,
        })),
      };
    });

    orders.sort((a, b) => {
      const at = a.orderDate ? new Date(a.orderDate).getTime() : 0;
      const bt = b.orderDate ? new Date(b.orderDate).getTime() : 0;
      return bt - at;
    });
    return orders;
  }
}

export default OrderService;
