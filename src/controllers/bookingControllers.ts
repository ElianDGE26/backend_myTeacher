import { IBookingRepository, IBookingService, Booking } from "../types/bookingsTypes";
import { BookingRepository } from "../repositories/bookingRepositories";
import { BookingService } from "../services/bookingService";
import { Request, Response } from "express";

const bookingRepository: IBookingRepository = new BookingRepository();
const bookingService: IBookingService = new BookingService(bookingRepository);



export const getAllBookings = async (req: Request, res: Response) => {
    try {

        const result =  await bookingService.findAllBookings();

        if (result.length === 0) {
            return res.status(404).json({ message: "No Bookings found" });
        }

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getBookingByid = async (req: Request, res: Response) => {
    try {
        const { id} = req.params;

        if (!id) {
            return res.status(400).json({ message: "Missing Booking ID in params" });
        }
        
        const result =  await bookingService.findBookingById(id);

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

        const result =  await bookingService.updateBookingById(id, bookingUpdate);

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

        const result =  await bookingService.deleteBookingById(id);

        if (!result) {
            return res.status(404).json({ message: "Booking not found" });
        }   
        res.json({ success: result });
        
    } catch (error) {
        console.error("Error fetching Bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const bookingsByStudentsId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        console.log('userId :>> ', userId);
        
        if (!userId){
            return res.status(400).json( { message: "Missing user ID in params" } );
        }

        const resutlt = await bookingService.findAllBookings({ studentId: userId});

        if( !resutlt || resutlt.length === 0 ){
            return  res.status(404).json( { message: "No bookings found for the given student ID"} );
        }

        res.json(resutlt);
    } catch (error) {
        console.log('error find bookings by students id:>> ', error);
        res.status(500).json( { message: "Internat server Error"} );
    }
}
