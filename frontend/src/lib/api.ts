import { getToken } from "./auth";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

export type User = {
  id: number;
  fullName: string | null;
  email: string;
  createdAt: string;
  updatedAt: string | null;
  initials: string;
};

type ErrorItem = { message: string; field?: string; rule?: string };

export class ApiError extends Error {
  status: number;
  fieldErrors: Record<string, string>;

  constructor(status: number, errors: ErrorItem[]) {
    super(errors[0]?.message ?? "Error inesperado");
    this.status = status;
    this.fieldErrors = {};
    for (const e of errors) {
      if (e.field && !(e.field in this.fieldErrors)) {
        this.fieldErrors[e.field] = e.message;
      }
    }
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/v1${path}`, { ...init, headers });
  } catch {
    throw new ApiError(0, [{ message: "No se pudo conectar con el servidor" }]);
  }

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(
      res.status,
      body?.errors ?? [{ message: "Error inesperado" }],
    );
  }
  return body as T;
}

export async function login(
  email: string,
  password: string,
): Promise<{ user: User; token: string }> {
  const body = await request<{ data: { user: User; token: string } }>(
    "/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) },
  );
  return body.data;
}

export async function getProfile(): Promise<User> {
  const body = await request<{ data: User }>("/account/profile");
  return body.data;
}

export async function logout(): Promise<void> {
  await request("/account/logout", { method: "POST" });
}
