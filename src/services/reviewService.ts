import { Types } from "mongoose";
import { Query } from "../types/reporsitoryTypes";
import { IReviewRepository, IReviewService, Review } from "../types/reviewTypes";


export class ReviewService implements IReviewService {
    private reviewRepository: IReviewRepository;

    constructor(reviewRepository: IReviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    async createReview (review: Review): Promise<Review> {
        return this.reviewRepository.create(review);
    }

    async findAllReviews (query?: Query): Promise<Review[]> {
        return this.reviewRepository.findAll(query);
    }

    async findReviewById (id: Types.ObjectId): Promise<Review | null> {
        return this.reviewRepository.findById(id);
    }

    async updateReviewById (id: Types.ObjectId, review: Partial<Review>): Promise<Review | null> {
        return this.reviewRepository.update(id, review);
    }   

    async deleteReviewById (id: Types.ObjectId): Promise<boolean> {
        return this.reviewRepository.delete(id);
    }  
}