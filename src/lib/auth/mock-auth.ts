// Compatibility constants only. Authentication is always server-validated.
import type { AppSession } from "@/lib/auth/types";
export const AUTH_STORAGE_KEY = "dochengv2.session.v1";
export const GUEST_SESSION: AppSession = {
  state: "guest",
  user: null,
  entitlements: [],
};
