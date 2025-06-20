import express from "express";
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
    const reviews = await reviewsDB.getAllReviewsByUser(userId);
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ error: 'Failed to fetch user reviews' });
  }
});

// pull all reviews for a particular product 
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await reviewsDB.getReviewsByProduct(productId);
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// create a new review 

router.post('/', authenticateUser, async (req, res) => {
  try {
    const { rating, comment, product_id } = req.body;
    const user_id = req.user.id; // From authentication middleware
    
    // Basic validation
    if (!rating || !product_id) {
      return res.status(400).json({ error: 'Rating and product_id are required' });
    }
    
    // see if the user has already reviewed this product
    const hasReviewed = await reviewsDB.hasUserReviewedProduct(user_id, product_id);
    if (hasReviewed) {
      return res.status(409).json({ error: 'You have already reviewed this product' });
    }
    
    const reviewData = { rating, comment, product_id, user_id };
    const newReview = await reviewsDB.createReview(reviewData);
    
    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// update a review 

router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.id;
    
    // Check if review exists and belongs to the user
    const existingReview = await reviewsDB.getReviewById(id);
    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    if (existingReview.user_id !== user_id) {
      return res.status(403).json({ error: 'Unauthorized to edit this review' });
    }
    
    const updateData = { rating, comment };
    const updatedReview = await reviewsDB.updateReview(id, user_id, updateData);
    
    if (!updatedReview) {
      return res.status(404).json({ error: 'Failed to update review' });
    }
    
    res.json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// remove a review 
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    
    // Check if review exists and belongs to the user
    const existingReview = await reviewsDB.getReviewById(id);
    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    if (existingReview.user_id !== user_id) {
      return res.status(403).json({ error: 'Unauthorized to delete this review' });
    }
    
    const deletedReview = await reviewsDB.deleteReview(id, user_id);
    
    if (!deletedReview) {
      return res.status(404).json({ error: 'Failed to delete review' });
    }
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }

});

module.exports = router;