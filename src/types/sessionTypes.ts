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
}

export interface ISessionService {
    createSession(session: Session): Promise<Session>;
    findSessionByRefreshToken(refreshToken: string): Promise<Session | null>;
    findSessionByUserId(userId: Types.ObjectId): Promise<Session[]>;
    deleteSessionByRefreshToken(refreshToken: string): Promise<boolean>;
    deleteSessionByUserId(userId: Types.ObjectId): Promise<boolean>;
}
