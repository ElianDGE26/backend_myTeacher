import { Router } from "express";
import { createSubject, getAllSubjects, getSubjectByid, updateSubjectByid, deleteSubjectByid} from "../controllers/subjectControllers";

const router = Router();


//Rutas Get 
router.get("/", getAllSubjects);
router.get("/:id", getSubjectByid);

//Rutas Post
router.post("/create", createSubject);

//Rutas Put
router.put("/update/:id", updateSubjectByid);

//Rutas Delete
router.delete("/delete/:id", deleteSubjectByid);


export default router;

