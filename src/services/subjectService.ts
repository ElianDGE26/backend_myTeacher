import { Types } from "mongoose";
import { Query } from "../types/reporsitoryTypes";
import { ISubjectRepository, ISubjectService, Subject } from "../types/subjectsTypes";
import { IAvailabilityRepository } from "../types/availabilityTypes";


export class SubjectService implements ISubjectService {
    private subjectRepository: ISubjectRepository;
    private availabilityRepository: IAvailabilityRepository;


    constructor(subjectRepository: ISubjectRepository,availabilityRepository: IAvailabilityRepository) {
        this.subjectRepository = subjectRepository;
        this.availabilityRepository = availabilityRepository;
    }

    async createSubject (subject: Subject): Promise<Subject> {
        return this.subjectRepository.create(subject);
    }

    async findAllSubjects (query?: Query): Promise<Subject[]> {
        return this.subjectRepository.findAll(query);
    }

    async findSubjectById (id: Types.ObjectId): Promise<Subject | null> {
        return this.subjectRepository.findById(id);
    }

    async updateSubjectById (id: Types.ObjectId, subject: Partial<Subject>): Promise<Subject | null> {
        return this.subjectRepository.update(id, subject);
    }   

    async deleteSubjectById (id: Types.ObjectId): Promise<boolean> {
        return this.subjectRepository.delete(id);
    }


    /** funcion para para buscar tutores disponibles por materias; es para el buscador de materias*/
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