import { Router } from "express";
import { verifyToken } from "../middelwears/authMiddelwears";
import { createPreference, receiveWebhook } from "../controllers/mercadoPagoControllers";

const router = Router();

router.post("/create_preference", createPreference);
router.post("/webhook", receiveWebhook);

export default router;