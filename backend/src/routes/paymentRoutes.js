import { Router } from "express";
import { createPaymentIntent, getPaymentConfig } from "../controllers/paymentController.js";

const router = Router();

router.get("/config", getPaymentConfig);
router.post("/create-intent", createPaymentIntent);

export default router;
