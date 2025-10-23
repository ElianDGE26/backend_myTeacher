import { PaymentModel } from "../models/paymentsModels";
import { Query } from "../types/reporsitoryTypes";
import { IPaymentsRepository, Payments } from "../types/paymentsTypes";


export class PaymentsRepository implements IPaymentsRepository{


    async create(data: Payments): Promise<Payments> {
        const newPayment = new PaymentModel(data);
        return await newPayment.save();
    }

    async findAll(query?: Query): Promise<Payments[]> {
        return await PaymentModel.find(query || {}).exec();
    }   

    async findById(id: string): Promise<Payments | null> {
        return await PaymentModel.findById(id).exec();
    }

    async update(id: string, data: Partial<Payments>): Promise<Payments | null> {
        return await PaymentModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete (id: string): Promise<boolean> {
        const result = await PaymentModel.findByIdAndDelete(id).exec();
        return result ? true : false;
    }

    async findOne (query: Query): Promise<Payments | null> {
        return await PaymentModel.findOne(query).exec();
    }


}