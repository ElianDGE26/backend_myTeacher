import { User } from "../../src/types/usersTypes"

declare global {
    namespace Express {
        interface Request {
            currentUser: User;
        }
    }
}