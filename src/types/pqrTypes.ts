import { Document, Types } from "mongoose";
import { Repository, Query} from "./reporsitoryTypes";


export interface Pqr extends Document {
    userId: Types.ObjectId;
    comments:string;
    status: 'Abierta' | 'En progreso' | 'Cerrada';
}

export interface IPqrRepository extends Repository<Pqr> {
    findOne(query: Query): Promise<Pqr | null>;
}

export interface IPqrService {
    createPqr(pqr: Pqr): Promise<Pqr>;
    findAllPqrs(query?: Query): Promise<Pqr[]>;
    findPqrById(id: Types.ObjectId): Promise<Pqr | null>;
    updatePqrById(id: Types.ObjectId, pqr: Partial<Pqr>): Promise<Pqr | null>;
    deletePqrById(id: Types.ObjectId): Promise<boolean>;
}