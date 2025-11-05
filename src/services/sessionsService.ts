import { Types } from "mongoose";
import { Query } from "../types/reporsitoryTypes";
import { ISessionRepository, ISessionService, Session } from "../types/sessionTypes";
import { SessionRepository } from "../repositories/sessionRepository";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { User } from "../types/usersTypes";

const ACCESS_SECRET: string = config.jwtSecret;
const ACCESS_SECRET_REFRESH_TOKEN: string = config.jwtSecretRefreshToken;

export class SessionService implements ISessionService {
    private sessionRepository: SessionRepository;

    constructor(sessionRepository: SessionRepository){
        this.sessionRepository = sessionRepository;
    }

    findSessionById(id: string): Promise<Session | null> {
        return this.sessionRepository.findById(id);
    }

    updateSessionByid(id: string, session: Partial<Session>): Promise<Session | null> {
        return this.sessionRepository.update(id, session);
    }

    findAllSessions(query?: Query): Promise<Session[]> {
        return this.sessionRepository.findAll(query);
    }

    deleteSessionById(id: string): Promise<boolean> {
        return this.sessionRepository.delete(id);
    }

    createSession(session: Session): Promise<Session> {
        return this.sessionRepository.create(session);
    }

    findSessionByRefreshToken(refreshToken: string): Promise<Session | null> {
        return this.sessionRepository.findOne({ refreshToken})
    }
    
    findSessionByUserId(userId: Types.ObjectId): Promise<Session[]> {
        return this.sessionRepository.findAll({ userId });
    }
    deleteSessionByRefreshToken(refreshToken: string): Promise<boolean> {
        return this.sessionRepository.deleteByRefreshToken({ refreshToken} );
    }
    deleteSessionByUserId(userId: Types.ObjectId): Promise<boolean> {
        return this.sessionRepository.deleteByUserId(userId);
    }

    
}


export class TokenService {
    static generateAccessToken(payload: Object): any {
        const token = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "1h"} );
        const refreshToken = jwt.sign(payload, ACCESS_SECRET_REFRESH_TOKEN, { expiresIn: "3d"} );
        return { token, refreshToken };
    }

    static verifyAccessToken(token: string) {
        return jwt.verify(token, ACCESS_SECRET) as User;
    }

    static verifyRefreshToken(token: string) {
        return jwt.verify(token, ACCESS_SECRET_REFRESH_TOKEN) as User;
    }
}



