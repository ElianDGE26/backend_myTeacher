
import Server from "./server/server";
import dotenv from "dotenv";

dotenv.config();

const server_myTeacher = new Server();
server_myTeacher.listen();
