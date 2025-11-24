import { ISubjectRepository, ISubjectService } from "../types/subjectsTypes";
import { SubjectRepository } from "../repositories/subjectRepositories";
import { SubjectService } from "../services/subjectService";
import { Subject } from "../types/subjectsTypes";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { IAvailabilityRepository } from "../types/availabilityTypes";
import { AvailabilityRepository } from "../repositories/availabilityRepositories";

const subjectRepository: ISubjectRepository = new SubjectRepository();
const availabilityRepository: IAvailabilityRepository = new AvailabilityRepository();
const subjectService: ISubjectService = new SubjectService(subjectRepository, availabilityRepository);

export const getAllSubjects = async (req: Request, res: Response) => {
  try {
    console.log("req :>> ", req.currentUser);
    const result = await subjectService.findAllSubjects();

    res.json(result);
  } catch (error) {
    console.error("Error fetching Subjects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubjectByid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing Subject ID in params" });
    }

    //se valida que el id si sea de tipo Object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid Booking Id" });
    }

    const result = await subjectService.findSubjectById(
      new mongoose.Types.ObjectId(id)
    );

    if (!result) {
      return res.status(404).json({ message: "No Subject found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching Subjects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createSubject = async (req: Request, res: Response) => {
  try {
    const newSubject: Subject = req.body;

    const result = await subjectService.createSubject(newSubject);

    res.status(201).json(result);
  } catch (error) {
    console.error("Error fetching Subjects:", error);
    res.status(400).json({ message: "Internal server error" });
  }
};

export const updateSubjectByid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subjectUpdate: Subject = req.body;

    if (!id) {
      return res.status(400).json({ message: "Missing Subject ID in params" });
    }

    //se valida que el id si sea de tipo Object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid Booking Id" });
    }

    const result = await subjectService.updateSubjectById(
      new mongoose.Types.ObjectId(id),
      subjectUpdate
    );

    if (!result) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching Subjects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSubjectByid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing Subject ID in params" });
    }

    //se valida que el id si sea de tipo Object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid Booking Id" });
    }

    const result = await subjectService.deleteSubjectById(
      new mongoose.Types.ObjectId(id)
    );

    if (!result) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json({ success: result });
  } catch (error) {
    console.error("Error fetching Subjects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* 
controlador para el buscador de las materias y que devuelva los docentes que hay disponnibles
*/
export const findUserBySubjectName = async (req: Request, res: Response) => {
  try {
    const { subjectName } = req.params;

    if (!subjectName) {
      return res
        .status(400)
        .json({ message: "Missing subject name in params" });
    }

    const result = await subjectService.findTeachersBySubject({
      name: subjectName,
    });

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No subjects found with the given name" });
    }

    res.json(result);
  } catch (error) {
    console.log(
      "Error obteniendo los usuarios por codigo de materias :>> ",
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

/* 
Controlador para que el mismo tutor pueda ver las materias que imparte
*/
export const findSubjectByTutorId = async (req: Request, res: Response) => {
  try {
    console.log("tutorId recibido:", req.params);

    const { tutorId } = req.params;

    if (!tutorId) {
      return res
        .status(400)
        .json({ message: "Missing tutorId in request body" });
    }

    const result = await subjectService.findAllSubjects({ tutorId });

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No subjects found for the given tutorId" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching Subjects by tutorId:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
