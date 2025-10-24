import { Router } from "express";
import { createBooking, getAllBookings, getBookingByid, updateBookingByid, deleteBookingByid} from "../controllers/bookingControllers";
import { verifyToken } from "../middelwears/authMiddelwears";
const router = Router();


//Rutas Get
router.get("/", verifyToken, getAllBookings);
router.get("/:id", verifyToken, getBookingByid);

//Rutas Post
router.post("/create", verifyToken, createBooking);

//Rutas Put
router.put("/update/:id", verifyToken, updateBookingByid);

//Rutas Delete
router.delete("/delete/:id", verifyToken, deleteBookingByid);


export default router;

