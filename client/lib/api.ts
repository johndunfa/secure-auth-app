/* ------------------------------------------------------------------ */
/*  Base URL                                                          */
/* ------------------------------------------------------------------ */
const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface MeResponse {
  user: User;
}

export interface ProtectedResponse {
  message: string;
  authenticated: boolean;
  user: User;
  secret: {
    serverTime: string;
    quote: string;
  };
}

/* ------------------------------------------------------------------ */
/*  Error class                                                       */
/* ------------------------------------------------------------------ */
export class ApiRequestError extends Error {
  public readonly status: number;
  public readonly errors?: Record<string, string>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string>
  ) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.errors = errors;
  }
}

/* ------------------------------------------------------------------ */
/*  Core fetch wrapper                                                */
/* ------------------------------------------------------------------ */
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  let res: Response;

  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include", // 🔑 send / receive the HTTP-only cookie
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiRequestError(
      "Cannot reach the server. Is the backend running?",
      0
    );
  }

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;

  if (!res.ok) {
    throw new ApiRequestError(
      (data.message as string) ?? "Something went wrong",
      res.status,
      data.errors as Record<string, string> | undefined
    );
  }

  return data as T;
}

/* ------------------------------------------------------------------ */
/*  Public API                                                        */
/* ------------------------------------------------------------------ */
export const api = {
  register: (body: RegisterPayload) =>
    request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: LoginPayload) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  logout: () =>
    request<{ message: string }>("/api/auth/logout", {
      method: "POST",
    }),

  me: () => request<MeResponse>("/api/auth/me", { method: "GET" }),

  protected: () =>
    request<ProtectedResponse>("/api/protected", { method: "GET" }),
};