import { SubjectModel } from "../models/subjectModels";
import { Query } from "../types/reporsitoryTypes";
import { ISubjectRepository, Subject } from "../types/subjectsTypes";
import { Types } from "mongoose";


export class SubjectRepository implements ISubjectRepository{


    async create(data: Subject): Promise<Subject> {
        const newSubject = new SubjectModel(data);
        return await newSubject.save();
    }

    async findAll(query?: Query): Promise<Subject[]> {
        return await SubjectModel.find(query || {}).exec();
    }   

    async findById(id: Types.ObjectId): Promise<Subject | null> {
        return await SubjectModel.findById(id).exec();
    }

    async update(id: Types.ObjectId, data: Partial<Subject>): Promise<Subject | null> {
        return await SubjectModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete (id: Types.ObjectId): Promise<boolean> {
        const result = await SubjectModel.findByIdAndDelete(id).exec();
        return result ? true : false;
    }

    async findOne (query: Query): Promise<Subject | null> {
        return await SubjectModel.findOne(query).exec();
    }

    /**Funcion para obetener las materias con la información del tutor para hacer una reserva */
    async findTeachersBySubject(query?: Query): Promise<any[]> {

        let subjectName = (query?.name as string) || "";
        subjectName = subjectName.trim().replace(/^:/, "");

        // Normalizamos la palabra a buscar (quitamos tildes y pasamos a minúsculas)
        const normalized = subjectName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const allSubjects = await SubjectModel.find().populate('tutorId', '-password').lean(); //traemos las materias con la información del tutor sin la contraseña; y limpiamos


        const filtered = allSubjects.filter(s => 
            s.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
            .includes(normalized)
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