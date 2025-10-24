import { Router } from "express";
import { createPqr, getAllPqrs, getPqrByid, updatePqrByid, deletePqrByid} from "../controllers/pqrControllers";
import { verifyToken } from "../middelwears/authMiddelwears";
const router = Router();


//Rutas Get
router.get("/", verifyToken, getAllPqrs);
router.get("/:id", verifyToken, getPqrByid);

//Rutas Post
router.post("/create", verifyToken, createPqr);

//Rutas Put
router.put("/update/:id",verifyToken,  updatePqrByid);

//Rutas Delete
router.delete("/delete/:id", verifyToken, deletePqrByid);


export default router;

