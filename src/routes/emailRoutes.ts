import { Router } from "express";
import { sendCustomEmailController } from "../controllers/emailControllers";

const router = Router();

// Ruta para enviar correos personalizables (puede protegerse con verifyToken si se requiere)
router.post("/send-custom", sendCustomEmailController);

export default router;
