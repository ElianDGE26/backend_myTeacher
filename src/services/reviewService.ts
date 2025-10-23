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

    async findReviewById (id: string): Promise<Review | null> {
        return this.reviewRepository.findById(id);
    }

    async updateReviewById (id: string, review: Partial<Review>): Promise<Review | null> {
        return this.reviewRepository.update(id, review);
    }   

    async deleteReviewById (id: string): Promise<boolean> {
        return this.reviewRepository.delete(id);
    }  
}