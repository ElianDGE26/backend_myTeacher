import nodemailer, { Transporter } from "nodemailer";
import config from "../config/config";
import { Booking } from "../types/bookingsTypes";
import { render } from '@react-email/render';
import { RegistrationEmail } from "../emails/RegistrationEmail";
import { BookingEmail } from "../emails/BookingEmail";
import { CustomEmail } from "../emails/CustomEmail";

/**
 * @fileoverview Servicio de Correos Electrónicos (Email Service)
 * @module services/emailService
 * @description Maneja el envío de correos electrónicos a los usuarios de la plataforma usando nodemailer.
 */


let transporter: Transporter | null = null;

const getTransporter = async (): Promise<Transporter> => {
    if (transporter) {
        return transporter;
    }
    if (process.env.NODE_ENV !== "production") {
        //=== // DESARROLLO - ETHEREAL // ======
        const testAccount = await nodemailer.createTestAccount();
        console.log("========================================");
        console.log("Cuenta de prueba Ethereal creada");
        console.log("Usuario:", testAccount.user);
        console.log("Contraseña:", testAccount.pass);
        console.log("========================================");
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    } else {
        // ==== // PRODUCCIÓN // =======
        transporter = nodemailer.createTransport({
            host: config.emailHost || "smtp.gmail.com",
            port: Number(config.emailPort) || 587,
            secure: config.emailSecure === "true", // outlook usually is false on 587 and uses STARTTLS
            auth: { user: config.emailUser, pass: config.emailPass },
        });
    }
    return transporter;
};


export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
    try {
        const mailOptions = {
            from: config.emailFrom || '"MyTeacher" <no-reply@myteacher.com>',
            to,
            subject,
            text,
            html: html || text,
        };

        const transporter = await getTransporter();

        const info = await transporter.sendMail(mailOptions);
        console.log(`Correo enviado a ${to}: ${info.messageId}`);
        console.log("Ver correo aquí: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error(`Error enviando correo a ${to}:`, error);
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
    console.log("Entro a enviar el email");
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

