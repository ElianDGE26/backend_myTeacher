import { Document, Types } from "mongoose";
import { Repository, Query} from "./reporsitoryTypes";


export interface Payments extends Document {
    bookingId: Types.ObjectId;
    method: "card" | "bank_transfer" | "paypal";
    status: "pending" | "paid" | "failed";
    date: Date;
    currency: string;
    amount: number;
}

export interface IPaymentsRepository extends Repository<Payments> {
    findOne(query: Query): Promise<Payments | null>;
    totalIncomeByTutor(query: Query): Promise<number>;
}

export interface IPaymentsService { 
    createPayment(payment: Payments): Promise<Payments>;
    findAllPayments(query?: Query): Promise<Payments[]>;
    findPaymentById(id: Types.ObjectId): Promise<Payments | null>;
    updatePaymentById(id: Types.ObjectId, payment: Partial<Payments>): Promise<Payments | null>;
    deletePaymentById(id: Types.ObjectId): Promise<boolean>;
    totalTutorsStats(tutorId: Types.ObjectId): Promise<{
    students: number;
    income: number;
    canceledClasses: number;
    pendingRequests: number;
    studentsLastPerium: number;
    incomeLastPerium: number;
    canceledClassesLastPerium: number;
    pendingRequestsLastPerium: number;
    diferenceIncomePercentage: number;
    diferenceStudents: number;
    diferenceCanceledClasses: number;
    diferencePendingRequests: number;
}>
}