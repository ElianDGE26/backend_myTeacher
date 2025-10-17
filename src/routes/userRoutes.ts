import { Router } from "express";
import { createUser, getAllUsers, getUserByid, updateUserByid, deleteUserByid} from "../controllers/usersControllers";

const router = Router();


export default() => {

    router.get("/", getAllUsers);
    router.get("/:id", getUserByid);
    router.post("/", createUser);
    router.put("/:id", updateUserByid);
    router.delete("/:id", deleteUserByid);
    return router;
}
