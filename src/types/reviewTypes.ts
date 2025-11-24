import { Document, Types } from "mongoose";
import { Repository, Query} from "./reporsitoryTypes";

export interface Review extends Document {
    bookingId: Types.ObjectId;
    rating: number;
    comments?: string;
}

export interface IReviewRepository extends Repository<Review> {
    findOne(query: Query): Promise<Review | null>;
    count(query: Query): Promise<number>;
}

export interface IReviewService {
    createReview(Review: Review): Promise<Review>;
    findAllReviews(query?: Query): Promise<Review[]>;
    findReviewById(id: Types.ObjectId): Promise<Review | null>;
    updateReviewById(id: Types.ObjectId, review: Partial<Review>): Promise<Review | null>;
    deleteReviewById(id: Types.ObjectId): Promise<boolean>;
    countReviewsByBooking(id: Types.ObjectId): Promise<number>;
}   