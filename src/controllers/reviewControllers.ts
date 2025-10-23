import { IReviewRepository, IReviewService, Review } from "../types/reviewTypes";
import { ReviewRepository } from "../repositories/reviewRepositories";
import { ReviewService } from "../services/reviewService";
import { Request, Response } from "express";

const reviewRepository: IReviewRepository = new ReviewRepository();
const reviewService: IReviewService = new ReviewService(reviewRepository);



export const getAllReviews = async (req: Request, res: Response) => {
    try {

        const result =  await reviewService.findAllReviews();

        if (result.length === 0) {
            return res.status(404).json({ message: "No Reviews found" });
        }

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Reviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getReviewByid = async (req: Request, res: Response) => {
    try {
        const { id} = req.params;

        if (!id) {
            return res.status(400).json({ message: "Missing Review ID in params" });
        }
        
        const result =  await reviewService.findReviewById(id);

        if (!result) {
            return res.status(404).json({ message: "No Review found" });
        }

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Reviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const createReview = async (req: Request, res: Response) => {
    try {

        const newReview: Review = req.body;

        const result =  await reviewService.createReview(newReview);

        res.status(201).json(result);
        
    } catch (error) {
        console.error("Error fetching Reviews:", error);
        res.status(400).json({ message: "Internal server error" });
    }
}


export const updateReviewByid = async (req: Request, res: Response) => {
    try {
        const {id } = req.params;
        const reviewUpdate: Review = req.body;

        if (!id) {
            return res.status(400).json({ message: "Missing Review ID in params" });
        }

        const result =  await reviewService.updateReviewById(id, reviewUpdate);

        if (!result) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Reviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteReviewByid = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Missing Review ID in params" });
        }

        const result =  await reviewService.deleteReviewById(id);

        if (!result) {
            return res.status(404).json({ message: "Review not found" });
        }   
        res.json({ success: result });
        
    } catch (error) {
        console.error("Error fetching Reviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
