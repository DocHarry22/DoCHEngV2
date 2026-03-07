import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { vi } from "vitest";

import { AuthProvider } from "@/components/auth/auth-provider";
import { Navbar } from "@/components/layout/navbar";
import { AUTH_STORAGE_KEY } from "@/lib/auth/mock-auth";

vi.mock("next/navigation", () => ({
  usePathname: () => "/"
}));

describe("Navbar", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders grouped top-level navigation and primary CTA", () => {
    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    );

    expect(screen.getAllByRole("link", { name: /home/i })[0]).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /toggle ecosystem menu/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /toggle platform menu/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /toggle resources menu/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /toggle company menu/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open apps launcher/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /sign in/i })[0]).toHaveAttribute("href", "/signin");
    expect(screen.getAllByRole("link", { name: /explore products/i })[0]).toHaveAttribute("href", "/products");
  });

  it("opens desktop apps launcher links", () => {
    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /open apps launcher/i }));

    expect(screen.getByRole("link", { name: /open full apps hub/i })).toHaveAttribute("href", "/apps");
    const launchLinks = screen.getAllByRole("link", { name: /docheng/i });
    expect(launchLinks.length).toBeGreaterThan(1);
  });

  it("opens grouped dropdown links", () => {
    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /toggle platform menu/i }));

    const desktopPlatformGroup = document.getElementById("desktop-nav-group-platform");
    expect(desktopPlatformGroup).not.toBeNull();
    const groupQueries = within(desktopPlatformGroup as HTMLElement);

    expect(groupQueries.getByRole("link", { name: /downloads/i })).toHaveAttribute("href", "/downloads");
    expect(groupQueries.getByRole("link", { name: /pricing/i })).toHaveAttribute("href", "/pricing");
    expect(groupQueries.getByRole("link", { name: /account/i })).toHaveAttribute("href", "/account");
    expect(groupQueries.getByRole("link", { name: /changelog/i })).toHaveAttribute("href", "/changelog");
    expect(groupQueries.getByRole("link", { name: /support/i })).toHaveAttribute("href", "/support");
  });

  it("renders mobile menu toggle button", () => {
    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    );

    expect(screen.getByRole("button", { name: /toggle navigation menu/i })).toBeInTheDocument();
  });

  it("shows account link for authenticated session", async () => {
    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        state: "authenticated",
        user: {
          id: "user-admin@example.com",
          name: "Admin",
          email: "admin@example.com",
          role: "admin"
        },
        entitlements: []
      })
    );

    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByRole("link", { name: /^account$/i })[0]).toHaveAttribute("href", "/account");
    });
  });
});
