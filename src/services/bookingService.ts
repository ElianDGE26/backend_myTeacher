import { Types } from "mongoose";
import { IBookingRepository, IBookingService, Booking } from "../types/bookingsTypes";
import { Query } from "../types/reporsitoryTypes";
import { BookingRepository } from "../repositories/bookingRepositories";


export class BookingService implements IBookingService {
    private bookingRepository: IBookingRepository;

    constructor(bookingRepository: IBookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async countBookingsBystatus(tutorId: Types.ObjectId, status: string): Promise<number> {
        return this.bookingRepository.countByDocuments({ tutorId, status});
    }

    async recuentStudentsBookings(tutorId: Types.ObjectId): Promise<number> {
        return this.bookingRepository.recuentStudentsBookings(tutorId);
    }

    async createBooking (booking: Booking): Promise<Booking> {
        return this.bookingRepository.create(booking);
    }

    async findAllBookings (query?: Query): Promise<Booking[]> {
        return this.bookingRepository.findAll(query);
    }

    async findBookingById (id: string): Promise<Booking | null> {
        return this.bookingRepository.findById(id);
    }

    async updateBookingById (id: string, booking: Partial<Booking>): Promise<Booking | null> {
        return this.bookingRepository.update(id, booking);
    }   

    async deleteBookingById (id: string): Promise<boolean> {
        return this.bookingRepository.delete(id);
    }  
}