import { Router } from "express";
import { createUser, getAllUsers, getUserByid, updateUserByid, deleteUserByid} from "../controllers/userControllers";
import { loginUser, registerUSer, changePassword, logoutUser, refreshToken} from "../controllers/auth/authControllers";
import { verifyToken } from "../middelwears/authMiddelwears";

const router = Router();


//Rutas Get
router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUserByid);

//Rutas Post
router.post("/create", createUser);


//Rutas Put
router.put("/update/:id", verifyToken, updateUserByid);
router.put("/auth/change-password", changePassword)

//Rutas Delete
router.delete("/delete/:id", verifyToken,deleteUserByid);


// Rutas Auth

router.post("/auth/register", registerUSer)
router.post("/auth/login", loginUser);
router.post("/auth/logout", logoutUser);
router.post("/auth/refresh-token", refreshToken);

export default router;

