import { Types } from "mongoose";
import { Query } from "../types/reporsitoryTypes";
import { IReviewRepository, IReviewService, Review } from "../types/reviewTypes";


export class ReviewService implements IReviewService {
    private reviewRepository: IReviewRepository;

    constructor(reviewRepository: IReviewRepository) {
        this.reviewRepository = reviewRepository;
    }
    
    
    async countReviewsByBooking(id: Types.ObjectId): Promise<number> {
        return await this.reviewRepository.count({ bookingId: id});
    } 

    async createReview (review: Review): Promise<Review> {
        return await this.reviewRepository.create(review);
    }

    async findAllReviews (query?: Query): Promise<Review[]> {
        return await this.reviewRepository.findAll(query);
    }

    async findReviewById (id: Types.ObjectId): Promise<Review | null> {
        return await this.reviewRepository.findById(id);
    }

    async updateReviewById (id: Types.ObjectId, review: Partial<Review>): Promise<Review | null> {
        return await this.reviewRepository.update(id, review);
    }   

    async deleteReviewById (id: Types.ObjectId): Promise<boolean> {
        return await this.reviewRepository.delete(id);
    }  
}