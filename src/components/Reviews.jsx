import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import './Reviews.css';

const Reviews = ({ propertyId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    cleanliness: 5,
    communication: 5,
    checkIn: 5,
    accuracy: 5,
    location: 5,
    value: 5
  });
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [propertyId]);

  const fetchReviews = async () => {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('propertyId', '==', propertyId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const reviewsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(reviewsList);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please log in to leave a review');
      return;
    }

    try {
      const reviewData = {
        ...newReview,
        propertyId,
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email,
        userPhoto: currentUser.photoURL,
        createdAt: new Date(),
        overallRating: calculateOverallRating(newReview)
      };

      await addDoc(collection(db, 'reviews'), reviewData);
      
      // Reset form and refresh reviews
      setNewReview({
        rating: 5,
        comment: '',
        cleanliness: 5,
        communication: 5,
        checkIn: 5,
        accuracy: 5,
        location: 5,
        value: 5
      });
      setShowReviewForm(false);
      fetchReviews();
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Error adding review. Please try again.');
    }
  };

  const calculateOverallRating = (review) => {
    const ratings = [
      review.cleanliness,
      review.communication,
      review.checkIn,
      review.accuracy,
      review.location,
      review.value
    ];
    return Math.round(ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length);
  };

  const formatDate = (date) => {
    return new Date(date.toDate()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.overallRating, 0) / reviews.length 
    : 0;

  if (loading) {
    return <div className="reviews-loading">Loading reviews...</div>;
  }

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h3>Reviews</h3>
        <div className="reviews-summary">
          <div className="average-rating">
            <span className="rating-number">{averageRating.toFixed(1)}</span>
            <div className="stars">{renderStars(Math.round(averageRating))}</div>
            <span className="review-count">({reviews.length} reviews)</span>
          </div>
        </div>
        {currentUser && (
          <button 
            className="write-review-btn"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            Write a Review
          </button>
        )}
      </div>

      {showReviewForm && (
        <div className="review-form-container">
          <form onSubmit={handleSubmitReview} className="review-form">
            <h4>Write Your Review</h4>
            
            <div className="rating-categories">
              <div className="rating-category">
                <label>Cleanliness</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= newReview.cleanliness ? 'active' : ''}`}
                      onClick={() => setNewReview(prev => ({ ...prev, cleanliness: star }))}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="rating-category">
                <label>Communication</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= newReview.communication ? 'active' : ''}`}
                      onClick={() => setNewReview(prev => ({ ...prev, communication: star }))}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="rating-category">
                <label>Check-in</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= newReview.checkIn ? 'active' : ''}`}
                      onClick={() => setNewReview(prev => ({ ...prev, checkIn: star }))}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="rating-category">
                <label>Accuracy</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= newReview.accuracy ? 'active' : ''}`}
                      onClick={() => setNewReview(prev => ({ ...prev, accuracy: star }))}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="rating-category">
                <label>Location</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= newReview.location ? 'active' : ''}`}
                      onClick={() => setNewReview(prev => ({ ...prev, location: star }))}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="rating-category">
                <label>Value</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= newReview.value ? 'active' : ''}`}
                      onClick={() => setNewReview(prev => ({ ...prev, value: star }))}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Your Review</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your experience..."
                rows="4"
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setShowReviewForm(false)}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review this property!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <img 
                    src={review.userPhoto || 'https://via.placeholder.com/40x40'} 
                    alt={review.userName}
                    className="reviewer-avatar"
                  />
                  <div>
                    <h4>{review.userName}</h4>
                    <div className="stars">{renderStars(review.overallRating)}</div>
                  </div>
                </div>
                <span className="review-date">{formatDate(review.createdAt)}</span>
              </div>
              
              <div className="review-details">
                <div className="rating-breakdown">
                  <span>Cleanliness: {renderStars(review.cleanliness)}</span>
                  <span>Communication: {renderStars(review.communication)}</span>
                  <span>Check-in: {renderStars(review.checkIn)}</span>
                  <span>Accuracy: {renderStars(review.accuracy)}</span>
                  <span>Location: {renderStars(review.location)}</span>
                  <span>Value: {renderStars(review.value)}</span>
                </div>
              </div>

              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews; 