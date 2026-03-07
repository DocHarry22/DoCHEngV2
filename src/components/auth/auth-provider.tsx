"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { createAuthAdapter } from "@/lib/auth/adapter";
import { GUEST_SESSION } from "@/lib/auth/mock-auth";
import type { AppSession, AuthCredentialInput, AuthResult } from "@/lib/auth/types";

type AuthContextValue = {
  session: AppSession;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: AuthCredentialInput) => Promise<AuthResult>;
  signUp: (credentials: AuthCredentialInput) => Promise<AuthResult>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  session: GUEST_SESSION,
  isAuthenticated: false,
  isLoading: false,
  signIn: async () => ({ ok: false, message: "Auth provider unavailable." }),
  signUp: async () => ({ ok: false, message: "Auth provider unavailable." }),
  signOut: () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const adapter = useMemo(() => createAuthAdapter(), []);
  const [session, setSession] = useState<AppSession>(GUEST_SESSION);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSession(adapter.readSession());
    setIsLoading(false);
  }, [adapter]);

  const signIn = useCallback(async (credentials: AuthCredentialInput): Promise<AuthResult> => {
    const { result, session: nextSession } = await adapter.signIn(credentials);

    if (result.ok) {
      setSession(nextSession);
    }

    return result;
  }, [adapter]);

  const signUp = useCallback(async (credentials: AuthCredentialInput): Promise<AuthResult> => {
    const { result, session: nextSession } = await adapter.signUp(credentials);

    if (result.ok) {
      setSession(nextSession);
    }

    return result;
  }, [adapter]);

  const signOut = useCallback(() => {
    setSession(adapter.signOut());
  }, [adapter]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: session.state === "authenticated",
      isLoading,
      signIn,
      signUp,
      signOut
    }),
    [session, isLoading, signIn, signOut, signUp]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
