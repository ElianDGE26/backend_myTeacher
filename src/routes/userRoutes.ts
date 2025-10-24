import { Router } from "express";
import { createUser, getAllUsers, getUserByid, updateUserByid, deleteUserByid} from "../controllers/userControllers";
import { loginUser, registerUSer } from "../controllers/auth/authControllers";
import { verifyToken } from "../middelwears/authMiddelwears";

const router = Router();


//Rutas Get
router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUserByid);

//Rutas Post
router.post("/create", verifyToken, createUser);
router.post("/auth/register", registerUSer)
router.post("/auth/login", loginUser)

//Rutas Put
router.put("/update/:id", verifyToken, updateUserByid);

//Rutas Delete
router.delete("/delete/:id", verifyToken,deleteUserByid);


export default router;

