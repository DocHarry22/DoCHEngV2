import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import AccountPage from "@/app/account/page";
import { AuthFormCard } from "@/components/auth/auth-form-card";
import { AuthProvider } from "@/components/auth/auth-provider";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { AUTH_STORAGE_KEY } from "@/lib/auth/mock-auth";

const pushMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock })
}));

describe("Auth Flows", () => {
  beforeEach(() => {
    pushMock.mockReset();
    window.localStorage.clear();
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
  });

  it("signs in and redirects to next route", async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <AuthFormCard mode="signin" nextHref="/account" />
      </AuthProvider>
    );

    await user.type(screen.getByLabelText(/email/i), "member@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/account");
    });

    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toContain('"authenticated"');
    expect(document.cookie).toContain(`${AUTH_COOKIE_NAME}=1`);
  });

  it("signs up and redirects to next route", async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <AuthFormCard mode="signup" nextHref="/account" />
      </AuthProvider>
    );

    await user.type(screen.getByLabelText(/email/i), "newuser@example.com");
    await user.type(screen.getByLabelText(/full name/i), "New User");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/account");
    });

    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toContain('"authenticated"');
  });

  it("signs out from account and shows protected prompt", async () => {
    const user = userEvent.setup();

    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        state: "authenticated",
        user: {
          id: "user-member@example.com",
          name: "Member",
          email: "member@example.com",
          role: "user"
        },
        entitlements: []
      })
    );
    document.cookie = `${AUTH_COOKIE_NAME}=1; path=/`;

    render(
      <AuthProvider>
        <AccountPage />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/signed in as/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /sign out/i }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /sign in to continue/i })).toBeInTheDocument();
    });

    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toContain('"guest"');
    expect(document.cookie).not.toContain(`${AUTH_COOKIE_NAME}=1`);
  });
});
