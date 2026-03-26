import React from "react";
import { Link } from "react-router-dom";

const fallbackPoster =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80";

function getMediaUrl(media) {
  if (!media) {
    return fallbackPoster;
  }

  if (typeof media === "string") {
    return media;
  }

  return media.url || fallbackPoster;
}

function MovieCard({ movie }) {
  const genres = Array.isArray(movie.genres) ? movie.genres : [];
  const detailPath = `/movies/${movie.slug || movie.tmdbId || movie.id}`;
  const posterUrl = getMediaUrl(movie.poster);
  const meta = [
    movie.releaseYear,
    movie.runtimeMinutes ? `${movie.runtimeMinutes} min` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const reviewCount = Number(movie.reviewCount || 0);
  const averageRating = reviewCount > 0 ? Number(movie.averageRating || 0) : 0;
  const ratingLabel = reviewCount > 0 && averageRating > 0
    ? averageRating.toFixed(1)
    : "No ratings";

  return (
    <article className="movie-card">
      <div className="movie-card__poster">
        <img alt={movie.title} src={posterUrl} />
      </div>

      <div className="movie-card__content">
        <div className="movie-card__header">
          <div>
            <h3>{movie.title}</h3>
            <p>{meta || "Details coming soon"}</p>
          </div>
          <strong>{ratingLabel}</strong>
        </div>

        <p className="movie-card__synopsis">
          {movie.synopsis || "Synopsis unavailable."}
        </p>

        <div className="tag-row">
          {genres.map((genre) => (
            <span className="tag" key={genre}>
              {genre}
            </span>
          ))}
        </div>

        <div className="movie-card__footer">
          <span>{reviewCount} reviews</span>
          <Link className="text-button" to={detailPath}>
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default MovieCard;
