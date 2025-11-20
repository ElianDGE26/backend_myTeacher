import { Router } from "express";
import { createAvailability, getAllAvailabilities, getAllAvailabilitiesByTutorId, getAvailabilityByid, updateAvailabilityByid, deleteAvailabilityByid} from "../controllers/availabilityControllers";
import { verifyToken } from "../middelwears/authMiddelwears";
const router = Router();


//Rutas Get
router.get("/availabilityTutor/:id", verifyToken, getAllAvailabilitiesByTutorId);
router.get("/:id", verifyToken, getAvailabilityByid);
router.get("/", verifyToken, getAllAvailabilities);



//Rutas Post
router.post("/create", verifyToken, createAvailability);

//Rutas Put
router.put("/update/:id",verifyToken,  updateAvailabilityByid);

//Rutas Delete
router.delete("/delete/:id", verifyToken, deleteAvailabilityByid);


export default router;

