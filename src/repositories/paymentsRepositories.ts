import { PaymentModel } from "../models/paymentsModels";
import { BookingModel } from "../models/bookingModels";
import { Query } from "../types/reporsitoryTypes";
import { IPaymentsRepository, Payments } from "../types/paymentsTypes";
import { Types } from "mongoose";


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

    async totalIncomeByTutor(query: Query): Promise<number> {
        const tutorId = query.tutorId;
        const datefilter = query.date;

        const resultBooking = await BookingModel.find({ tutorId: tutorId, date: datefilter}).select("_id").exec();
        const bookingIds = resultBooking.map(booking => booking._id);

        const result = await PaymentModel.aggregate([
            { $match: { bookingId: { $in: bookingIds}, status: "paid"}},
            { $group: { _id: null, total: { $sum: "$amount"}}}
        ]);

        return result[0]?.total || 0;
    }





}