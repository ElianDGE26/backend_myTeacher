/**
 * @fileoverview Enrutador de Materias/Asignaturas (Subject Routes)
 * @module routes/subjectRoutes
 * @description Define las rutas HTTP para la gestión de materias o áreas académicas impartidas por los tutores en la plataforma.
 * Base path: `/api/subjects`
 */

import { Router } from "express";
import { 
    createSubject, 
    getAllSubjects, 
    getSubjectByid, 
    updateSubjectByid, 
    deleteSubjectByid, 
    findUserBySubjectName, 
    findSubjectByTutorId
} from "../controllers/subjectControllers";
import { verifyToken } from "../middelwears/authMiddelwears";

const router = Router();

// ==========================================
// Rutas GET
// ==========================================

/**
 * Busca usuarios (tutores) asociados a una materia específica identificada por su nombre.
 *
 * @name GET /UserSubjects/:subjectName
 * @route GET /api/subjects/UserSubjects/:subjectName
 * @access Privado
 * @middleware verifyToken
 * @param {string} subjectName.path.required - Nombre de la materia académica a consultar.
 */
router.get("/UserSubjects/:subjectName", verifyToken, findUserBySubjectName);

/**
 * Obtiene todas las materias académicas impartidas por un tutor específico.
 *
 * @name GET /subjectsBytutorId/:tutorId
 * @route GET /api/subjects/subjectsBytutorId/:tutorId
 * @access Privado
 * @middleware verifyToken
 * @param {string} tutorId.path.required - ID de MongoDB (ObjectId) del tutor.
 */
router.get("/subjectsBytutorId/:tutorId", verifyToken, findSubjectByTutorId);

/**
 * Obtiene el catálogo completo de materias registradas en la plataforma.
 *
 * @name GET /
 * @route GET /api/subjects/
 * @access Privado
 * @middleware verifyToken
 */
router.get("/", verifyToken, getAllSubjects);

/**
 * Obtiene los detalles de una materia específica por su ID.
 *
 * @name GET /:id
 * @route GET /api/subjects/:id
 * @access Privado
 * @middleware verifyToken
 * @param {string} id.path.required - ID de MongoDB (ObjectId) de la materia.
 */
router.get("/:id", verifyToken, getSubjectByid);

// ==========================================
// Rutas POST
// ==========================================

/**
 * Crea y registra una nueva materia académica en el sistema.
 *
 * @name POST /create
 * @route POST /api/subjects/create
 * @access Privado
 * @middleware verifyToken
 * @param {Subject} body.body.required - Datos de la materia (name, description, level, tutorId, hourlyRate, active).
 */
router.post("/create", verifyToken, createSubject);

// ==========================================
// Rutas PUT
// ==========================================

/**
 * Actualiza los datos de una materia existente por su ID.
 *
 * @name PUT /update/:id
 * @route PUT /api/subjects/update/:id
 * @access Privado
 * @middleware verifyToken
 * @param {string} id.path.required - ID de MongoDB (ObjectId) de la materia.
 * @param {Partial<Subject>} body.body.required - Campos a modificar.
 */
router.put("/update/:id", verifyToken, updateSubjectByid);

// ==========================================
// Rutas DELETE
// ==========================================

/**
 * Elimina una materia de la base de datos por su ID.
 *
 * @name DELETE /delete/:id
 * @route DELETE /api/subjects/delete/:id
 * @access Privado
 * @middleware verifyToken
 * @param {string} id.path.required - ID de MongoDB (ObjectId) de la materia a eliminar.
 */
router.delete("/delete/:id", verifyToken, deleteSubjectByid);

export default router;


