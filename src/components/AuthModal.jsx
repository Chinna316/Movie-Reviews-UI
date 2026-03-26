import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

function AuthModal({ isOpen, mode, onClose, onModeChange }) {
  const [formState, setFormState] = useState(initialForm);
  const [errorMessage, setErrorMessage] = useState("");
  const { login, register, isAuthenticating } = useAuth();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormState(initialForm);
    setErrorMessage("");
  }, [isOpen, mode]);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const payload =
      mode === "register"
        ? formState
        : {
            email: formState.email,
            password: formState.password,
          };

    const result =
      mode === "register" ? await register(payload) : await login(payload);

    if (result.ok) {
      onClose();
      return;
    }

    setErrorMessage(result.message);
  }

  function updateField(event) {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-card"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className="modal-close" onClick={onClose} type="button">
          Close
        </button>

        <p className="eyebrow">Account access</p>
        <h2>{mode === "register" ? "Create an account" : "Welcome back"}</h2>
        <p className="modal-copy">
          {mode === "register"
            ? "Create an account to post reviews and rate movies."
            : "Sign in to continue reviewing movies."}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <label>
              Name
              <input
                autoComplete="name"
                minLength="2"
                name="name"
                onChange={updateField}
                placeholder="Your name"
                required
                type="text"
                value={formState.name}
              />
            </label>
          )}

          <label>
            Email
            <input
              autoComplete="email"
              name="email"
              onChange={updateField}
              placeholder="you@example.com"
              required
              type="email"
              value={formState.email}
            />
          </label>

          <label>
            Password
            <input
              autoComplete={
                mode === "register" ? "new-password" : "current-password"
              }
              minLength="8"
              name="password"
              onChange={updateField}
              placeholder="At least 8 characters"
              required
              type="password"
              value={formState.password}
            />
          </label>

          {errorMessage && <p className="form-error">{errorMessage}</p>}

          <button className="solid-button solid-button--full" type="submit">
            {isAuthenticating
              ? "Please wait..."
              : mode === "register"
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <div className="modal-switch">
          {mode === "register" ? "Already have an account?" : "Need an account?"}
          <button
            className="text-button"
            onClick={() =>
              onModeChange(mode === "register" ? "login" : "register")
            }
            type="button"
          >
            {mode === "register" ? "Sign in" : "Create one"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
