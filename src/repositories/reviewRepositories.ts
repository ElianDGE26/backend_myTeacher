import { ReviewModel } from "../models/reviewModels";
import { Query } from "../types/reporsitoryTypes";
import { IReviewRepository, Review } from "../types/reviewTypes";


export class ReviewRepository implements IReviewRepository{


    async create(data: Review): Promise<Review> {
        const newReview = new ReviewModel(data);
        return await newReview.save();
    }

    async findAll(query?: Query): Promise<Review[]> {
        return await ReviewModel.find(query || {}).exec();
    }   

    async findById(id: string): Promise<Review | null> {
        return await ReviewModel.findById(id).exec();
    }

    async update(id: string, data: Partial<Review>): Promise<Review | null> {
        return await ReviewModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete (id: string): Promise<boolean> {
        const result = await ReviewModel.findByIdAndDelete(id).exec();
        return result ? true : false;
    }

    async findOne (query: Query): Promise<Review | null> {
        return await ReviewModel.findOne(query).exec();
    }


}