
import cron from "node-cron";
import { IBookingRepository, IBookingService } from "../types/bookingsTypes";
import { BookingRepository } from "../repositories/bookingRepositories";
import { BookingService } from "../services/bookingService";
import { UserRepository } from "../repositories/userRepositories";
import { IUserRepository } from "../types/usersTypes";


const bookingRepository: IBookingRepository = new BookingRepository();
const userRepository: IUserRepository = new UserRepository();
const bookingService: IBookingService = new BookingService(bookingRepository, userRepository);

export const startBookingExpirationJob = (): void => {
    cron.schedule("* * * * *", async () => {
        try {
            await bookingService.expirePendingPayments();
        } catch (error) {
            console.error("Error in booking expiration job:", error);
        }
    });

    console.log("Booking expiration job started");
};
