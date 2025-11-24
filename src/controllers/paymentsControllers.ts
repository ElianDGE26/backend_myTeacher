import {   IPaymentsRepository,   IPaymentsService,   Payments, } from "../types/paymentsTypes";
import { IBookingRepository,  IBookingService, Booking, } from "../types/bookingsTypes";
import { BookingService } from "../services/bookingService";
import { IUserRepository } from "../types/usersTypes";
import { UserRepository } from "../repositories/userRepositories";
import { PaymentsRepository } from "../repositories/paymentsRepositories";
import { BookingRepository } from "../repositories/bookingRepositories";
import { PaymentsService } from "../services/paymentsService";
import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";

const paymentRepository: IPaymentsRepository = new PaymentsRepository();
const bookingRepository: IBookingRepository = new BookingRepository();
const paymentService: IPaymentsService = new PaymentsService( paymentRepository, bookingRepository );
const userRepository: IUserRepository = new UserRepository();
const bookingService: IBookingService = new BookingService(bookingRepository, userRepository);

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const result = await paymentService.findAllPayments();

    res.json(result);
  } catch (error) {
    console.error("Error fetching Payments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPaymentByid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing Payment ID in params" });
    }

    //se valida que el id si sea de tipo Object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid Booking Id" });
    }

    const result = await paymentService.findPaymentById(new mongoose.Types.ObjectId(id));

    if (!result) {
      return res.status(404).json({ message: "No Payment found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching Payments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createPayment = async (req: Request, res: Response) => {
  try {
    const newPayment: Payments = req.body;

    const result = await paymentService.createPayment(newPayment);

    res.status(201).json(result);
  } catch (error) {
    console.error("Error fetching Payments:", error);
    res.status(400).json({ message: "Internal server error" });
  }
};

export const updatePaymentByid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const PaymentUpdate: Payments = req.body;

    if (!id) {
      return res.status(400).json({ message: "Missing Payment ID in params" });
    }

    //se valida que el id si sea de tipo Object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid Booking Id" });
    }

    const result = await paymentService.updatePaymentById(
      new mongoose.Types.ObjectId(id),
      PaymentUpdate
    );

    if (!result) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching Payments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePaymentByid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing Payment ID in params" });
    }

    //se valida que el id si sea de tipo Object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid Booking Id" });
    }

    const result = await paymentService.deletePaymentById(
      new mongoose.Types.ObjectId(id)
    );

    if (!result) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json({ success: result });
  } catch (error) {
    console.error("Error fetching Payments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.params;

    if (!tutorId) {
      return res.status(400).json({ message: "Missing tutor ID in params" });
    }

    if (!mongoose.Types.ObjectId.isValid(tutorId)) {
      return res.status(404).json({ message: "Invalid Tutor Id" });
    }

    const id = new mongoose.Types.ObjectId(tutorId);

    // Ejecutar todas las promesas SIN romper ejecución usando allSettled
    const results = await Promise.allSettled([
      paymentService.totalTutorsStats(id),
      bookingService.getStudentsByTutorBooking(id),
      bookingService.getNextTwoBookingsForTutor(id, "Aceptada")
    ]);

    const [statsResult, studentsResult, nextBookingsResult] = results;

    const response = {
      message: "Teacher statistics retrieved",
      stats: statsResult.status === "fulfilled" ? statsResult.value : null,
      //statsError: statsResult.status === "rejected" ? statsResult.reason.message : null,

      students: studentsResult.status === "fulfilled" ? studentsResult.value : null,
      //studentsError: studentsResult.status === "rejected" ? studentsResult.reason.message : null,

      nextBookings:
        nextBookingsResult.status === "fulfilled" ? nextBookingsResult.value : null,
      //nextBookingsError: nextBookingsResult.status === "rejected" ? nextBookingsResult.reason.message : null
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Unexpected error retrieving statistics",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
