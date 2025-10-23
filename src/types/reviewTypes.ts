import { Document, Types } from "mongoose";
import { Repository, Query} from "./reporsitoryTypes";

export interface Review extends Document {
    bookingId: Types.ObjectId;
    rating: number;
    comments?: string;
}

export interface IReviewRepository extends Repository<Review> {
    findOne(query: Query): Promise<Review | null>;
}

export interface IReviewService {
    createReview(Review: Review): Promise<Review>;
    findAllReviews(query?: Query): Promise<Review[]>;
    findReviewById(id: string): Promise<Review | null>;
    updateReviewById(id: string, review: Partial<Review>): Promise<Review | null>;
    deleteReviewById(id: string): Promise<boolean>;
}   