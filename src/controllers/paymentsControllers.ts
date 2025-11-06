import { IPaymentsRepository, IPaymentsService, Payments } from "../types/paymentsTypes";
import { IBookingRepository, IBookingService, Booking } from "../types/bookingsTypes";
import { PaymentsRepository } from "../repositories/paymentsRepositories";
import { BookingRepository } from "../repositories/bookingRepositories";
import { PaymentsService } from "../services/paymentsService";
import { Request, Response } from "express";
import { Types } from "mongoose";

const paymentRepository: IPaymentsRepository = new PaymentsRepository();
const bookingRepository: IBookingRepository = new BookingRepository();
const paymentService: IPaymentsService = new PaymentsService(paymentRepository, bookingRepository);



export const getAllPayments = async (req: Request, res: Response) => {
    try {

        const result =  await paymentService.findAllPayments();

        if (result.length === 0) {
            return res.status(404).json({ message: "No Payments found" });
        }

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Payments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getPaymentByid = async (req: Request, res: Response) => {
    try {
        const { id} = req.params;

        if (!id) {
            return res.status(400).json({ message: "Missing Payment ID in params" });
        }
        
        const result =  await paymentService.findPaymentById(id);

        if (!result) {
            return res.status(404).json({ message: "No Payment found" });
        }

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Payments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const createPayment = async (req: Request, res: Response) => {
    try {

        const newPayment: Payments = req.body;

        const result =  await paymentService.createPayment(newPayment);

        res.status(201).json(result);
        
    } catch (error) {
        console.error("Error fetching Payments:", error);
        res.status(400).json({ message: "Internal server error" });
    }
}


export const updatePaymentByid = async (req: Request, res: Response) => {
    try {
        const {id } = req.params;
        const PaymentUpdate: Payments = req.body;

        if (!id) {
            return res.status(400).json({ message: "Missing Payment ID in params" });
        }

        const result =  await paymentService.updatePaymentById(id, PaymentUpdate);

        if (!result) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Payments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deletePaymentByid = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Missing Payment ID in params" });
        }

        const result =  await paymentService.deletePaymentById(id);

        if (!result) {
            return res.status(404).json({ message: "Payment not found" });
        }   
        res.json({ success: result });
        
    } catch (error) {
        console.error("Error fetching Payments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getStats = async (req: Request, res: Response) => {
    try {
      const { tutorId } = req.params;

      if (!tutorId){
        return res.status(400).json({ message: "Missing tutor ID in params" });
      }
      const stats = await paymentService.totalTutorsStats(tutorId as unknown as Types.ObjectId);

      res.status(200).json({
        message: "Teacher statistics retrieved successfully",
        data: stats
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving statistics" });
    }
}
