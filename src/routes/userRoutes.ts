import { Router } from "express";
import { createUser, getAllUsers, getUserByid, updateUserByid, deleteUserByid} from "../controllers/userControllers";
import { loginUser, registerUSer } from "../controllers/auth/authControllers";

const router = Router();


//Rutas Get
router.get("/", getAllUsers);
router.get("/:id", getUserByid);

//Rutas Post
router.post("/create", createUser);
router.post("/auth/register", registerUSer)
router.post("/auth/login", loginUser)

//Rutas Put
router.put("/update/:id", updateUserByid);

//Rutas Delete
router.delete("/delete/:id", deleteUserByid);


export default router;

