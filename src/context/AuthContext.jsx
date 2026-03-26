import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken } from "../lib/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "movie-reviews-session";

function getStoredToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(STORAGE_KEY) || "";
}

function extractMessage(error, fallbackMessage) {
  return error.response?.data?.message || fallbackMessage;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken);
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    setAuthToken(token);

    if (!token) {
      setUser(null);
      setIsReady(true);
      return undefined;
    }

    let isActive = true;

    async function bootstrapSession() {
      try {
        const { data } = await api.get("/auth/me");
        if (isActive) {
          setUser(data.user);
        }
      } catch (error) {
        if (isActive) {
          window.localStorage.removeItem(STORAGE_KEY);
          setToken("");
          setAuthToken("");
          setUser(null);
        }
      } finally {
        if (isActive) {
          setIsReady(true);
        }
      }
    }

    bootstrapSession();

    return () => {
      isActive = false;
    };
  }, [token]);

  function persistSession(nextToken, nextUser) {
    window.localStorage.setItem(STORAGE_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
    setAuthToken(nextToken);
  }

  async function authenticate(endpoint, payload, fallbackMessage) {
    setIsAuthenticating(true);

    try {
      const { data } = await api.post(endpoint, payload);
      persistSession(data.token, data.user);
      return { ok: true, data };
    } catch (error) {
      return {
        ok: false,
        message: extractMessage(error, fallbackMessage),
      };
    } finally {
      setIsAuthenticating(false);
    }
  }

  async function login(values) {
    return authenticate("/auth/login", values, "Unable to sign in right now.");
  }

  async function register(values) {
    return authenticate(
      "/auth/register",
      values,
      "Unable to create your account right now.",
    );
  }

  function logout() {
    window.localStorage.removeItem(STORAGE_KEY);
    setToken("");
    setAuthToken("");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isReady,
        isAuthenticating,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
