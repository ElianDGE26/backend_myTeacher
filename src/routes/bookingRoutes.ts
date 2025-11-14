import { Router } from "express";
import { createBooking, getAllBookings, getBookingByid, updateBookingByid, deleteBookingByid, bookingsByStudentsId, bookingsByTutorId, getCountStudentsTheBookingForTutor} from "../controllers/bookingControllers";
import { verifyToken } from "../middelwears/authMiddelwears";
const router = Router();


//Rutas Get
router.get("/", verifyToken, getAllBookings);
router.get("/:id", verifyToken, getBookingByid);
router.get("/count/student-bookings/:userId", verifyToken, bookingsByStudentsId);
router.get("/count/tutor-bookings/:userId", verifyToken, bookingsByTutorId);
router.get("/countStudents-bookingsByTutor/:tutorId", getCountStudentsTheBookingForTutor);
//Rutas Post
router.post("/create", verifyToken, createBooking);

//Rutas Put
router.put("/update/:id", verifyToken, updateBookingByid);

//Rutas Delete
router.delete("/delete/:id", verifyToken, deleteBookingByid);


export default router;

