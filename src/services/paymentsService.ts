import { timeStamp } from "console";
import { IBookingRepository } from "../types/bookingsTypes";
import { IPaymentsRepository, IPaymentsService, Payments } from "../types/paymentsTypes";
import { Query } from "../types/reporsitoryTypes";
import { Types } from "mongoose";


export class PaymentsService implements IPaymentsService {
    private paymentsRepository: IPaymentsRepository;
    private bookingRepository: IBookingRepository;

    constructor(paymentsRepository: IPaymentsRepository, bookingRepository: IBookingRepository) {
        this.paymentsRepository = paymentsRepository;
        this.bookingRepository = bookingRepository;
    }


    async totalTutorsStats(tutorId: Types.ObjectId): Promise<{
    students: number;
    income: number;
    canceledClasses: number;
    pendingRequests: number;
}> {
        const [ 
            students,
            income,
            canceledClasses,
            pendingRequests
        ] = await Promise.all([
            this.bookingRepository.recuentStudentsBookings(tutorId),
            this.paymentsRepository.totalIncomeBytutor(tutorId),
            this.bookingRepository.countByDocuments({ tutorId, status: "canceled"}),
            this.bookingRepository.countByDocuments({tutorId, status: "pending"})
        ]);

        return {
            students,
            income,
            canceledClasses,
            pendingRequests
        }
    }

    async createPayment (payment: Payments): Promise<Payments> {
        return this.paymentsRepository.create(payment);
    }

    async findAllPayments (query?: Query): Promise<Payments[]> {
        return this.paymentsRepository.findAll(query);
    }

    async findPaymentById (id: string): Promise<Payments | null> {
        return this.paymentsRepository.findById(id);
    }

    async updatePaymentById (id: string, payment: Partial<Payments>): Promise<Payments | null> {
        return this.paymentsRepository.update(id, payment);
    }   

    async deletePaymentById (id: string): Promise<boolean> {
        return this.paymentsRepository.delete(id);
    } 
}