import { Document, Types } from "mongoose";
import { Repository, Query} from "./reporsitoryTypes";


export interface Payments extends Document {
    bookingId: Types.ObjectId;
    tutorId: Types.ObjectId;
    studentId: Types.ObjectId;
    method: "card" | "bank_transfer" | "paypal";
    status: "pending" | "paid" | "failed";
    date: Date;
    currency: string;
    amount: number;
}

export interface IPaymentsRepository extends Repository<Payments> {
    findOne(query: Query): Promise<Payments | null>;
}

export interface IPaymentsService { 
    createPayment(payment: Payments): Promise<Payments>;
    findAllPayments(query?: Query): Promise<Payments[]>;
    findPaymentById(id: string): Promise<Payments | null>;
    updatePaymentById(id: string, payment: Partial<Payments>): Promise<Payments | null>;
    deletePaymentById(id: string): Promise<boolean>;
}