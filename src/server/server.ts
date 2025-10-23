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
        this.app.use('/api/users', userRoutes);
        this.app.use('api/subjects', subjectRoutes);
        this.app.use('api/pqrs', pqrRoutes);
        this.app.use('/api/availabilities', availabilityRoutes);
        this.app.use('/api/bookings', bookingRoutes);
        this.app.use('/api/reviews', reviewRoutes);
        this.app.use('/api/payments', paymentsRoutes);
    }
}

export default Server;