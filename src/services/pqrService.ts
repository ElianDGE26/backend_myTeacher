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

    async findPqrById (id: string): Promise<Pqr | null> {
        return this.pqrRepository.findById(id);
    }

    async updatePqrById (id: string, pqr: Partial<Pqr>): Promise<Pqr | null> {
        return this.pqrRepository.update(id, pqr);
    }   

    async deletePqrById (id: string): Promise<boolean> {
        return this.pqrRepository.delete(id);
    }  
}