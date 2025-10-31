import { SubjectModel } from "../models/subjectModels";
import { Query } from "../types/reporsitoryTypes";
import { ISubjectRepository, Subject } from "../types/subjectsTypes";


export class SubjectRepository implements ISubjectRepository{


    async create(data: Subject): Promise<Subject> {
        const newSubject = new SubjectModel(data);
        return await newSubject.save();
    }

    async findAll(query?: Query): Promise<Subject[]> {
        return await SubjectModel.find(query || {}).exec();
    }   

    async findById(id: string): Promise<Subject | null> {
        return await SubjectModel.findById(id).exec();
    }

    async update(id: string, data: Partial<Subject>): Promise<Subject | null> {
        return await SubjectModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete (id: string): Promise<boolean> {
        const result = await SubjectModel.findByIdAndDelete(id).exec();
        return result ? true : false;
    }

    async findOne (query: Query): Promise<Subject | null> {
        return await SubjectModel.findOne(query).exec();
    }


    async findTeachersBySubject(query?: Query): Promise<any[]> {
        const allSubjects = await this.SubjectModel.find().populate('tutorId', '-_id -password');

        const filtered = allSubjects.filter(s =>
            s.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
            .includes(subjectName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
        );

        return filtered;

    }

    


}

function normalizeString(str: string): string {
    return str
        .normalize("NFD")            // descompone acentos
        .replace(/[\u0300-\u036f]/g, "") // elimina marcas diacríticas
        .toLowerCase();
}