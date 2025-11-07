import { Document, Types } from "mongoose";
import { Repository, Query} from "./reporsitoryTypes";


export interface Booking extends Document {
    studentId: Types.ObjectId;
    tutorId: Types.ObjectId;
    subjectId: Types.ObjectId;
    type: 'virtual' | 'in-person';
    location:string;
    status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'canceled';
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
}

export interface IBookingService { 
    createBooking(Booking: Booking): Promise<Booking>;
    findAllBookings(query?: Query): Promise<Booking[]>;
    findBookingById(id: string): Promise<Booking | null>;
    updateBookingById(id: string, booking: Partial<Booking>): Promise<Booking | null>;
    deleteBookingById(id: string): Promise<boolean>;
    countBookingsBystatus(tutorId: Types.ObjectId, status: string, date: Date): Promise<number>;
    recuentStudentsBookings(query: Query): Promise<number>;
    
}