import { Document, Types } from "mongoose";
import { Repository, Query} from "./reporsitoryTypes";


export interface Booking extends Document {
    studentId: Types.ObjectId;
    tutorId: Types.ObjectId;
    subjectId: Types.ObjectId;
    type: 'virtual' | 'Presencial';
    location:string;
    status: 'Pendiente' | 'Aceptada' | 'Rechazada' | 'Completada' | 'Cancelada';
    date: Date;
    startTime: string;
    endTime: string;
    videoCallLink?: string;
    price: number;
}

export interface IBookingRepository extends Repository<Booking> {
    findOne(query: Query): Promise<Booking | null>;
    countByDocuments(query: Query): Promise<number>;
    recuentStudentsBookings(query: Query): Promise<number>;
    recuentStudentsForDays(query: Query): Promise<{day: number, count: number}[]>;
}

export interface IBookingService { 
    createBooking(Booking: Booking): Promise<Booking>;
    findAllBookings(query?: Query): Promise<Booking[]>;
    findBookingById(id: Types.ObjectId): Promise<Booking | null>;
    updateBookingById(id: Types.ObjectId, booking: Partial<Booking>): Promise<Booking | null>;
    deleteBookingById(id: Types.ObjectId): Promise<boolean>;
    countBookingsBystatus(tutorId: Types.ObjectId, status: string, date: Date): Promise<number>;
    recuentStudentsBookings(query: Query): Promise<number>;
    getStudentsByTutorBooking(id: Types.ObjectId): Promise<{day: number, count: number}[]>;
}
