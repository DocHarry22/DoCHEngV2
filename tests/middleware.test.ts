import { NextRequest } from "next/server";

import { AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE } from "@/lib/auth/constants";
import { middleware } from "@/middleware";

describe("middleware auth routing", () => {
  it("redirects guest users away from account route", () => {
    const request = new NextRequest("http://localhost/account");
    const response = middleware(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/signin?next=%2Faccount");
  });

  it("allows authenticated users on account route", () => {
    const request = new NextRequest("http://localhost/account", {
      headers: {
        cookie: `${AUTH_COOKIE_NAME}=${AUTH_COOKIE_VALUE}`
      }
    });

    const response = middleware(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("redirects authenticated users away from signin route", () => {
    const request = new NextRequest("http://localhost/signin", {
      headers: {
        cookie: `${AUTH_COOKIE_NAME}=${AUTH_COOKIE_VALUE}`
      }
    });

    const response = middleware(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/account");
  });
});
