import { IAvailabilityRepository, IAvailabilityService, Availability } from "../types/availabilityTypes";
import { Query } from "../types/reporsitoryTypes";


export class AvailabilityService implements IAvailabilityService {
    private availabilityRepository: IAvailabilityRepository;

    constructor(AvailabilityRepository: IAvailabilityRepository) {
        this.availabilityRepository = AvailabilityRepository;
    }

    async createAvailability (availability: Availability): Promise<Availability> {
        return this.availabilityRepository.create(availability);
    }

    async findAllAvailabilities (query?: Query): Promise<Availability[]> {
        return this.availabilityRepository.findAll(query);
    }

    async findAvailabilityById (id: string): Promise<Availability | null> {
        return this.availabilityRepository.findById(id);
    }

    async updateAvailabilityById (id: string, availability: Partial<Availability>): Promise<Availability | null> {
        return this.availabilityRepository.update(id, availability);
    }   

    async deleteAvailabilityById (id: string): Promise<boolean> {
        return this.availabilityRepository.delete(id);
    }  
}