import mongoose from "mongoose";
import dotenv from "dotenv";
import config from "./config"



dotenv.config();


const connectionDb = async () => {
    try {
        const mongoUrl = config.mongodbUrl;
        await mongoose.connect(mongoUrl);
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database', error);
        process.exit(1);
    }

}

export default connectionDb; 
