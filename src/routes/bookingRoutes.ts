import { Router } from "express";
import { createBooking, getAllBookings, getBookingByid, updateBookingByid, deleteBookingByid, bookingsByStudentsId, bookingsByTutorId, getCountStudentsTheBookingForTutor, getAllBookingsWithReviewCounts} from "../controllers/bookingControllers";
import { verifyToken } from "../middelwears/authMiddelwears";
const router = Router();


//Rutas Get
router.get("/count/student-bookings/:userId", verifyToken, bookingsByStudentsId);
router.get("/count/tutor-bookings/:tutorId", verifyToken, bookingsByTutorId);
router.get("/countStudents-bookingsByTutor/:tutorId", getCountStudentsTheBookingForTutor);
router.get("/bokkingsWithReviewCount/", verifyToken, getAllBookingsWithReviewCounts);
router.get("/:id", verifyToken, getBookingByid);
router.get("/", verifyToken, getAllBookings);

//Rutas Post
router.post("/create", verifyToken, createBooking);

//Rutas Put
router.put("/update/:id", verifyToken, updateBookingByid);

//Rutas Delete
router.delete("/delete/:id", verifyToken, deleteBookingByid);


export default router;

