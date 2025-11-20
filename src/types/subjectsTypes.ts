import { Document, Types } from "mongoose";
import { Repository, Query} from "./reporsitoryTypes";

export interface Subject extends Document {
    name: string;
    educationLevel: 'Primary' | 'Secondary' | 'University' | 'Postgraduate';
    description: string;
    price: number;
    tutorId: Types.ObjectId;
}

export interface ISubjectRepository extends Repository<Subject> {
    findOne(query: Query): Promise<Subject | null>;
    findTeachersBySubject(query?: Query): Promise<Subject[]>; 
}

export interface ISubjectService {
    createSubject(subject: Subject): Promise<Subject>;
    findAllSubjects(query?: Query): Promise<Subject[]>;
    findSubjectById(id: Types.ObjectId): Promise<Subject | null>;
    updateSubjectById(id: Types.ObjectId, subject: Partial<Subject>): Promise<Subject | null>;
    deleteSubjectById(id: Types.ObjectId): Promise<boolean>;
    findTeachersBySubject(query?: Query): Promise<any[]>;
    findSubjectsByTutorId(tutorId: Types.ObjectId): Promise<Subject[]>;
}   