/**
 * @fileoverview Controlador de Materias / Asignaturas (Subject Controller)
 * @module controllers/subjectControllers
 * @description Maneja las operaciones CRUD de materias y búsquedas especializadas para encontrar docentes por materia y listar materias impartidas por un tutor.
 */

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

/**
 * Obtiene todas las materias registradas en la plataforma.
 *
 * @route GET /api/subjects
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Array con todas las materias.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
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

/**
 * Obtiene la información detallada de una materia por su ID.
 *
 * @route GET /api/subjects/:id
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.id - Identificador único (ObjectId) de la materia.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Objeto con la información de la materia.
 * @returns {Promise<Response>} 400 - Parámetro ID ausente.
 * @returns {Promise<Response>} 404 - Formato de ID inválido o materia no encontrada.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
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

/**
 * Crea una nueva materia vinculada a un tutor.
 *
 * @route POST /api/subjects/create
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Subject} req.body - Datos de la materia (name, description, tutorId, price, etc.).
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 201 - Materia creada exitosamente.
 * @returns {Promise<Response>} 400 - Error en los datos proporcionados o al guardar.
 */
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

/**
 * Actualiza los datos de una materia existente por su ID.
 *
 * @route PUT /api/subjects/update/:id
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.id - Identificador único (ObjectId) de la materia.
 * @param {Subject} req.body - Campos actualizados de la materia.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Materia actualizada.
 * @returns {Promise<Response>} 400 - Parámetro ID ausente.
 * @returns {Promise<Response>} 404 - Formato de ID inválido o materia no encontrada.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
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

/**
 * Elimina una materia de la base de datos por su ID.
 *
 * @route DELETE /api/subjects/delete/:id
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.id - Identificador único (ObjectId) de la materia.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Objeto de confirmación `{ success: boolean }`.
 * @returns {Promise<Response>} 400 - Parámetro ID ausente.
 * @returns {Promise<Response>} 404 - Formato de ID inválido o materia no encontrada.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
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

/**
 * Busca materias por nombre y devuelve los docentes/tutores que las imparten junto con su información relevante.
 * Utilizado por el buscador de materias de los estudiantes.
 *
 * @route GET /api/subjects/UserSubjects/:subjectName
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.subjectName - Nombre o término de búsqueda de la materia.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Lista de profesores y materias coincidentes.
 * @returns {Promise<Response>} 400 - Nombre de materia ausente en los parámetros.
 * @returns {Promise<Response>} 404 - No se encontraron materias ni docentes con ese nombre.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
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

/**
 * Obtiene el listado de materias impartidas por un tutor específico.
 * Utilizado para que el tutor consulte sus propias asignaturas registradas.
 *
 * @route GET /api/subjects/subjectsBytutorId/:tutorId
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.tutorId - Identificador único del tutor.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Array con las materias dictadas por el tutor.
 * @returns {Promise<Response>} 400 - Parámetro tutorId ausente.
 * @returns {Promise<Response>} 404 - No se encontraron materias para el tutor especificado.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
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

