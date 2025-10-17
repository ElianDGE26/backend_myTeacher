import express  from "express";
import connectionDb from "../config/ConnectionDb";
import config from "../config/config";
import userRoutes from "../routes/userRoutes";




class Server {
    private app: express.Application;
    private port: string;

    constructor() {
        this.app = express();

        const p = config.port || '3000';
        this.port = p;
        
        connectionDb();
        this.middlewares();
        this.routes(); 
    }


    middlewares() {// middlewares generales
        //parseo del body
        this.app.use(express.json());
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }

    //rutas principales
    routes() {
        this.app.use('/api/users', userRoutes());
    }
}

export default Server;