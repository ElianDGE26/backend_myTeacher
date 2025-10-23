import { Router } from "express";
import { createBooking, getAllBookings, getBookingByid, updateBookingByid, deleteBookingByid} from "../controllers/bookingControllers";

const router = Router();


//Rutas Get
router.get("/", getAllBookings);
router.get("/:id", getBookingByid);

//Rutas Post
router.post("/create", createBooking);

//Rutas Put
router.put("/update/:id", updateBookingByid);

//Rutas Delete
router.delete("/delete/:id", deleteBookingByid);


export default router;

