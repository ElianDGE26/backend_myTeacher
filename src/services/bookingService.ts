import { Types } from "mongoose";
import { IBookingRepository, IBookingService, Booking } from "../types/bookingsTypes";
import { Query } from "../types/reporsitoryTypes";
import { BookingRepository } from "../repositories/bookingRepositories";
import { IUserRepository } from "../types/usersTypes";
import { error } from "console";
import CustomError from "../utils/CustomError";


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

    /** Servicio para obtener la cantidad de estudiantes por cada dia del mes en el que se hizo una tutoria completa */
    async getStudentsByTutorBooking(tutorId: Types.ObjectId): Promise<{day: number, count: number}[]> {

        const tutorExist = this.userRepository.findById(tutorId);

        if (!tutorExist){
            throw new Error ("Tutor no found");
        }

        const result = await this.bookingRepository.recuentStudentsForDays({ tutorId });
        //console.log('result1 :>> ', result);

        if (result === undefined) {
            throw new Error("Result es undefined");
        }

        if(result.length == 0) {
            return [];
        }

        return result;
    }


    async getNextTwoBookingsForTutor(tutorId: Types.ObjectId, status: String): Promise<any[]> {

        if(!await this.userRepository.findById(tutorId)){
            throw new Error("User not found");
        }

        const result = await this.bookingRepository.nextBooking(tutorId, status);
        //console.log('result :>> ', result);

        if (result === undefined) {
            throw new Error("Result es undefined");
        }

        if(result.length == 0) {
            return [];
        }

        return result;
    }
}