import { Document } from "mongodb";
import { Types } from "mongoose";
import { Repository, Query } from "./reporsitoryTypes";

export interface Availability extends Document {
    tutorId: Types.ObjectId;
    date?: Date;
    dayOfWeek?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    startTime: string; // formato "HH:mm"
    endTime: string;   // formato "HH:mm"
    isRecurring: boolean;
    active?: boolean;
}

export interface IAvailabilityRepository extends Repository<Availability> {
    findOne(query: Query): Promise<Availability | null>;
}

export interface IAvailabilityService {
    createAvailability(availability: Availability): Promise<Availability>;
    findAllAvailabilities(query?: Query): Promise<Availability[]>;
    findAvailabilityById(id: string): Promise<Availability | null>;
    updateAvailabilityById(id: string, availability: Partial<Availability>): Promise<Availability | null>;
    deleteAvailabilityById(id: string): Promise<boolean>;
}