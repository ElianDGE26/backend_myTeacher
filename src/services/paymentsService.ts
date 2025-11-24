import { timeStamp } from "console";
import { IBookingRepository } from "../types/bookingsTypes";
import {
  IPaymentsRepository,
  IPaymentsService,
  Payments,
} from "../types/paymentsTypes";
import { Query } from "../types/reporsitoryTypes";
import { Types } from "mongoose";
import { startOfMonth, min, lastDayOfMonth, subMonths, endOfMonth } from "date-fns"

export class PaymentsService implements IPaymentsService {
  private paymentsRepository: IPaymentsRepository;
  private bookingRepository: IBookingRepository;

  constructor( paymentsRepository: IPaymentsRepository,bookingRepository: IBookingRepository) {
    this.paymentsRepository = paymentsRepository;
    this.bookingRepository = bookingRepository;
  }


  //Servicio para betener estadisticas para el perfil del tutor
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

  async createPayment(payment: Payments): Promise<Payments> {
    return await this.paymentsRepository.create(payment);
  }

  async findAllPayments(query?: Query): Promise<Payments[]> {
    
    return await this.paymentsRepository.findAll(query);
  }

  async findPaymentById(id: Types.ObjectId): Promise<Payments | null> {
    return await this.paymentsRepository.findById(id);
  }

  async updatePaymentById( id: Types.ObjectId, payment: Partial<Payments>): Promise<Payments | null> {
    return await this.paymentsRepository.update(id, payment);
  }

  async deletePaymentById(id: Types.ObjectId): Promise<boolean> {
    return await this.paymentsRepository.delete(id);
  }


  /** método adicional para obetener las estdisticas de:
   *  - estudiantes con reservas en una fecha dada
   *  - Dinero recaudado por el tutor
   *  - Total de tutorias canceladas y pendientes.
   */
  async getStatsForPeriod (tutorId: Types.ObjectId, startDate: Date, endDate: Date)  {
    const today = new Date()
    return Promise.all([
      this.bookingRepository.recuentStudentsBookings({ tutorId, date: { $gte: startDate, $lte: endDate }}),
      this.paymentsRepository.totalIncomeByTutor({ tutorId, date: { $gte: startDate, $lte: endDate }}),
      this.bookingRepository.countByDocuments({ tutorId, status: "Cancelada",date: { $gte: startDate, $lte: endDate }}),
      this.bookingRepository.countByDocuments({ tutorId, status: "Pendiente", date: { $gte: today, $lte: endDate }}),
    ]);
  }

}
