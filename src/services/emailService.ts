import { google } from "googleapis";
import config from "../config/config";
import { Booking } from "../types/bookingsTypes";
import { render } from '@react-email/render';
import { RegistrationEmail } from "../emails/RegistrationEmail";
import { BookingEmail } from "../emails/BookingEmail";
import { CustomEmail } from "../emails/CustomEmail";

/**
 * @fileoverview Servicio de Correos Electrónicos (Email Service)
 * @module services/emailService
 * @description Maneja el envío de correos electrónicos a los usuarios de la plataforma usando Gmail API.
 */

const oauth2Client = new google.auth.OAuth2(
    config.gmailClientId || process.env.GMAIL_CLIENT_ID,
    config.gmailClientSecret || process.env.GMAIL_CLIENT_SECRET
);

oauth2Client.setCredentials({
    refresh_token: config.gmailRefreshToken || process.env.GMAIL_REFRESH_TOKEN,
});

const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
});

/**
 * Construye el mensaje en formato MIME (RFC 2822) codificado en base64url para la API de Gmail.
 * Soporta texto plano y contenido HTML alternativo, manejando caracteres UTF-8 en el asunto y cuerpo.
 */
const createMimeMessage = (to: string, subject: string, text: string, html?: string): string => {
    const boundary = `__boundary_${Date.now()}__`;
    const from = config.emailFrom || `"MyTeacher" <${config.emailUser}>`;
    const utf8Subject = `=?UTF-8?B?${Buffer.from(subject, 'utf-8').toString('base64')}?=`;

    const headers = [
        `From: ${from}`,
        `To: ${to}`,
        `Subject: ${utf8Subject}`,
        `MIME-Version: 1.0`,
    ];

    let body = "";
    if (html) {
        headers.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
        body = [
            `--${boundary}`,
            `Content-Type: text/plain; charset=UTF-8`,
            `Content-Transfer-Encoding: base64`,
            ``,
            Buffer.from(text, 'utf-8').toString('base64'),
            ``,
            `--${boundary}`,
            `Content-Type: text/html; charset=UTF-8`,
            `Content-Transfer-Encoding: base64`,
            ``,
            Buffer.from(html, 'utf-8').toString('base64'),
            ``,
            `--${boundary}--`
        ].join('\r\n');
    } else {
        headers.push(`Content-Type: text/plain; charset=UTF-8`);
        headers.push(`Content-Transfer-Encoding: base64`);
        body = Buffer.from(text, 'utf-8').toString('base64');
    }

    const fullMessage = `${headers.join('\r\n')}\r\n\r\n${body}`;
    return Buffer.from(fullMessage, 'utf-8').toString('base64url');
};

/**
 * Envía un correo electrónico utilizando la API de Gmail.
 * @param to Correo del destinatario
 * @param subject Asunto del correo
 * @param text Contenido en texto plano
 * @param html Contenido en HTML (opcional)
 */
export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
    console.log("Enviando email...")
    try {
        const raw = createMimeMessage(to, subject, text, html);

        const response = await gmail.users.messages.send({
            userId: "me",
            requestBody: { raw },
        });

        console.log(`Correo enviado a ${to}: ${response.data.id}`);
        return response.data;
    } catch (error) {
        console.error(`Error enviando correo a ${to}:`, error);
        throw error;
    }
};

/**
 * Envía un correo notificando la creación de una reserva.
 * @param to Correo del estudiante
 * @param booking Objeto con los datos de la reserva
 */
export const sendBookingCreatedEmail = async (to: string, booking: Booking) => {
    const subject = "Reserva creada exitosamente - Pendiente por pago";
    const text = `Hola,\n\nTu reserva de tutoría (${booking.type}) para la fecha ${new Date(booking.date).toLocaleDateString()} a las ${booking.startTime} ha sido creada exitosamente.\n\nPor favor, ten en cuenta que tu reserva está en estado "Pendiente por pago". Tienes 15 minutos para realizar el pago y asegurar tu clase.\n\nGracias,\nEquipo MyTeacher`;
    
    // Usamos render asíncrono para generar el HTML (React Email 3.x soporta render async)
    const html = await render(
        BookingEmail({
            type: booking.type,
            status: "Pendiente por pago",
            message: "Tu reserva ha sido creada exitosamente. Tienes 15 minutos para completarlo antes de que expire.",
            date: new Date(booking.date).toLocaleDateString(),
            startTime: booking.startTime
        })
    );

    await sendEmail(to, subject, text, html);
};

