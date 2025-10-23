import { Router } from "express";
import { createPayment, getAllPayments, getPaymentByid, updatePaymentByid, deletePaymentByid} from "../controllers/paymentsControllers";

const router = Router();


//Rutas Get
router.get("/", getAllPayments);
router.get("/:id", getPaymentByid);

//Rutas Post
router.post("/create", createPayment);

//Rutas Put
router.put("/update/:id", updatePaymentByid);

//Rutas Delete
router.delete("/delete/:id", deletePaymentByid);


export default router;

