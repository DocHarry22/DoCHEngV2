import { AUTH_STORAGE_KEY, createSessionFromCredentials, GUEST_SESSION } from "@/lib/auth/mock-auth";
import type { AuthAdapter, AuthAdapterSignInResult } from "@/lib/auth/adapter";
import { AUTH_COOKIE_MAX_AGE_SECONDS, AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE } from "@/lib/auth/constants";
import type { AppSession, AuthCredentialInput } from "@/lib/auth/types";

function writeSessionToStorage(session: AppSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

function writeSessionCookie(session: AppSession) {
  if (typeof window === "undefined") return;

  if (session.state === "authenticated" && session.user) {
    document.cookie = `${AUTH_COOKIE_NAME}=${AUTH_COOKIE_VALUE}; path=/; max-age=${AUTH_COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
    return;
  }

  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
}

function readSessionFromStorage(): AppSession {
  if (typeof window === "undefined") return GUEST_SESSION;

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      writeSessionCookie(GUEST_SESSION);
      return GUEST_SESSION;
    }

    const parsed = JSON.parse(raw) as AppSession;

    if (parsed.state !== "authenticated" || !parsed.user) {
      writeSessionCookie(GUEST_SESSION);
      return GUEST_SESSION;
    }

    const normalized: AppSession = {
      state: "authenticated",
      user: parsed.user,
      entitlements: Array.isArray(parsed.entitlements) ? parsed.entitlements : []
    };

    writeSessionCookie(normalized);
    return normalized;
  } catch {
    writeSessionCookie(GUEST_SESSION);
    return GUEST_SESSION;
  }
}

async function buildSignIn(credentials: AuthCredentialInput): Promise<AuthAdapterSignInResult> {
  if (!credentials.email.trim() || !credentials.password.trim()) {
    return { result: { ok: false, message: "Email and password are required." }, session: GUEST_SESSION };
  }

  const session = createSessionFromCredentials(credentials);
  writeSessionToStorage(session);
  writeSessionCookie(session);

  return { result: { ok: true }, session };
}

export function createMockAuthAdapter(): AuthAdapter {
  return {
    readSession: readSessionFromStorage,
    signIn: buildSignIn,
    signUp: async (credentials) => {
      if (!credentials.name?.trim()) {
        return { result: { ok: false, message: "Name is required to create your account." }, session: GUEST_SESSION };
      }

      return buildSignIn(credentials);
    },
    signOut: () => {
      writeSessionToStorage(GUEST_SESSION);
      writeSessionCookie(GUEST_SESSION);
      return GUEST_SESSION;
    }
  };
}
