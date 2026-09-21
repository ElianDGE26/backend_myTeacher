/**
 * @fileoverview Servicio de Pagos y Finanzas (Payments Service)
 * @module services/paymentsService
 * @description Capa de lógica de negocio para la gestión de pagos, balance financiero de tutores, cálculo comparativo de ingresos intermensuales y estadísticas de rendimiento.
 */

import { timeStamp } from "console";
import { IBookingRepository } from "../types/bookingsTypes";
import {
  IPaymentsRepository,
  IPaymentsService,
  Payments,
} from "../types/paymentsTypes";
import { Query } from "../types/reporsitoryTypes";
import mongoose, { Types } from "mongoose";
import { startOfMonth, min, lastDayOfMonth, subMonths, endOfMonth } from "date-fns"

/**
 * Servicio encargado de gestionar las transacciones de pago y estadísticas financieras.
 * Implementa la interfaz `IPaymentsService`.
 *
 * @class PaymentsService
 * @implements {IPaymentsService}
 */
export class PaymentsService implements IPaymentsService {
  private paymentsRepository: IPaymentsRepository;
  private bookingRepository: IBookingRepository;

  /**
   * Inicializa una nueva instancia de PaymentsService inyectando los repositorios requeridos.
   *
   * @constructor
   * @param {IPaymentsRepository} paymentsRepository - Repositorio para persistencia y agregaciones de pagos.
   * @param {IBookingRepository} bookingRepository - Repositorio para métricas y recuentos de reservas.
   */
  constructor( paymentsRepository: IPaymentsRepository,bookingRepository: IBookingRepository) {
    this.paymentsRepository = paymentsRepository;
    this.bookingRepository = bookingRepository;
  }

  /**
   * Registra un nuevo pago en el sistema con soporte opcional de sesión transaccional ACID.
   *
   * @async
   * @param {Partial<Payments> | Payments} payment - Datos del pago a registrar (bookingId, amount, status, method, etc.).
   * @param {mongoose.ClientSession | null} [session] - Sesión de transacción de MongoDB opcional.
   * @returns {Promise<Payments>} Promesa que resuelve con el documento del pago creado.
   */
  async createPayment(payment: Partial<Payments> | Payments, session?: mongoose.ClientSession | null): Promise<Payments> {
    return await this.paymentsRepository.create(payment, session);
  }

  /**
   * Consulta todos los pagos registrados según filtros opcionales.
   *
   * @async
   * @param {Query} [query] - Criterios de búsqueda y filtrado.
   * @returns {Promise<Payments[]>} Promesa que resuelve con un array de pagos.
   */
  async findAllPayments(query?: Query): Promise<Payments[]> {
    
    return await this.paymentsRepository.findAll(query);
  }

  /**
   * Busca un registro de pago específico mediante su ID.
   *
   * @async
   * @param {Types.ObjectId} id - Identificador de MongoDB del pago.
   * @returns {Promise<Payments | null>} Promesa que resuelve con el pago encontrado o null si no existe.
   */
  async findPaymentById(id: Types.ObjectId): Promise<Payments | null> {
    return await this.paymentsRepository.findById(id);
  }

  /**
   * Actualiza los datos de un pago existente por su ID.
   *
   * @async
   * @param {Types.ObjectId} id - Identificador de MongoDB del pago a modificar.
   * @param {Partial<Payments>} payment - Campos actualizados del pago.
   * @returns {Promise<Payments | null>} Promesa que resuelve con el pago modificado o null.
   */
  async updatePaymentById( id: Types.ObjectId, payment: Partial<Payments>): Promise<Payments | null> {
    return await this.paymentsRepository.update(id, payment);
  }

