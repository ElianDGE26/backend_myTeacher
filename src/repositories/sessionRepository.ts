import { Query } from "../types/reporsitoryTypes";
import { ISessionRepository, ISessionService, Session } from "../types/sessionTypes";
import { SessionModel } from "../models/sessionModels"
import { Types } from "mongoose";

export class SessionRepository implements ISessionRepository {


    async findOne(query: Query): Promise<Session | null> {
        return await SessionModel.findOne(query).exec();
    }
    async create(item: Session): Promise<Session> {
        const newSession = new SessionModel(item);
        return await newSession.save();
    }
    async findAll(query?: Query): Promise<Session[]> {
        return  await SessionModel.find(query || {}).exec();
    }
    async findById(id: string): Promise<Session | null> {
        return await SessionModel.findById(id).exec();
    }
    async update(id: string, item: Partial<Session>): Promise<Session | null> {
        return await SessionModel.findByIdAndUpdate(id, item, { new:true}).exec();
    }
    async delete(id: string): Promise<boolean> {
        const result  =  await SessionModel.findByIdAndDelete(id).exec();
        return result ? true: false;
    }

    async deleteByRefreshToken(query: Query): Promise<boolean> {
        const result  = await SessionModel.deleteOne(query).exec();
        return result.deletedCount > 0
    }
    
    async deleteByUserId(userId: Types.ObjectId): Promise<boolean> {
        const result  = await SessionModel.deleteMany( { userId }).exec();
        return result.deletedCount > 0
    }
    

}

