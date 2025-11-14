import { Types } from "mongoose";
import { IPqrRepository, IPqrService, Pqr } from "../types/pqrTypes";
import { Query } from "../types/reporsitoryTypes";


export class PqrService implements IPqrService {
    private pqrRepository: IPqrRepository;

    constructor(pqrRepository: IPqrRepository) {
        this.pqrRepository = pqrRepository;
    }

    async createPqr (pqr: Pqr): Promise<Pqr> {
        return this.pqrRepository.create(pqr);
    }

    async findAllPqrs (query?: Query): Promise<Pqr[]> {
        return this.pqrRepository.findAll(query);
    }

    async findPqrById (id: Types.ObjectId): Promise<Pqr | null> {
        return this.pqrRepository.findById(id);
    }

    async updatePqrById (id: Types.ObjectId, pqr: Partial<Pqr>): Promise<Pqr | null> {
        return this.pqrRepository.update(id, pqr);
    }   

    async deletePqrById (id: Types.ObjectId): Promise<boolean> {
        return this.pqrRepository.delete(id);
    }  
}