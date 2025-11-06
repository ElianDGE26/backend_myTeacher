import { ISubjectRepository, ISubjectService } from "../types/subjectsTypes";
import { SubjectRepository } from "../repositories/subjectRepositories";
import { SubjectService } from "../services/subjectService";
import { Subject} from "../types/subjectsTypes";
import { Request, Response } from "express";

const subjectRepository: ISubjectRepository = new SubjectRepository();
const subjectService: ISubjectService = new SubjectService(subjectRepository);



export const getAllSubjects = async (req: Request, res: Response) => {
    try {

        console.log('req :>> ', req.currentUser);
        const result =  await subjectService.findAllSubjects();

        if (result.length === 0) {
            return res.status(404).json({ message: "No subjects found" });
        }

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Subjects:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getSubjectByid = async (req: Request, res: Response) => {
    try {
        const { id} = req.params;

        if (!id) {
            return res.status(400).json({ message: "Missing Subject ID in params" });
        }
        
        const result =  await subjectService.findSubjectById(id);

        if (!result) {
            return res.status(404).json({ message: "No Subject found" });
        }

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Subjects:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const createSubject = async (req: Request, res: Response) => {
    try {

        const newSubject: Subject = req.body;

        const result =  await subjectService.createSubject(newSubject);

        res.status(201).json(result);
        
    } catch (error) {
        console.error("Error fetching Subjects:", error);
        res.status(400).json({ message: "Internal server error" });
    }
}


export const updateSubjectByid = async (req: Request, res: Response) => {
    try {
        const {id } = req.params;
        const subjectUpdate: Subject = req.body;

        if (!id) {
            return res.status(400).json({ message: "Missing Subject ID in params" });
        }

        const result =  await subjectService.updateSubjectById(id, subjectUpdate);

        if (!result) {
            return res.status(404).json({ message: "Subject not found" });
        }

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Subjects:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteSubjectByid = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Missing Subject ID in params" });
        }

        const result =  await subjectService.deleteSubjectById(id);

        if (!result) {
            return res.status(404).json({ message: "Subject not found" });
        }   
        res.json({ success: result });
        
    } catch (error) {
        console.error("Error fetching Subjects:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const findUserBySubjectName = async (req: Request, res: Response) => {
    try {

        const { subjectName } = req.params;

        if (!subjectName){
            return res.status(400).json({ message: "Missing subject name in params"});
        }

        const result = await subjectService.findTeachersBySubject({ name: subjectName });

        if (result.length === 0) {
            return res.status(404).json({ message: "No subjects found with the given name"});
        }

        res.json(result);
        
    } catch (error) {
        console.log('Error obteniendo los usuarios por codigo de materias :>> ', error);
        res.status(500).json({ message: "Internal server error"})
    }
}

export const findSubjectByTutorId = async (req: Request, res: Response) => {
    try {
        console.log("tutorId recibido:", req.body.tutorId);

        const { tutorId } = req.body;

        if(!tutorId) {
            return res.status(400).json({ message: "Missing tutorId in request body"});
        }

        const result = await subjectService.findAllSubjects({ tutorId});

        if (result.length === 0) {
            return res.status(404).json({ message: "No subjects found for the given tutorId"});
        }

        res.json(result);


    } catch (error) {
        console.error("Error fetching Subjects by tutorId:", error);
        res.status(500).json({ message: "Internal Server Error"})
    }
}