import express from "express";
import { checkout, getQuote } from "../controller/checkout.controller";
import { verifyToken } from "../middlewares/auth";

const router = express.Router();

// Public: pricing preview for the checkout summary (no account required).
router.post("/quote", getQuote);
router.post("/", verifyToken, checkout);

export default router;
