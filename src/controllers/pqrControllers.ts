/**
 * @fileoverview Controlador de PQRs (Peticiones, Quejas y Reclamos)
 * @module controllers/pqrControllers
 * @description Maneja las operaciones CRUD para el sistema de soporte, atención a usuarios y PQRs.
 */

import { IPqrRepository, IPqrService } from "../types/pqrTypes";
import { PqrRepository } from "../repositories/pqrRepositories";
import { PqrService } from "../services/pqrService";
import { Pqr } from "../types/pqrTypes";
import { Request, Response } from "express";
import mongoose from "mongoose";

const pqrRepository: IPqrRepository = new PqrRepository();
const pqrService: IPqrService = new PqrService(pqrRepository);

/**
 * Obtiene todas las PQRs registradas en el sistema.
 *
 * @route GET /api/pqrs
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Array con todas las solicitudes de PQR.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const getAllPqrs = async (req: Request, res: Response) => {
  try {
    const result = await pqrService.findAllPqrs();

    res.json(result);
  } catch (error) {
    console.error("Error fetching Pqrs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Obtiene una PQR específica por su ID.
 *
 * @route GET /api/pqrs/:id
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.id - Identificador único (ObjectId) de la PQR.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Objeto con los detalles de la PQR.
 * @returns {Promise<Response>} 400 - Parámetro ID ausente.
 * @returns {Promise<Response>} 404 - Formato de ID inválido o PQR no encontrada.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const getPqrByid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing Pqr ID in params" });
    }

    //se valida que el id si sea de tipo Object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid Booking Id" });
    }

    const result = await pqrService.findPqrById(
      new mongoose.Types.ObjectId(id)
    );

    if (!result) {
      return res.status(404).json({ message: "No Pqr found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching Pqrs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Registra una nueva PQR en el sistema.
 *
 * @route POST /api/pqrs/create
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Pqr} req.body - Datos de la PQR (userId, type, description, status, etc.).
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 201 - PQR creada exitosamente.
 * @returns {Promise<Response>} 400 - Error en los datos proporcionados o al guardar.
 */
export const createPqr = async (req: Request, res: Response) => {
  try {
    const newPqr: Pqr = req.body;

    const result = await pqrService.createPqr(newPqr);

    res.status(201).json(result);
  } catch (error) {
    console.error("Error fetching Pqrs:", error);
    res.status(400).json({ message: "Internal server error" });
  }
};

/**
 * Actualiza la información o estado de una PQR por su ID.
 *
 * @route PUT /api/pqrs/update/:id
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.id - Identificador único (ObjectId) de la PQR.
 * @param {Pqr} req.body - Campos actualizados de la PQR.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Objeto con la PQR actualizada.
 * @returns {Promise<Response>} 400 - Parámetro ID ausente.
 * @returns {Promise<Response>} 404 - Formato de ID inválido o PQR no encontrada.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const updatePqrByid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pqrUpdate: Pqr = req.body;

    if (!id) {
      return res.status(400).json({ message: "Missing Pqr ID in params" });
    }

    //se valida que el id si sea de tipo Object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid Booking Id" });
    }

    const result = await pqrService.updatePqrById(
      new mongoose.Types.ObjectId(id),
      pqrUpdate
    );

    if (!result) {
      return res.status(404).json({ message: "Pqr not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching Pqrs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Elimina un registro de PQR por su ID.
 *
 * @route DELETE /api/pqrs/delete/:id
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.id - Identificador único (ObjectId) de la PQR.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Objeto de confirmación `{ success: boolean }`.
 * @returns {Promise<Response>} 400 - Parámetro ID ausente.
 * @returns {Promise<Response>} 404 - Formato de ID inválido o PQR no encontrada.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const deletePqrByid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing Pqr ID in params" });
    }

    //se valida que el id si sea de tipo Object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid Booking Id" });
    }

    const result = await pqrService.deletePqrById(
      new mongoose.Types.ObjectId(id)
    );

    if (!result) {
      return res.status(404).json({ message: "Pqr not found" });
    }
    res.json({ success: result });
  } catch (error) {
    console.error("Error fetching Pqrs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

