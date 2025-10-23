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


}