import React from "react";
import { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import ReviewComposer from "../components/ReviewComposer";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

const fallbackPoster =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80";

function formatDate(value) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function getMediaUrl(media) {
  if (!media) {
    return "";
  }

  if (typeof media === "string") {
    return media;
  }

  return media.url || "";
}

function MoviePage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { openAuthModal } = useOutletContext();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadMovie() {
      setIsLoading(true);

      try {
        const { data } = await api.get(`/movies/${slug}`);
        const nextMovie = data?.movie || data;
        if (isActive) {
          setMovie(nextMovie && typeof nextMovie === "object" ? nextMovie : null);
          setErrorMessage("");
        }
      } catch (error) {
        if (isActive) {
          setMovie(null);
          setErrorMessage(
            error.response?.data?.message || "Unable to load this movie.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadMovie();

    return () => {
      isActive = false;
    };
  }, [slug]);

  async function reloadMovie() {
    const { data } = await api.get(`/movies/${slug}`);
    setMovie(data?.movie || data);
  }

  async function handleSubmitReview(payload) {
    if (!user) {
      openAuthModal("login");
      return {
        ok: false,
        message: "Sign in before posting a review.",
      };
    }

    setIsSubmitting(true);

    try {
      const requestPayload = {
        rating: payload.rating,
        comment: payload.comment.trim(),
      };
      const title = payload.title.trim();

      if (title) {
        requestPayload.title = title;
      }

      await api.post(
        `/movies/${movie.tmdbId || movie.id}/reviews`,
        requestPayload,
      );
      await reloadMovie();

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message:
          error.response?.data?.message || "Unable to publish your review.",
      };
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="page">
        <section className="section">
          <EmptyState copy="Loading movie details." title="One moment" />
        </section>
      </div>
    );
  }

  if (errorMessage || !movie) {
    return (
      <div className="page">
        <section className="section">
          <EmptyState
            copy={errorMessage || "The requested movie could not be found."}
            title="Movie unavailable"
          />
        </section>
      </div>
    );
  }

  const cast = Array.isArray(movie.cast) ? movie.cast : [];
  const genres = Array.isArray(movie.genres) ? movie.genres : [];
  const reviews = Array.isArray(movie.reviews) ? movie.reviews : [];
  const posterUrl = getMediaUrl(movie.poster) || fallbackPoster;
  const reviewCount = Number.isFinite(Number(movie.reviewCount))
    ? Number(movie.reviewCount)
    : reviews.length;
  const reviewTotal = reviews.reduce(
    (sum, review) => sum + Number(review.rating || 0),
    0,
  );
  const averageRating = reviewCount > 0
    ? reviews.length > 0
      ? reviewTotal / reviews.length
      : Number(movie.averageRating || 0)
    : 0;
  const detailMeta = [
    movie.releaseYear,
    movie.runtimeMinutes ? `${movie.runtimeMinutes} min` : null,
    reviewCount > 0 && averageRating > 0
      ? `${averageRating.toFixed(1)} / 5`
      : "No site ratings yet",
    `${reviewCount} reviews`,
  ].filter(Boolean);

  return (
    <div className="page">
      <section className="detail-hero section">
        <div className="detail-hero__grid">
          <div className="detail-hero__poster">
            <img alt={movie.title} src={posterUrl} />
          </div>

          <div className="detail-hero__copy">
            <p className="eyebrow">Movie details</p>
            <h1>{movie.title}</h1>
            <p className="hero__lede">{movie.synopsis || "Synopsis unavailable."}</p>

            <div className="detail-meta">
              {detailMeta.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="tag-row">
              {genres.map((genre) => (
                <span className="tag" key={genre}>
                  {genre}
                </span>
              ))}
            </div>

            <div className="detail-actions">
              {movie.trailerUrl && (
                <a
                  className="solid-button"
                  href={movie.trailerUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Watch trailer
                </a>
              )}
              <Link className="ghost-button" to="/">
                Back to movies
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <article className="panel section-panel">
          <div className="section-panel__header">
            <div>
              <p className="eyebrow">Credits</p>
              <h2>Cast</h2>
            </div>
            {cast.length > 0 && (
              <span className="section-panel__meta">
                {cast.length} credited
              </span>
            )}
          </div>

          {cast.length ? (
            <div className="cast-list">
              {cast.map((performer) => (
                <span className="cast-pill" key={performer}>
                  {performer}
                </span>
              ))}
            </div>
          ) : (
            <p className="section-panel__copy">
              Cast details are not available for this title.
            </p>
          )}
        </article>
      </section>

      <section className="section review-layout">
        {user ? (
          <ReviewComposer
            isSubmitting={isSubmitting}
            onSubmit={handleSubmitReview}
          />
        ) : (
          <article className="panel callout-panel">
            <p className="eyebrow">Add your review</p>
            <h2>Want to rate this movie?</h2>
            <p>Create an account to post a rating and comment.</p>
            <button
              className="solid-button"
              onClick={() => openAuthModal("register")}
              type="button"
            >
              Sign up to review
            </button>
          </article>
        )}

        <div className="reviews-panel">
          <div className="reviews-panel__header">
            <div>
              <p className="eyebrow">Community reviews</p>
              <h2>Reviews</h2>
            </div>
            <span>{reviewCount} entries</span>
          </div>

          {reviews.length ? (
            <div className="review-grid">
              {reviews.map((review) => (
                <article
                  className="review-card"
                  key={review.id || `${review.user?.name}-${review.createdAt}`}
                >
                  <div className="review-card__header">
                    <div>
                      <h3>{review.title || "Review"}</h3>
                      <p>
                        {review.user?.name || "Reviewer"} ·{" "}
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                    <strong>{review.rating}/5</strong>
                  </div>
                  <p>{review.comment}</p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              copy="Be the first person to review this movie."
              title="No reviews yet"
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default MoviePage;
