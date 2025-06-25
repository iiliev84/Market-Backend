import express from "express";
import { verifyToken } from "../middleware.js";
import {
  getReviewsByProduct,
  getUserReviewForProduct,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  hasUserReviewedProduct,
  getAllReviewsByUser
} from '../db/queries/reviews.js';

console.log('=== REVIEWS MODULE LOADED ===');

const router = express.Router();

//Check to see if the user is logged in 
const authenticateUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// pull all existing reviews for a user 
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('=== DEBUG: Fetching reviews for user:', userId);
    console.log('=== DEBUG: userId type:', typeof userId);
    console.log('=== DEBUG: parseInt(userId):', parseInt(userId));
    
    const reviews = await getAllReviewsByUser(parseInt(userId));
    
    console.log('=== DEBUG: Reviews found:', reviews);
    console.log('=== DEBUG: Number of reviews:', reviews ? reviews.length : 'null/undefined');
    
    res.json(reviews);
  } catch (error) {
    console.error('=== ERROR fetching user reviews:', error);
    console.error('=== ERROR stack:', error.stack);
    res.status(500).json({ error: 'Failed to fetch user reviews' });
  }
});

// pull all reviews for a particular product 
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    console.log('=== DEBUG: Fetching reviews for product:', productId);
    
    const reviews = await getReviewsByProduct(parseInt(productId));
    
    console.log('=== DEBUG: Product reviews found:', reviews ? reviews.length : 'none');
    
    res.json(reviews);
  } catch (error) {
    console.error('=== ERROR fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// create a new review 
router.post('/', verifyToken, authenticateUser, async (req, res) => {
  try {
    const { rating, comment, product_id } = req.body;
    const user_id = req.user.id; // From authentication middleware
    
    console.log('=== DEBUG: Creating review with data:', { rating, comment, product_id, user_id });
    
    // Basic validation
    if (!rating || !product_id) {
      return res.status(400).json({ error: 'Rating and product_id are required' });
    }
    
    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    // see if the user has already reviewed this product
    const hasReviewed = await hasUserReviewedProduct(user_id, product_id);
    console.log('=== DEBUG: User has already reviewed:', hasReviewed);
    
    if (hasReviewed) {
      return res.status(409).json({ error: 'You have already reviewed this product' });
    }
    
    const reviewData = { rating, comment, product_id, user_id };
    const newReview = await createReview(reviewData);
    
    console.log('=== DEBUG: New review created:', newReview);
    
    res.status(201).json(newReview);
  } catch (error) {
    console.error('=== ERROR creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// update a review 
router.put('/:id', verifyToken, authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.id;
    
    console.log('=== DEBUG: Updating review:', { id, rating, comment, user_id });
    
    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    // Check if review exists and belongs to the user
    const existingReview = await getReviewById(parseInt(id));
    console.log('=== DEBUG: Existing review:', existingReview);
    
    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    if (existingReview.user_id !== user_id) {
      return res.status(403).json({ error: 'Unauthorized to edit this review' });
    }
    
    const updateData = { rating, comment };
    const updatedReview = await updateReview(parseInt(id), user_id, updateData);
    
    console.log('=== DEBUG: Updated review:', updatedReview);
    
    if (!updatedReview) {
      return res.status(404).json({ error: 'Failed to update review' });
    }
    
    res.json(updatedReview);
  } catch (error) {
    console.error('=== ERROR updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

router.get('/user-product/:productId', verifyToken, authenticateUser, async (req, res) => {
  try {
    const { productId } = req.params;
    const user_id = req.user.id; 
    
    console.log('=== DEBUG: Fetching user review for product:', { productId, user_id });
    
    const review = await getUserReviewForProduct(user_id, parseInt(productId));
    
    if (!review) {
      return res.status(404).json({ error: 'No review found' });
    }
    
    console.log('=== DEBUG: User review found:', review);
    res.json(review);
  } catch (error) {
    console.error('=== ERROR fetching user review for product:', error);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
});

// remove a review 
router.delete('/:id', verifyToken, authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    
    console.log('=== DEBUG: Deleting review:', { id, user_id });
    
    // Check if review exists and belongs to the user
    const existingReview = await getReviewById(parseInt(id));
    console.log('=== DEBUG: Existing review to delete:', existingReview);
    
    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    if (existingReview.user_id !== user_id) {
      return res.status(403).json({ error: 'Unauthorized to delete this review' });
    }
    
    const deletedReview = await deleteReview(parseInt(id), user_id);
    
    console.log('=== DEBUG: Deleted review:', deletedReview);
    
    if (!deletedReview) {
      return res.status(404).json({ error: 'Failed to delete review' });
    }
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('=== ERROR deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

export default router;