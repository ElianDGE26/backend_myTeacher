import { Document, Types } from "mongoose";
import { Repository, Query} from "./reporsitoryTypes";

export interface Subject extends Document {
    name: string;
    educationLevel: 'Primary' | 'Secundary' | 'high school' | 'University' | 'Postgraduate';
    description?: string;
    price: number;
    tutorId: Types.ObjectId;
}

export interface ISubjectRepository extends Repository<Subject> {
    findOne(query: Query): Promise<Subject | null>;
}

export interface ISubjectService {
    createSubject(subject: Subject): Promise<Subject>;
    findAllSubjects(query?: Query): Promise<Subject[]>;
    findSubjectById(id: string): Promise<Subject | null>;
    updateSubjectById(id: string, subject: Partial<Subject>): Promise<Subject | null>;
    deleteSubjectById(id: string): Promise<boolean>;
}   