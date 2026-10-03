import { useState, type FormEvent } from "react";
import { ApiError, login, type User } from "../lib/api";
import { setToken } from "../lib/auth";

type Props = { onLogin: (user: User) => void };

export default function LoginForm({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);
    try {
      const { user, token } = await login(email, password);
      setToken(token);
      onLogin(user);
    } catch (err) {
      if (err instanceof ApiError) {
        if (Object.keys(err.fieldErrors).length > 0) {
          setFieldErrors(err.fieldErrors);
        } else {
          setError(err.message);
        }
      } else {
        setError("Error inesperado");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <h1>Iniciar sesión</h1>

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        autoComplete="email"
        maxLength={254}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={!!fieldErrors.email}
        aria-describedby={fieldErrors.email ? "email-error" : undefined}
      />
      {fieldErrors.email && (
        <p id="email-error" className="field-error">
          {fieldErrors.email}
        </p>
      )}

      <label htmlFor="password">Contraseña</label>
      <input
        id="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-invalid={!!fieldErrors.password}
        aria-describedby={fieldErrors.password ? "password-error" : undefined}
      />
      {fieldErrors.password && (
        <p id="password-error" className="field-error">
          {fieldErrors.password}
        </p>
      )}

      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading}>
        {loading ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
