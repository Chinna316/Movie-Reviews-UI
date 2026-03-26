import React from "react";
import { useState } from "react";

const initialReview = {
  title: "",
  rating: 5,
  comment: "",
};

function ReviewComposer({ isSubmitting, onSubmit }) {
  const [formState, setFormState] = useState(initialReview);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const result = await onSubmit(formState);

    if (result.ok) {
      setFormState(initialReview);
      setErrorMessage("");
      return;
    }

    setErrorMessage(result.message || "We could not save your review.");
  }

  function updateField(event) {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  }

  function updateRating(nextRating) {
    setFormState((current) => ({ ...current, rating: nextRating }));
  }

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <div className="composer__header">
        <div>
          <p className="eyebrow">Write a review</p>
          <h3>Share your rating</h3>
        </div>
        <div className="rating-picker">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              className={
                rating === formState.rating
                  ? "rating-chip rating-chip--active"
                  : "rating-chip"
              }
              key={rating}
              onClick={() => updateRating(rating)}
              type="button"
            >
              {rating}
            </button>
          ))}
        </div>
      </div>

      <label>
        Headline (optional)
        <input
          maxLength="80"
          name="title"
          onChange={updateField}
          placeholder="Short summary"
          type="text"
          value={formState.title}
        />
      </label>

      <label>
        Review
        <textarea
          maxLength="800"
          name="comment"
          onChange={updateField}
          placeholder="What did you think about this movie?"
          required
          rows="5"
          value={formState.comment}
        />
      </label>

      {errorMessage && <p className="form-error">{errorMessage}</p>}

      <button className="solid-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Saving review..." : "Post review"}
      </button>
    </form>
  );
}

export default ReviewComposer;
