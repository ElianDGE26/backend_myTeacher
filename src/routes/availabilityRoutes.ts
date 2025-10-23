import { Router } from "express";
import { createAvailability, getAllAvailabilities, getAvailabilityByid, updateAvailabilityByid, deleteAvailabilityByid} from "../controllers/availabilityControllers";

const router = Router();


//Rutas Get
router.get("/", getAllAvailabilities);
router.get("/:id", getAvailabilityByid);

//Rutas Post
router.post("/create", createAvailability);

//Rutas Put
router.put("/update/:id", updateAvailabilityByid);

//Rutas Delete
router.delete("/delete/:id", deleteAvailabilityByid);


export default router;

