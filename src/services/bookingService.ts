import { Types } from "mongoose";
import { IBookingRepository, IBookingService, Booking } from "../types/bookingsTypes";
import { Query } from "../types/reporsitoryTypes";
import { BookingRepository } from "../repositories/bookingRepositories";
import { IUserRepository } from "../types/usersTypes";
import { error } from "console";


export class BookingService implements IBookingService {
    private bookingRepository: IBookingRepository;
    private userRepository: IUserRepository;

    constructor(bookingRepository: IBookingRepository, userRepository: IUserRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    async countBookingsBystatus(tutorId: Types.ObjectId, status: string, date: Date): Promise<number> {
        return await this.bookingRepository.countByDocuments({ tutorId, status, date});
    }

    async recuentStudentsBookings(query: Query): Promise<number> {
        return await this.bookingRepository.recuentStudentsBookings( query );
    }

    async createBooking (booking: Booking): Promise<Booking> {
        return await this.bookingRepository.create(booking);
    }

    async findAllBookings (query?: Query): Promise<Booking[]> {
        return await this.bookingRepository.findAll(query);
    }

    async findBookingById (id: Types.ObjectId): Promise<Booking | null> {
        return await this.bookingRepository.findById(id);
    }

    async updateBookingById (id: Types.ObjectId, booking: Partial<Booking>): Promise<Booking | null> {
        return await this.bookingRepository.update(id, booking);
    }   

    async deleteBookingById (id: Types.ObjectId): Promise<boolean> {
        return await this.bookingRepository.delete(id);
    } 

    async getStudentsByTutorBooking(id: Types.ObjectId): Promise<{day: number, count: number}[]> {

        const tutorExist = this.userRepository.findById(id);

        if (!tutorExist){
            throw new Error ("Tutor no found");
        }

        const result = await this.bookingRepository.recuentStudentsForDays({ id });

        return result;
    }
}