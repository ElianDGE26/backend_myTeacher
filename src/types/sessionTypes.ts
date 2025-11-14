import { Document, Types } from "mongoose";
import { Repository, Query} from "./reporsitoryTypes";


export interface Session extends Document {
    userId: Types.ObjectId;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
}

export interface ISessionRepository extends Repository<Session> {
    findOne(query: Query): Promise<Session | null>;
    deleteByRefreshToken(query: Query): Promise<boolean>;
    deleteByUserId(userId: Types.ObjectId): Promise<boolean> ;

}

export interface ISessionService {
    createSession(session: Session): Promise<Session>;
    findSessionById(id: Types.ObjectId): Promise<Session | null>;
    updateSessionByid(id: Types.ObjectId, session: Partial<Session>): Promise<Session | null>;
    findAllSessions(query?: Query): Promise<Session[]>;
    deleteSessionById(id: Types.ObjectId): Promise<boolean>;
    findSessionByRefreshToken(refreshToken: string): Promise<Session | null>;
    deleteSessionByRefreshToken(refreshToken: string): Promise<boolean>;
    deleteSessionByUserId(userId: Types.ObjectId): Promise<boolean>;
}
