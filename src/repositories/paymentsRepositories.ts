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

    async findById(id: Types.ObjectId): Promise<Payments | null> {
        return await PaymentModel.findById(id).exec();
    }

    async update(id: Types.ObjectId, data: Partial<Payments>): Promise<Payments | null> {
        return await PaymentModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete (id: Types.ObjectId): Promise<boolean> {
        const result = await PaymentModel.findByIdAndDelete(id).exec();
        return result ? true : false;
    }

    async findOne (query: Query): Promise<Payments | null> {
        return await PaymentModel.findOne(query).exec();
    }



    /* Función que suma el total de plpata de las reservas completadas que un tutor ha hecho en una fecha dada**/
    async totalIncomeByTutor(query: Query): Promise<number> {
        const tutorId = query.tutorId;
        const datefilter = query.date;

        const resultBooking = await BookingModel.find({ tutorId: tutorId, date: datefilter}).select("_id").exec(); //Buscamos las tutorias  del tutorID
        const bookingIds = resultBooking.map(booking => booking._id); //Traemos solo el id

        //Buscamos en los pagos donde se encuentren los ids que ya tenemos de las reservas, en estados pagadas y sumamos los totales
        const result = await PaymentModel.aggregate([
            { $match: { bookingId: { $in: bookingIds}, status: "Pagada"}},
            { $group: { _id: null, total: { $sum: "$amount"}}}
        ]);

        return result[0]?.total || 0;
    }
}