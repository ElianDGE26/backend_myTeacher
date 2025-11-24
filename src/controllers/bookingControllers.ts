import { IBookingRepository, IBookingService, Booking } from "../types/bookingsTypes";
import { BookingRepository } from "../repositories/bookingRepositories";
import { BookingService } from "../services/bookingService";
import { Request, Response } from "express";
import { IUserRepository } from "../types/usersTypes";
import { UserRepository } from "../repositories/userRepositories";
import mongoose, { Types } from "mongoose";
import CustomError from "../utils/CustomError";

const bookingRepository: IBookingRepository = new BookingRepository();
const userRepository: IUserRepository = new UserRepository();
const bookingService: IBookingService = new BookingService(bookingRepository, userRepository);



export const getAllBookingsWithReviewCounts = async (req: Request, res: Response) => {
    try {
        const result =  await bookingService.findAllWithReviewCount();
        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const result =  await bookingService.findAllBookings();
        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getBookingByid = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Missing Booking ID in params" });
        }

        //se valida que el id si sea de tipo Object ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "Invalid Booking Id"})
        }

        //se envia el parametro como tipo Object Id
        const result =  await bookingService.findBookingById(new mongoose.Types.ObjectId(id));

        if (!result) {
            return res.status(404).json({ message: "No Booking found" });
        }

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const createBooking = async (req: Request, res: Response) => {
    try {

        const newBooking: Booking = req.body;

        const result =  await bookingService.createBooking(newBooking);

        res.status(201).json(result);
        
    } catch (error) {
        console.error("Error fetching Bookings:", error);
        res.status(400).json({ message: "Internal server error" });
    }
}

export const updateBookingByid = async (req: Request, res: Response) => {
    try {
        const {id } = req.params;
        const bookingUpdate: Booking = req.body;

        if (!id) {
            return res.status(400).json({ message: "Missing Booking ID in params" });
        }
        //se valida que el id si sea de tipo Object ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "Invalid Booking Id"})
        }

        const result =  await bookingService.updateBookingById(new mongoose.Types.ObjectId(id), bookingUpdate);

        if (!result) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteBookingByid = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Missing Booking ID in params" });
        }
        //se valida que el id si sea de tipo Object ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "Invalid Booking Id"})
        }

        const result =  await bookingService.deleteBookingById(new mongoose.Types.ObjectId(id));

        if (!result) {
            return res.status(404).json({ message: "Booking not found" });
        }   
        res.json({ success: result });
        
    } catch (error) {
        console.error("Error fetching Bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//Reservas por el id del estudiante
export const bookingsByStudentsId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        console.log('userId :>> ', userId);
        
        if (!userId){
            return res.status(400).json( { message: "Missing user ID in params" } );
        }

        //se valida que el id si sea de tipo Object ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).json({ message: "Invalid Booking Id"})
        }

        const resutlt = await bookingService.findAllBookings({ studentId: new mongoose.Types.ObjectId(userId)});

        if( !resutlt || resutlt.length === 0 ){
            return  res.status(404).json( { message: "No bookings found for the given student ID"} );
        }

        res.json(resutlt);
    } catch (error) {
        console.log('error find bookings by students id:>> ', error);
        res.status(500).json( { message: "Internat server Error"} );
    }
}

//reservas por el id del tutor, es decir, las tutorias que él profesor ha hecho
export const bookingsByTutorId = async (req: Request, res: Response) => {
    try {
        const { tutorId } = req.params;
        console.log('userId :>> ', tutorId);
        
        if (!tutorId){
            return res.status(400).json( { message: "Missing user ID in params" } );
        }

        //se valida que el id si sea de tipo Object ID
        if (!mongoose.Types.ObjectId.isValid(tutorId)) {
            return res.status(404).json({ message: "Invalid Booking Id"})
        }

        const resutlt = await bookingService.findAllWithReviewCount({ tutorId: new mongoose.Types.ObjectId(tutorId)});

        if( !resutlt || resutlt.length === 0 ){
            return  res.status(404).json( { message: "No bookings found for the given tutor ID"} );
        }

        res.json(resutlt);
    } catch (error) {
        console.log('error find bookings by tutor id:>> ', error);
        res.status(500).json( { message: "Internat server Error"} );
    }
}

//traer el numeo de estudiantes que hicieron reservas con un tutor para el  grafico 
export const getCountStudentsTheBookingForTutor = async (req:Request, res:Response) => {
    try {
        const { tutorId } = req.params;

        if (!tutorId) {
            return res.status(400).json( {
                message: "The tutor ID must be required"
            } );
        }

        //se valida que el id si sea de tipo Object ID
        if (!mongoose.Types.ObjectId.isValid(tutorId))  {
            return res.status(404).json({ message: "Invalid Booking Id"})
        }

        const result = await bookingService.getStudentsByTutorBooking(new mongoose.Types.ObjectId(tutorId));

        let nextBookings = null;

        try {
            nextBookings = await bookingService.getNextTwoBookingsForTutor(
                new mongoose.Types.ObjectId(tutorId),
                "Aceptada"
            );
        } catch (error) {
            console.log("Error getting next bookings, ignoring error:", error);
            nextBookings = null; // o []
        }

        return res.json({
            result,
            nextBookings
        });
        
    }catch (error) {
        if (error instanceof CustomError) {
            return res.status(error.status).json({ message: error.message });
        }
        console.log("Error counting students who made reservations with tutor : >>>> ", error);
        res.status(500).json({ message: "Error counting students who made reservations with tutor "} );
    }
}