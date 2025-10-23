import { IPaymentsRepository, IPaymentsService, Payments } from "../types/paymentsTypes";
import { Query } from "../types/reporsitoryTypes";


export class PaymentsService implements IPaymentsService {
    private paymentsRepository: IPaymentsRepository;

    constructor(paymentsRepository: IPaymentsRepository) {
        this.paymentsRepository = paymentsRepository;
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