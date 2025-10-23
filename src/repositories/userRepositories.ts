import { UserModel } from "../models/userModels";
import { Query } from "../types/reporsitoryTypes";
import { IUserRepository, User } from "../types/usersTypes";


export class UserRepository implements IUserRepository{


    async create(data: User): Promise<User> {
        const newUser = new UserModel(data);
        return await newUser.save();
    }

    async findAll(query?: Query): Promise<User[]> {
        return await UserModel.find(query || {}).exec();
    }   

    async findById(id: string): Promise<User | null> {
        return await UserModel.findById(id).exec();
    }

    async update(id: string, data: Partial<User>): Promise<User | null> {
        return await UserModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete (id: string): Promise<boolean> {
        const result = await UserModel.findByIdAndDelete(id).exec();
        return result ? true : false;
    }

    async findOne (query: Query): Promise<User | null> {
        return await UserModel.findOne(query).exec();
    }


}