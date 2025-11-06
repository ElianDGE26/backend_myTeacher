import express  from "express";
import connectionDb from "../config/ConnectionDb";
import config from "../config/config";
import userRoutes from "../routes/userRoutes";
import subjectRoutes from "../routes/subjectRoutes";
import pqrRoutes from "../routes/pqrRoutes";
import availabilityRoutes from "../routes/availabilityRoutes";
import bookingRoutes from "../routes/bookingRoutes";
import paymentsRoutes from "../routes/paymentsRoutes";
import reviewRoutes from "../routes/reviewRoutes";
import cors from 'cors';


class Server {
    private app: express.Application;
    private port: string;
    private frontendUrlDev: string;
    private frontendUrlProd: string;

    constructor() {
        this.app = express();
        this.port = config.port || '3000';
        this.frontendUrlDev = config.frontendUrlDev;
        this.frontendUrlProd = config.frontendUrlProd;
        
        // configurción de BDD y rutas
        connectionDb();
        this.middlewares();
        this.routes();
    }


    middlewares() {// middlewares generales
        //parseo del body
        this.app.use(express.json());
        
        //Configuración de CORS
        this.app.options(/.*/, cors({
            origin: [this.frontendUrlDev, this.frontendUrlProd],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true,
            allowedHeaders: ['content-type', 'authorization', 'accept', 'x-access-token']
        }));

        this.app.use(cors({
            origin: [this.frontendUrlDev, this.frontendUrlProd],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true,
            allowedHeaders: ['content-type', 'authorization', 'accept', 'x-access-token']
        }));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }

    //rutas principales
    routes() {
        this.app.use('/api/users', userRoutes);
        this.app.use('/api/subjects', subjectRoutes);
        this.app.use('/api/pqrs', pqrRoutes);
        this.app.use('/api/availabilities', availabilityRoutes);
        this.app.use('/api/reviews', reviewRoutes);
        this.app.use('/api/payments', paymentsRoutes);
        this.app.use('/api/bookings', bookingRoutes);
    }
}

export default Server;