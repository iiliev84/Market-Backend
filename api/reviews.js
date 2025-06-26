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

const router = express.Router();

const authenticateUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Get reviews for the currently authenticated user
router.get('/user', verifyToken, authenticateUser, async (req, res) => {
  try {
    const user_id = req.user.id;
    const reviews = await getAllReviewsByUser(user_id);
    res.json(reviews || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user reviews' });
  }
});

// Get reviews for a specific user (by ID)
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await getAllReviewsByUser(parseInt(userId));
    res.json(reviews || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user reviews' });
  }
});

// Get all reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await getReviewsByProduct(parseInt(productId));
    res.json(reviews || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get user's review for a specific product
router.get('/user-product/:productId', verifyToken, authenticateUser, async (req, res) => {
  try {
    const { productId } = req.params;
    const user_id = req.user.id;
    const review = await getUserReviewForProduct(user_id, parseInt(productId));
    
    if (!review) {
      return res.status(404).json({ error: 'No review found' });
    }
    
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch review' });
  }
});

// Create a new review
router.post('/', verifyToken, authenticateUser, async (req, res) => {
  try {
    const { rating, comment, product_id } = req.body;
    const user_id = req.user.id;
    
    if (!rating || !product_id) {
      return res.status(400).json({ error: 'Rating and product_id are required' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const hasReviewed = await hasUserReviewedProduct(user_id, product_id);
    if (hasReviewed) {
      return res.status(409).json({ error: 'You have already reviewed this product' });
    }
    
    const reviewData = { rating, comment, product_id, user_id };
    const newReview = await createReview(reviewData);
    
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Update a review
router.put('/:id', verifyToken, authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.id;
    
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const existingReview = await getReviewById(parseInt(id));
    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    if (existingReview.user_id !== user_id) {
      return res.status(403).json({ error: 'Unauthorized to edit this review' });
    }
    
    const updateData = { rating, comment };
    const updatedReview = await updateReview(parseInt(id), user_id, updateData);
    
    if (!updatedReview) {
      return res.status(404).json({ error: 'Failed to update review' });
    }
    
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// Delete a review
router.delete('/:id', verifyToken, authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    
    const existingReview = await getReviewById(parseInt(id));
    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    if (existingReview.user_id !== user_id) {
      return res.status(403).json({ error: 'Unauthorized to delete this review' });
    }
    
    const deletedReview = await deleteReview(parseInt(id), user_id);
    if (!deletedReview) {
      return res.status(404).json({ error: 'Failed to delete review' });
    }
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

export default router;