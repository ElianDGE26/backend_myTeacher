import { Router } from "express";
import { createUser, getAllUsers, getUserByid, updateUserByid, deleteUserByid} from "../controllers/usersControllers";
import { loginUser, registerUSer } from "../controllers/auth/authControllers";

const router = Router();



router.get("/", getAllUsers);
router.get("/:id", getUserByid);

router.post("/create", createUser);
router.post("/auth/register", registerUSer)
router.post("/auth/login", loginUser)

router.put("/update/:id", updateUserByid);


router.delete("/delete/:id", deleteUserByid);


export default router;