  /**
   * Elimina un registro de pago por su ID.
   *
   * @async
   * @param {Types.ObjectId} id - Identificador de MongoDB del pago a eliminar.
   * @returns {Promise<boolean>} Promesa que resuelve con true si se eliminó correctamente, o false en caso contrario.
   */
  async deletePaymentById(id: Types.ObjectId): Promise<boolean> {
    return await this.paymentsRepository.delete(id);
  }

  
  /**
   * Calcula y compila las estadísticas consolidadas del tutor para el dashboard de perfil:
   * Compara el periodo actual (mes en curso hasta hoy) contra el mismo lapso del mes anterior para determinar:
   * - Total de estudiantes y variación absoluta.
   * - Total de ingresos recaudados y porcentaje de diferencia intermensual.
   * - Clases canceladas y variación.
   * - Solicitudes pendientes por aceptar vigentes.
   *
   * @async
   * @param {Types.ObjectId} tutorId - Identificador único de MongoDB del tutor.
   * @returns {Promise<{students: number;
   *   income: number;
   *   canceledClasses: number;
   *   pendingRequests: number;
   *   studentsLastPerium: number;
   *   incomeLastPerium: number;
   *   canceledClassesLastPerium: number;
   *   diferenceIncomePercentage: number;
   *   diferenceStudents: number;
   *   diferenceCanceledClasses: number;
   * }>} Promesa que resuelve con el objeto de métricas comparativas.
   */
  async totalTutorsStats(tutorId: Types.ObjectId): Promise<{
    students: number; 
    income: number;
    canceledClasses: number;
    pendingRequests: number;
    studentsLastPerium: number;
    incomeLastPerium: number;
    canceledClassesLastPerium: number;
    diferenceIncomePercentage: number;
    diferenceStudents: number;
    diferenceCanceledClasses: number;
  }> {

    const today = new Date();

    const startOfCurrentMonth = startOfMonth(today); // obtenemos el inicio del mes actual
    const endOfCurrentMonth = today; // dia de la consulta

    //Fechas actuales
    console.log('today :>> ', today);
    console.log('startOfCurrentMonth :>> ', startOfCurrentMonth);
    console.log('endOfCurrenteMonth :>> ', endOfCurrentMonth);
    // fechas del mes anterior
    const startOfPreviousMonth = subMonths(startOfCurrentMonth, 1);
    const endOfPreviousMonth = subMonths(endOfCurrentMonth, 1);

    console.log('startOfPreviousMonth :>> ', startOfPreviousMonth);
    console.log('endOfPreviousMonth :>> ', endOfPreviousMonth);


    //calculos
    const [
      [students, income, canceledClasses, pendingRequests], 
      [studentsLastPerium, incomeLastPerium, canceledClassesLastPerium]
    ] =
      await Promise.all([
        this.getStatsForPeriod(tutorId, startOfCurrentMonth, endOfCurrentMonth),
        this.getStatsForPeriod(tutorId, startOfPreviousMonth, endOfPreviousMonth),
      ]);

      const diferenceIncomePercentage = Math.round(incomeLastPerium === 0 ? 100 : ((income - incomeLastPerium) / incomeLastPerium) * 100);
      const diferenceStudents = students - studentsLastPerium;
      const diferenceCanceledClasses = canceledClasses - canceledClassesLastPerium;

    return {
      students, income, canceledClasses, pendingRequests,
      studentsLastPerium, incomeLastPerium, canceledClassesLastPerium,
      diferenceIncomePercentage, diferenceStudents, diferenceCanceledClasses
    };
  }

  /**
   * Método auxiliar para consultar en paralelo las métricas de un periodo temporal específico:
   * - Total de estudiantes con reservas en el rango de fechas.
   * - Total de dinero recaudado por el tutor en ese rango.
   * - Cantidad de reservas canceladas en el rango.
   * - Cantidad de reservas "Pendiente por aceptar" futuras vigentes a partir de hoy.
   *
   * @async
   * @param {Types.ObjectId} tutorId - Identificador del tutor.
   * @param {Date} startDate - Fecha inicial del periodo.
   * @param {Date} endDate - Fecha final del periodo.
   * @returns {Promise<[number, number, number, number]>} Promesa que resuelve con una tupla: `[students, income, canceledClasses, pendingRequests]`.
   */
  async getStatsForPeriod (tutorId: Types.ObjectId, startDate: Date, endDate: Date)  {
    const today = new Date()
    return Promise.all([
      this.bookingRepository.recuentStudentsBookings({ tutorId, date: { $gte: startDate, $lte: endDate }}),
      this.paymentsRepository.totalIncomeByTutor({ tutorId, date: { $gte: startDate, $lte: endDate }}),
      this.bookingRepository.countByDocuments({ tutorId, status: "Cancelada",date: { $gte: startDate, $lte: endDate }}),
      this.bookingRepository.countByDocuments({ tutorId, status: "Pendiente por aceptar", date: { $gte: today, $lte: endDate }}),
    ]);
  }

}

