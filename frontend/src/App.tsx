import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import { ApiError, getProfile, logout, type User } from "./lib/api";
import { clearToken, getToken } from "./lib/auth";
import "./App.css";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(() => getToken() !== null);

  useEffect(() => {
    if (!getToken()) return;
    let cancelled = false;
    getProfile()
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) clearToken();
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // el token local se descarta aunque falle la llamada
    }
    clearToken();
    setUser(null);
  }

  if (checking) return <main className="card">Cargando…</main>;

  return (
    <main className="card">
      {user ? (
        <section>
          <h1>Hola, {user.fullName ?? user.email}</h1>
          <p>{user.email}</p>
          <button type="button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </section>
      ) : (
        <LoginForm onLogin={setUser} />
      )}
    </main>
  );
}

export default App;
