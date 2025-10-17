import { Router } from "express";
import { IUserRepository, IUserService } from "../types/usersTypes";
import { UserRepository } from "../repositories/userRepositories";
import { UserService } from "../services/userService";
import { User} from "../types/usersTypes";

const router = Router();

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);


export default() => {
    // Example route
    router.get("/health", (req, res) => {
        res.send("Welcome to the API");
    });

    //get all users
    router.get("/", async (req, res) => {

        const result =  await userService.findAllUsers();

        res.json(result);
    });

    //get user by id
    router.get("/:id", async (req, res) => {
        const { id} = req.params;

        const result = await userService.findUserById(id);

        res.json(result);
    })

    //create user
    router.post("/", async (req, res) => {
        const newUser: User = req.body;

        const result =  await userService.createUser(newUser);

        res.json(result);
    });

    router.put("/:id", async (req, res) => {
        const { id } = req.params;
        const userUpdates: Partial<User> = req.body;

        const result = await userService.updateUserById(id, userUpdates);

        res.json(result);
    });

    router.delete("/:id", async (req, res) => {
        const { id } = req.params;  

        const result = await userService.deleteUserById(id);

        res.json({ success: result });
    });


    return router;

}
