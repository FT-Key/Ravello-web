import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import ReviewForm from "../reviews/ReviewForm";
import ReviewList from "../reviews/ReviewList";

export default function PackageReviews({ packageId, reviews, reviewsLoading }) {
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-dark flex items-center gap-2">
          <MessageSquare className="text-primary-blue" />
          Opiniones de viajeros
        </h2>
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-opacity-90 transition-all text-sm font-semibold"
        >
          {showReviewForm ? "Cancelar" : "Dejar opinión"}
        </button>
      </div>

      {showReviewForm && (
        <div className="mb-6">
          <ReviewForm packageId={packageId} onSuccess={handleReviewSubmitted} />
        </div>
      )}

      <ReviewList reviews={reviews} loading={reviewsLoading} />
    </div>
  );
}