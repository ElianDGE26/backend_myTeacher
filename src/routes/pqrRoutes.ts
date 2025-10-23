import { Router } from "express";
import { createPqr, getAllPqrs, getPqrByid, updatePqrByid, deletePqrByid} from "../controllers/pqrControllers";

const router = Router();


//Rutas Get
router.get("/", getAllPqrs);
router.get("/:id", getPqrByid);

//Rutas Post
router.post("/create", createPqr);

//Rutas Put
router.put("/update/:id", updatePqrByid);

//Rutas Delete
router.delete("/delete/:id", deletePqrByid);


export default router;

