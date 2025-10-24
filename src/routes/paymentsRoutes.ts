import { Router } from "express";
import { createPayment, getAllPayments, getPaymentByid, updatePaymentByid, deletePaymentByid} from "../controllers/paymentsControllers";
import { verifyToken } from "../middelwears/authMiddelwears";
const router = Router();


//Rutas Get
router.get("/", verifyToken, getAllPayments);
router.get("/:id", verifyToken, getPaymentByid);

//Rutas Post
router.post("/create", verifyToken, createPayment);

//Rutas Put
router.put("/update/:id", verifyToken, updatePaymentByid);

//Rutas Delete
router.delete("/delete/:id", verifyToken, deletePaymentByid);


export default router;

