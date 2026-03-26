import React from "react";
import { useOutletContext } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";

function AccountPage() {
  const { user } = useAuth();
  const { openAuthModal, platformStatus, statusError } = useOutletContext();

  if (!user) {
    return (
      <div className="page">
        <section className="section">
          <article className="panel callout-panel">
            <p className="eyebrow">Account</p>
            <h1>Sign in to review movies.</h1>
            <p>
              Create an account or sign in to post ratings and reviews from each
              movie page.
            </p>
            <div className="hero__actions">
              <button
                className="solid-button"
                onClick={() => openAuthModal("login")}
                type="button"
              >
                Sign in
              </button>
              <button
                className="ghost-button"
                onClick={() => openAuthModal("register")}
                type="button"
              >
                Create account
              </button>
            </div>
          </article>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="section detail-panels">
        <article className="panel">
          <p className="eyebrow">Account</p>
          <h1>Your account</h1>
          <p>
            Signed in as {user.name} ({user.email})
          </p>

          <div className="stack-strip">
            <span>Status: Signed in</span>
            <span>Auth: {platformStatus?.authStore || "Unavailable"}</span>
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">How it works</p>
          <h2>Reviews happen on movie pages.</h2>
          <p>
            Open any movie, choose a rating, and post your review. Your reviews
            stay tied to your account.
          </p>

          {statusError ? (
            <p className="form-error">{statusError}</p>
          ) : platformStatus ? (
            <div className="stack-strip">
              <span>Catalog: {platformStatus.catalogSource || "Unavailable"}</span>
              <span>
                {platformStatus.tmdbConfigured
                  ? "TMDB configured"
                  : "TMDB not configured"}
              </span>
            </div>
          ) : (
            <EmptyState
              copy="Platform details are not available right now."
              title="Status unavailable"
            />
          )}
        </article>
      </section>
    </div>
  );
}

export default AccountPage;
