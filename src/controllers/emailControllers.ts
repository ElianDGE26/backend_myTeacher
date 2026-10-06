import { Request, Response } from "express";
import { sendCustomEmail } from "../services/emailService";

/**
 * @fileoverview Controlador de Correos (Email Controller)
 * @module controllers/emailControllers
 * @description Maneja los endpoints relacionados con el envío de correos electrónicos.
 */

/**
 * Envia un correo personalizado utilizando una plantilla genérica.
 *
 * @route POST /api/emails/send-custom
 * @access Público o Privado (dependiendo de la configuración de rutas)
 * @param {Request} req - Objeto de solicitud HTTP de Express. Debe incluir: to, subject, title, message, previewText, buttonText, buttonLink en el body.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Mensaje de éxito al enviar el correo.
 */
export const sendCustomEmailController = async (req: Request, res: Response) => {
    try {
        const { to, subject, title, message, previewText, buttonText, buttonLink } = req.body;

        if (!to || !subject || !title || !message) {
            return res.status(400).json({ error: "Faltan campos requeridos (to, subject, title, message)" });
        }

        await sendCustomEmail(to, subject, title, message, previewText, buttonText, buttonLink);

        return res.status(200).json({ message: "Correo enviado exitosamente" });
    } catch (error) {
        console.error("Error en sendCustomEmailController:", error);
        return res.status(500).json({ error: "Ocurrió un error al enviar el correo" });
    }
};
