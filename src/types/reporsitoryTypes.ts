import { Document, Types } from "mongoose";

export type Query = Record<string, unknown>;

export interface Repository<T> {
    create(item: T): Promise<T>;
    findAll(query?: Query): Promise<T[]>;
    findById(id: Types.ObjectId): Promise<T | null>;
    update(id: Types.ObjectId, item: Partial<T>): Promise<T | null>;
    delete(id: Types.ObjectId): Promise<boolean>;
}


