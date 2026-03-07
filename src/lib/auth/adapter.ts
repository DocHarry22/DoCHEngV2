import type { AppSession, AuthCredentialInput, AuthResult } from "@/lib/auth/types";
import { createMockAuthAdapter } from "@/lib/auth/adapters/mock-auth-adapter";

export type AuthAdapterSignInResult = {
  result: AuthResult;
  session: AppSession;
};

export type AuthAdapter = {
  readSession: () => AppSession;
  signIn: (credentials: AuthCredentialInput) => Promise<AuthAdapterSignInResult>;
  signUp: (credentials: AuthCredentialInput) => Promise<AuthAdapterSignInResult>;
  signOut: () => AppSession;
};

export function createAuthAdapter(): AuthAdapter {
  const provider = process.env.NEXT_PUBLIC_AUTH_PROVIDER ?? "mock";

  if (provider === "mock") {
    return createMockAuthAdapter();
  }

  return createMockAuthAdapter();
}
