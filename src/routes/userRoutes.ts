import { Router } from "express";
import { createUser, getAllUsers, getUserByid, updateUserByid, deleteUserByid} from "../controllers/userControllers";
import { loginUser, registerUSer, changePassword, logoutUser } from "../controllers/auth/authControllers";
import { verifyToken } from "../middelwears/authMiddelwears";

const router = Router();


//Rutas Get
router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUserByid);

//Rutas Post
router.post("/create", verifyToken, createUser);
router.post("/auth/register", registerUSer)
router.post("/auth/login", loginUser);
router.post("auth/logout", logoutUser);

//Rutas Put
router.put("/update/:id", verifyToken, updateUserByid);
router.put("/auth/change-password", changePassword)

//Rutas Delete
router.delete("/delete/:id", verifyToken,deleteUserByid);


export default router;

