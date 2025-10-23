import { Router } from "express";
import { createReview, getAllReviews, getReviewByid, updateReviewByid, deleteReviewByid} from "../controllers/reviewControllers";

const router = Router();


//Rutas Get
router.get("/", getAllReviews);
router.get("/:id", getReviewByid);

//Rutas Post
router.post("/create", createReview);

//Rutas Put
router.put("/update/:id", updateReviewByid);

//Rutas Delete
router.delete("/delete/:id", deleteReviewByid);


export default router;