/**
 * Envía un correo notificando el cambio de estado de una reserva (ej. Pagada, Expirada, Aceptada, etc.).
 * @param to Correo del estudiante
 * @param booking Objeto con los datos de la reserva y el nuevo estado
 */
export const sendBookingStatusChangedEmail = async (to: string, booking: Booking) => {
    const subject = `Actualización de tu reserva - Estado: ${booking.status}`;
    let message = "";

    switch (booking.status) {
        case "Pendiente por aceptar":
            message = "Hemos recibido tu pago con éxito. Ahora tu reserva está pendiente de ser aceptada por el tutor.";
            break;
        case "Aceptada":
            message = "¡Tu tutor ha aceptado la reserva! Nos vemos en clase.";
            break;
        case "Rechazada":
            message = "Lo sentimos, el tutor ha rechazado tu solicitud de reserva.";
            break;
        case "Cancelada":
            message = "Tu reserva ha sido cancelada.";
            break;
        case "Expirada":
            message = "El tiempo de espera para el pago de tu reserva ha expirado. Por favor, realiza una nueva reserva si aún deseas la clase.";
            break;
        case "Completada":
            message = "Tu clase ha finalizado. ¡Esperamos que hayas aprendido mucho!";
            break;
        default:
            message = `El estado de tu reserva ha cambiado a: ${booking.status}.`;
            break;
    }

    const text = `Hola,\n\n${message}\n\nDetalles de la reserva:\n- Fecha: ${new Date(booking.date).toLocaleDateString()}\n- Hora: ${booking.startTime}\n- Tipo: ${booking.type}\n\nGracias,\nEquipo MyTeacher`;
    
    const html = await render(
        BookingEmail({
            type: booking.type,
            status: booking.status,
            message: message,
            date: new Date(booking.date).toLocaleDateString(),
            startTime: booking.startTime
        })
    );

    await sendEmail(to, subject, text, html);
};

/**
 * Envía un correo notificando el registro exitoso de un usuario en MyTeacher.
 * @param to Correo del usuario registrado
 * @param name Nombre del usuario
 */
export const sendRegistrationSuccessEmail = async (to: string, name: string) => {
    console.log("Servicio de envío de email activado...");
    const subject = "¡Registro exitoso en MyTeacher!";
    const text = `Hola ${name}, ¡Tu registro en MyTeacher se ha completado exitosamente! Ya puedes acceder a la plataforma y comenzar a disfrutar de todas las funcionalidades que tenemos disponibles para ti. Gracias por formar parte de MyTeacher. ¡Nos vemos dentro de la plataforma! Equipo MyTeacher`;
    
    const html = await render(
        RegistrationEmail({ name })
    );

    await sendEmail(to, subject, text, html);
};

/**
 * Envía un correo personalizable (ej. para uso del frontend).
 * @param to Correo del destinatario
 * @param subject Asunto del correo
 * @param title Título dentro del cuerpo del correo
 * @param message Mensaje principal del correo
 * @param previewText Texto de vista previa (opcional)
 * @param buttonText Texto del botón (opcional)
 * @param buttonLink Enlace del botón (opcional)
 */
export const sendCustomEmail = async (
    to: string,
    subject: string,
    title: string,
    message: string,
    previewText?: string,
    buttonText?: string,
    buttonLink?: string
) => {
    const text = `${title}\n\n${message}\n\n${buttonText ? `${buttonText}: ${buttonLink}` : ''}\n\nGracias,\nEquipo MyTeacher`;
    
    const html = await render(
        CustomEmail({
            title,
            message,
            previewText,
            buttonText,
            buttonLink
        })
    );

    await sendEmail(to, subject, text, html);
};

export { gmail };
