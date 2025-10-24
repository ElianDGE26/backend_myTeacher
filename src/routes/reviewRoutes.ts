import { Router } from "express";
import { createReview, getAllReviews, getReviewByid, updateReviewByid, deleteReviewByid} from "../controllers/reviewControllers";
import { verifyToken } from "../middelwears/authMiddelwears";


const router = Router();


//Rutas Get
router.get("/", verifyToken, getAllReviews);
router.get("/:id", verifyToken,  getReviewByid);

//Rutas Post
router.post("/create", verifyToken, createReview);

//Rutas Put
router.put("/update/:id", verifyToken, updateReviewByid);

//Rutas Delete
router.delete("/delete/:id",verifyToken,  deleteReviewByid);


export default router;

