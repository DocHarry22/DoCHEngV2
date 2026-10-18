import type {
  AppSession,
  AuthCredentialInput,
  AuthResult,
} from "@/lib/auth/types";
export type AuthAdapterSignInResult = {
  result: AuthResult;
  session: AppSession;
};
export type AuthAdapter = {
  readSession: () => Promise<AppSession>;
  signIn: (
    credentials: AuthCredentialInput,
  ) => Promise<AuthAdapterSignInResult>;
  signUp: (
    credentials: AuthCredentialInput,
  ) => Promise<AuthAdapterSignInResult>;
  signOut: () => Promise<AppSession>;
};
export function createAuthAdapter(): AuthAdapter {
  const guest: AppSession = { state: "guest", user: null, entitlements: [] };
  async function submit(
    action: string,
    credentials: AuthCredentialInput,
  ): Promise<AuthAdapterSignInResult> {
    try {
      const response = await fetch(`/api/auth/${action}`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      return {
        result: { ok: response.ok && data.ok === true, message: data.message },
        session: data.session ?? guest,
      };
    } catch {
      return {
        result: { ok: false, message: "Unable to reach the account service." },
        session: guest,
      };
    }
  }
  return {
    readSession: async () => {
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
          credentials: "same-origin",
        });
        return response.ok ? ((await response.json()) as AppSession) : guest;
      } catch {
        return guest;
      }
    },
    signIn: (credentials) => submit("signin", credentials),
    signUp: (credentials) => submit("signup", credentials),
    signOut: async () => {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      if (!response.ok) throw new Error("Unable to sign out. Please retry.");
      return guest;
    },
  };
}
