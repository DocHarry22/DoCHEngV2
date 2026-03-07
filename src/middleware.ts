import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE } from "@/lib/auth/constants";

function hasAuthCookie(request: NextRequest): boolean {
  return request.cookies.get(AUTH_COOKIE_NAME)?.value === AUTH_COOKIE_VALUE;
}

function createSignInRedirect(request: NextRequest): NextResponse {
  const signInUrl = new URL("/signin", request.url);
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  signInUrl.searchParams.set("next", nextPath || "/account");

  return NextResponse.redirect(signInUrl);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = hasAuthCookie(request);

  const accountRoute = pathname === "/account" || pathname.startsWith("/account/");

  if (accountRoute && !authenticated) {
    return createSignInRedirect(request);
  }

  const authEntryRoute = pathname === "/signin" || pathname === "/signup";

  if (authEntryRoute && authenticated) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/signin", "/signup"]
};
