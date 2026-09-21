/**
 * @fileoverview Repositorio de Materias (Subject Repository)
 * @module repositories/subjectRepositories
 * @description Capa de acceso a datos para la colección de materias/asignaturas en MongoDB usando Mongoose, incluyendo búsqueda con normalización de caracteres y acentos.
 */

import { SubjectModel } from "../models/subjectModels";
import { Query } from "../types/reporsitoryTypes";
import { ISubjectRepository, Subject } from "../types/subjectsTypes";
import { Types } from "mongoose";

/**
 * Repositorio que gestiona las operaciones de persistencia y búsqueda de asignaturas.
 * Implementa `ISubjectRepository`.
 *
 * @class SubjectRepository
 * @implements {ISubjectRepository}
 */
export class SubjectRepository implements ISubjectRepository{

    /**
     * Persiste una nueva materia en la base de datos.
     *
     * @async
     * @param {Subject} data - Datos de la materia a guardar.
     * @returns {Promise<Subject>} Promesa que resuelve con la materia guardada.
     */
    async create(data: Subject): Promise<Subject> {
        const newSubject = new SubjectModel(data);
        return await newSubject.save();
    }

    /**
     * Consulta todas las materias según criterios opcionales.
     *
     * @async
     * @param {Query} [query] - Criterios de filtrado de búsqueda.
     * @returns {Promise<Subject[]>} Promesa que resuelve con un array de materias.
     */
    async findAll(query?: Query): Promise<Subject[]> {
        return await SubjectModel.find(query || {}).exec();
    }   

    /**
     * Busca una materia por su identificador único (ObjectId).
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la materia.
     * @returns {Promise<Subject | null>} Promesa que resuelve con la materia encontrada o null.
     */
    async findById(id: Types.ObjectId): Promise<Subject | null> {
        return await SubjectModel.findById(id).exec();
    }

    /**
     * Actualiza una materia existente por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la materia.
     * @param {Partial<Subject>} data - Campos modificados de la materia.
     * @returns {Promise<Subject | null>} Promesa que resuelve con la materia actualizada o null.
     */
    async update(id: Types.ObjectId, data: Partial<Subject>): Promise<Subject | null> {
        return await SubjectModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    /**
     * Elimina una materia de la base de datos por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la materia a eliminar.
     * @returns {Promise<boolean>} Promesa que resuelve con true si se eliminó, o false en caso contrario.
     */
    async delete (id: Types.ObjectId): Promise<boolean> {
        const result = await SubjectModel.findByIdAndDelete(id).exec();
        return result ? true : false;
    }

    /**
     * Busca la primera materia que coincida con los criterios dados.
     *
     * @async
     * @param {Query} query - Criterios de búsqueda en MongoDB.
     * @returns {Promise<Subject | null>} Promesa que resuelve con la materia coincidente o null.
     */
    async findOne (query: Query): Promise<Subject | null> {
        return await SubjectModel.findOne(query).exec();
    }

    /**
     * Consulta materias poblando los datos del tutor (omitiendo la contraseña) y filtra por coincidencia
     * insensible a mayúsculas y acentos diacríticos (normalización NFD).
     *
     * @async
     * @param {Query} [query] - Criterios de búsqueda conteniendo `{ name: string }`.
     * @returns {Promise<any[]>} Promesa que resuelve con las materias coincidentes y los datos de sus tutores.
     */
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

/**
 * Función auxiliar para normalizar cadenas de texto removiendo diacríticos/acentos y convirtiendo a minúsculas.
 *
 * @param {string} str - Cadena de texto a normalizar.
 * @returns {string} Cadena normalizada sin tildes y en minúsculas.
 */
function normalizeString(str: string): string {
    return str
        .normalize("NFD")            // descompone acentos
        .replace(/[\u0300-\u036f]/g, "") // elimina marcas diacríticas
        .toLowerCase();
}