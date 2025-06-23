import db from "../client.js"

// Get all reviews for a product 
export async function getReviewsByProduct(productId) {
  const query = `
    SELECT r.*, u.username 
    FROM reviews r 
    JOIN users u ON r.user_id = u.id 
    WHERE r.product_id = $1 
    ORDER BY r.id DESC
  `;
  const result = await db.query(query, [productId]);
  return result.rows;
}

//Get a specific user's review for a product 
export async function getUserReviewForProduct(userId, productId) {
  const query = `
    SELECT * FROM reviews 
    WHERE user_id = $1 AND product_id = $2
  `;
  const result = await db.query(query, [userId, productId]);
  return result.rows[0] || null;
}

//Get a specific review by review id 
export async function getReviewById(reviewId) {
  const query = 'SELECT * FROM reviews WHERE id = $1';
  const result = await db.query(query, [reviewId]);
  return result.rows[0] || null;
}

// create a new review 
export async function createReview(reviewData) {
  const { rating, comment, product_id, user_id } = reviewData;
  const query = `
    INSERT INTO reviews (rating, comment, product_id, user_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const result = await db.query(query, [rating, comment, product_id, user_id]);
  return result.rows[0];
}

// Update a review 
export async function updateReview(reviewId, userId, updateData) {
  const { rating, comment } = updateData;
  const query = `
    UPDATE reviews 
    SET rating = $1, comment = $2
    WHERE id = $3 AND user_id = $4
    RETURNING *
  `;
  const result = await db.query(query, [rating, comment, reviewId, userId]);
  return result.rows[0] || null;
}

// Delete a review
export async function deleteReview(reviewId, userId) {
  const query = 'DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING *';
  const result = await db.query(query, [reviewId, userId]);
  return result.rows[0] || null;
}

// Check if a user has already reviewed a product
export async function hasUserReviewedProduct(userId, productId) {
  const query = 'SELECT id FROM reviews WHERE user_id = $1 AND product_id = $2';
  const result = await db.query(query, [userId, productId]);
  return result.rows.length > 0;
}

// Get all reviews created by a specific user
export async function getAllReviewsByUser(userId) {
  const query = `
    SELECT r.*, p.title as product_name
    FROM reviews r 
    JOIN products p ON r.product_id = p.id 
    WHERE r.user_id = $1 
    ORDER BY r.id DESC
  `;
  const result = await db.query(query, [userId]);
  return result.rows;
}