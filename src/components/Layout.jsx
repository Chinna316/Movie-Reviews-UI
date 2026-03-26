import React from "react";
import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import AuthModal from "./AuthModal";

const navigation = [
  { label: "Movies", to: "/" },
  { label: "Account", to: "/account" },
];

function Layout() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [platformStatus, setPlatformStatus] = useState(null);
  const [statusError, setStatusError] = useState("");
  const location = useLocation();
  const { user, logout, isReady } = useAuth();

  useEffect(() => {
    let isActive = true;

    async function loadPlatformStatus() {
      try {
        const { data } = await api.get("/health");
        if (isActive) {
          setPlatformStatus(data);
          setStatusError("");
        }
      } catch (error) {
        if (isActive) {
          setStatusError(
            error.response?.data?.message || "Platform status is unavailable.",
          );
        }
      }
    }

    loadPlatformStatus();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    setIsAuthOpen(false);
  }, [location.pathname]);

  function openAuthModal(mode = "login") {
    setAuthMode(mode);
    setIsAuthOpen(true);
  }

  const statusLabel = statusError
    ? "API unavailable"
    : platformStatus?.status && platformStatus.status !== "ok"
      ? platformStatus.status
      : "";

  return (
    <>
      <div className="app-shell">
        <header className="topbar">
          <div className="topbar__inner">
            <Link className="brand" to="/">
              <span className="brand__mark">MR</span>
              <span>
                Movie Reviews
                <small>TMDB + Reviews</small>
              </span>
            </Link>

            <nav className="nav-links">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  className={({ isActive }) =>
                    isActive ? "nav-link nav-link--active" : "nav-link"
                  }
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="topbar__actions">
              {statusLabel && <span className="status-pill">{statusLabel}</span>}

              {user ? (
                <>
                  <div className="user-chip">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                  <button
                    className="ghost-button"
                    onClick={logout}
                    type="button"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="ghost-button"
                    onClick={() => openAuthModal("login")}
                    type="button"
                  >
                    Sign in
                  </button>
                  <button
                    className="solid-button"
                    onClick={() => openAuthModal("register")}
                    type="button"
                  >
                    Create account
                  </button>
                </>
              )}

            </div>
          </div>
        </header>

        <main>
          <Outlet
            context={{
              openAuthModal,
              platformStatus,
              statusError,
              isAuthReady: isReady,
            }}
          />
        </main>

        <footer className="footer">
          <span>Movie Reviews</span>
        </footer>
      </div>

      <AuthModal
        isOpen={isAuthOpen}
        mode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onModeChange={setAuthMode}
      />
    </>
  );
}

export default Layout;
