import { Types } from "mongoose";
import { Query } from "../types/reporsitoryTypes";
import { ISubjectRepository, ISubjectService, Subject } from "../types/subjectsTypes";


export class SubjectService implements ISubjectService {
    private subjectRepository: ISubjectRepository;

    constructor(subjectRepository: ISubjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    async createSubject (subject: Subject): Promise<Subject> {
        return this.subjectRepository.create(subject);
    }

    async findAllSubjects (query?: Query): Promise<Subject[]> {
        return this.subjectRepository.findAll(query);
    }

    async findSubjectById (id: Types.ObjectId): Promise<Subject | null> {
        return this.subjectRepository.findById(id);
    }

    async updateSubjectById (id: Types.ObjectId, subject: Partial<Subject>): Promise<Subject | null> {
        return this.subjectRepository.update(id, subject);
    }   

    async deleteSubjectById (id: Types.ObjectId): Promise<boolean> {
        return this.subjectRepository.delete(id);
    }

    async findTeachersBySubject (query?: Query): Promise<Subject[]> {
        return this.subjectRepository.findTeachersBySubject(query);
    }

    async findSubjectsByTutorId(tutorId: Types.ObjectId): Promise<Subject[]> {
        return this.subjectRepository.findAll({ tutorId });
    }
}