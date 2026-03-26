import React from "react";
import { useDeferredValue, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const deferredSearch = useDeferredValue(searchText.trim());
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openAuthModal, statusError } = useOutletContext();

  useEffect(() => {
    let isActive = true;

    async function loadMovies() {
      setIsLoading(true);

      try {
        const params = { page };
        if (deferredSearch) {
          params.query = deferredSearch;
        }

        const { data } = await api.get("/movies", { params });
        const responseBody = Array.isArray(data) ? { movies: data } : data || {};

        if (!isActive) {
          return;
        }

        setMovies(Array.isArray(responseBody.movies) ? responseBody.movies : []);
        setTotalPages(
          Number.isFinite(Number(responseBody.totalPages))
            ? Number(responseBody.totalPages)
            : null,
        );
        setErrorMessage("");
      } catch (error) {
        if (isActive) {
          setMovies([]);
          setErrorMessage(
            error.response?.data?.message || "Unable to load movies right now.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      isActive = false;
    };
  }, [deferredSearch, page]);

  const movieList = Array.isArray(movies) ? movies : [];
  let totalReviews = 0;
  let topRating = 0;
  let topMovie = null;

  for (const movie of movieList) {
    const reviewCount = Number(movie.reviewCount || 0);
    const rating = reviewCount > 0 ? Number(movie.averageRating || 0) : 0;

    totalReviews += reviewCount;

    if (reviewCount > 0) {
      topRating = Math.max(topRating, rating);
    }

    if (
      reviewCount > 0 &&
      (!topMovie || rating > Number(topMovie.averageRating || 0))
    ) {
      topMovie = movie;
    }
  }

  const canGoPrevious = page > 1;
  const canGoNext = totalPages ? page < totalPages : movieList.length > 0;
  const headingText = deferredSearch
    ? `Results for "${deferredSearch}"`
    : "Popular movies";
  const topMoviePath = topMovie
    ? `/movies/${topMovie.slug || topMovie.tmdbId || topMovie.id}`
    : "";

  function handleSearchChange(event) {
    setSearchText(event.target.value);
    setPage(1);
  }

  return (
    <div className="page">
      <section className="hero hero--single section">
        <div className="hero__copy">
          <p className="eyebrow">Movie reviews</p>
          <h1>Search movies, read reviews, and post your own.</h1>
          <p className="hero__lede">
            Browse the TMDB catalog, open any movie page, and add your review
            when you are signed in.
          </p>

          <div className="hero__actions">
            {topMovie && (
              <button
                className="solid-button"
                onClick={() => navigate(topMoviePath)}
                type="button"
              >
                Read top-rated reviews
              </button>
            )}

            <button
              className="ghost-button"
              onClick={() =>
                user ? navigate("/account") : openAuthModal("register")
              }
              type="button"
            >
              {user ? "View account" : "Create account"}
            </button>
          </div>
        </div>
      </section>

      <section className="section catalog">
        <div className="catalog__header">
          <div>
            <p className="eyebrow">Movies</p>
            <h2>{headingText}</h2>
            <p className="catalog__count">
              {movieList.length} titles on this page · {totalReviews} reviews in
              current results ·{" "}
              {topMovie ? `${topRating.toFixed(1)} top rating` : "No local ratings yet"}
            </p>
          </div>

          <label className="search-field">
            <span>Search titles</span>
            <input
              onChange={handleSearchChange}
              placeholder="Search by title"
              type="search"
              value={searchText}
            />
          </label>
        </div>

        {statusError && <p className="form-error">{statusError}</p>}

        {isLoading ? (
          <div className="empty-state">
            <h3>Loading movies...</h3>
          </div>
        ) : errorMessage ? (
          <EmptyState copy={errorMessage} title="We could not load the movies" />
        ) : movieList.length ? (
          <>
            <div className="movie-grid">
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            <div className="pager">
              <button
                className="ghost-button"
                disabled={!canGoPrevious}
                onClick={() => setPage((currentPage) => currentPage - 1)}
                type="button"
              >
                Previous
              </button>
              <span className="pager__label">
                Page {page}
                {totalPages ? ` of ${totalPages}` : ""}
              </span>
              <button
                className="ghost-button"
                disabled={!canGoNext}
                onClick={() => setPage((currentPage) => currentPage + 1)}
                type="button"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <EmptyState
            copy="Try another title or clear the search."
            title="No movies matched your search"
          />
        )}
      </section>
    </div>
  );
}

export default HomePage;
