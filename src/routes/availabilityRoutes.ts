import { Router } from "express";
import { createAvailability, getAllAvailabilities, getAvailabilityByid, updateAvailabilityByid, deleteAvailabilityByid} from "../controllers/availabilityControllers";
import { verifyToken } from "../middelwears/authMiddelwears";
const router = Router();


//Rutas Get
router.get("/", verifyToken, getAllAvailabilities);
router.get("/:id", verifyToken, getAvailabilityByid);

//Rutas Post
router.post("/create", verifyToken, createAvailability);

//Rutas Put
router.put("/update/:id",verifyToken,  updateAvailabilityByid);

//Rutas Delete
router.delete("/delete/:id", verifyToken, deleteAvailabilityByid);


export default router;

