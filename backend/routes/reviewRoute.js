import express from 'express';
import { submitReview, getProductsToReview } from '../controllers/reviewController.js';
import authUser from '../middleware/auth.js';

const reviewRouter = express.Router();

reviewRouter.post('/submit', authUser, submitReview);
reviewRouter.get('/list', authUser, getProductsToReview);

export default reviewRouter;