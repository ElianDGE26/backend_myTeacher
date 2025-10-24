import { Router } from "express";
import { createSubject, getAllSubjects, getSubjectByid, updateSubjectByid, deleteSubjectByid} from "../controllers/subjectControllers";
import { verifyToken } from "../middelwears/authMiddelwears";


const router = Router();


//Rutas Get 
router.get("/", verifyToken ,getAllSubjects);
router.get("/:id",verifyToken, getSubjectByid);

//Rutas Post
router.post("/create",verifyToken, createSubject);

//Rutas Put
router.put("/update/:id",verifyToken, updateSubjectByid);

//Rutas Delete
router.delete("/delete/:id",verifyToken, deleteSubjectByid);


export default router;

