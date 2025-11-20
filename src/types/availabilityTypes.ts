import { Document } from "mongodb";
import { Types } from "mongoose";
import { Repository, Query } from "./reporsitoryTypes";

export interface Availability extends Document {
    tutorId: Types.ObjectId;
    date?: Date;
    dayOfWeek?: 'Lunnes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
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
    findAvailabilityById(id: Types.ObjectId): Promise<Availability | null>;
    updateAvailabilityById(id: Types.ObjectId, availability: Partial<Availability>): Promise<Availability | null>;
    deleteAvailabilityById(id: Types.ObjectId): Promise<boolean>;
}