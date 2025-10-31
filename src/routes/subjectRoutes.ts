import { Router } from "express";
import { createSubject, getAllSubjects, getSubjectByid, updateSubjectByid, deleteSubjectByid, findUserBySubjectName} from "../controllers/subjectControllers";
import { verifyToken } from "../middelwears/authMiddelwears";


const router = Router();


//Rutas Get 
router.get("/", verifyToken ,getAllSubjects);
router.get("/:id",verifyToken, getSubjectByid);
router.get("/UserSubjects/:subjectName", verifyToken, findUserBySubjectName);

//Rutas Post
router.post("/create",verifyToken, createSubject);

//Rutas Put
router.put("/update/:id",verifyToken, updateSubjectByid);

//Rutas Delete
router.delete("/delete/:id",verifyToken, deleteSubjectByid);


export default router;

