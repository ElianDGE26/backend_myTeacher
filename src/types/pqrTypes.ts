import { Document, Types } from "mongoose";
import { Repository, Query} from "./reporsitoryTypes";


export interface Pqr extends Document {
    userId: Types.ObjectId;
    comments:string;
    status: 'open' | 'in_progress' | 'closed';
}

export interface IPqrRepository extends Repository<Pqr> {
    findOne(query: Query): Promise<Pqr | null>;
}

export interface IPqrService {
    createPqr(pqr: Pqr): Promise<Pqr>;
    findAllPqrs(query?: Query): Promise<Pqr[]>;
    findPqrById(id: string): Promise<Pqr | null>;
    updatePqrById(id: string, pqr: Partial<Pqr>): Promise<Pqr | null>;
    deletePqrById(id: string): Promise<boolean>;
}