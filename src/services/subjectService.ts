/**
 * @fileoverview Servicio de Materias y Asignaturas (Subject Service)
 * @module services/subjectService
 * @description Capa de lógica de negocio para la gestión de asignaturas impartidas, agregación de tutores y cruce con sus horarios de disponibilidad para el motor de búsqueda.
 */

import { Types } from "mongoose";
import { Query } from "../types/reporsitoryTypes";
import { ISubjectRepository, ISubjectService, Subject } from "../types/subjectsTypes";
import { IAvailabilityRepository } from "../types/availabilityTypes";

/**
 * Servicio encargado de la gestión de materias y la búsqueda avanzada de profesores por asignatura.
 * Implementa la interfaz `ISubjectService`.
 *
 * @class SubjectService
 * @implements {ISubjectService}
 */
export class SubjectService implements ISubjectService {
    private subjectRepository: ISubjectRepository;
    private availabilityRepository: IAvailabilityRepository;

    /**
     * Inicializa una nueva instancia de SubjectService inyectando los repositorios necesarios.
     *
     * @constructor
     * @param {ISubjectRepository} subjectRepository - Repositorio para persistencia de materias.
     * @param {IAvailabilityRepository} availabilityRepository - Repositorio para consultar disponibilidades horarias de los tutores.
     */
    constructor(subjectRepository: ISubjectRepository,availabilityRepository: IAvailabilityRepository) {
        this.subjectRepository = subjectRepository;
        this.availabilityRepository = availabilityRepository;
    }

    /**
     * Registra una nueva materia vinculada a un tutor.
     *
     * @async
     * @param {Subject} subject - Objeto con los datos de la materia (name, description, tutorId, price, etc.).
     * @returns {Promise<Subject>} Promesa que resuelve con la materia creada.
     */
    async createSubject (subject: Subject): Promise<Subject> {
        return this.subjectRepository.create(subject);
    }

    /**
     * Obtiene una lista de materias según criterios de filtrado opcionales.
     *
     * @async
     * @param {Query} [query] - Criterios de búsqueda y filtrado (ej: tutorId, name).
     * @returns {Promise<Subject[]>} Promesa que resuelve con el array de materias encontradas.
     */
    async findAllSubjects (query?: Query): Promise<Subject[]> {
        return this.subjectRepository.findAll(query);
    }

    /**
     * Busca una materia específica por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la materia.
     * @returns {Promise<Subject | null>} Promesa que resuelve con la materia encontrada o null si no existe.
     */
    async findSubjectById (id: Types.ObjectId): Promise<Subject | null> {
        return this.subjectRepository.findById(id);
    }

    /**
     * Actualiza la información de una materia existente por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la materia.
     * @param {Partial<Subject>} subject - Campos actualizados de la materia.
     * @returns {Promise<Subject | null>} Promesa que resuelve con la materia actualizada o null.
     */
    async updateSubjectById (id: Types.ObjectId, subject: Partial<Subject>): Promise<Subject | null> {
        return this.subjectRepository.update(id, subject);
    }   

    /**
     * Elimina una materia de la base de datos por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la materia a eliminar.
     * @returns {Promise<boolean>} Promesa que resuelve con true si fue eliminada, o false en caso contrario.
     */
    async deleteSubjectById (id: Types.ObjectId): Promise<boolean> {
        return this.subjectRepository.delete(id);
    }

    /**
     * Búsqueda especializada para el motor de exploración de materias:
     * 1. Consulta las materias coincidentes poblando los datos del tutor asociado.
     * 2. Extrae los identificadores únicos de los tutores.
     * 3. Consulta en paralelo las disponibilidades activas de dichos tutores.
     * 4. Ensambla y retorna cada materia integrando el objeto del tutor con su array de disponibilidades correspondientes.
     *
     * @async
     * @param {Query} [query] - Criterios de búsqueda (ej: `{ name: string }`).
     * @returns {Promise<any[]>} Promesa que resuelve con un array de materias enriquecidas con la información y disponibilidad del tutor.
     */
    async findTeachersBySubject (query?: Query): Promise<any[]> {
        // Obtenemos las materias (subjects) con tutor ya poblado
        const subjects = await this.subjectRepository.findTeachersBySubject(query);

        // Obtener los IDs de los tutores
        const tutorIds = subjects
            .map(s => s.tutorId?._id?.toString())
            .filter(Boolean) as string[];

        // Eliminar duplicados
        const uniqueTutorIds = [...new Set(tutorIds)];

        // Obtener la disponibilidad de todos los tutores encontrados
        const availabilities = await this.availabilityRepository.findAll({  tutorId: uniqueTutorIds });

        console.log('availabilities :>> ', availabilities);

        // Crear un mapa tutorId → sus disponibilidades
        const availabilityMap = new Map<string, any[]>();

        availabilities.forEach(a => {
            const id = a.tutorId.toString();
            if (!availabilityMap.has(id)) availabilityMap.set(id, []);
            availabilityMap.get(id)?.push(a);
        });


        console.log("------------");
        console.log('availabilityMap :>> ', availabilityMap);


        // Agregar availability dentro de tutorId para cada materia
        const result = subjects.map(subject => {
            const tutor = subject.tutorId;
            const tutorId = tutor?._id?.toString();
            const tutorAvailability = availabilityMap.get(tutorId) || [];

            return {
                ...subject, // subject limpio
                tutorId: {
                    ...tutor,      // tutor limpio
                    availability: tutorAvailability
                }
            };
        });

        return result;
    }

}