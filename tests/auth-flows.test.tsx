import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, afterEach } from "vitest";
import { AuthFormCard } from "@/components/auth/auth-form-card";
import { AuthProvider } from "@/components/auth/auth-provider";
const push = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
const guest = { state: "guest", user: null, entitlements: [] };
beforeEach(() => {
  push.mockReset();
  localStorage.clear();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(guest), {
        headers: { "Content-Type": "application/json" },
      }),
    ),
  );
});
afterEach(() => vi.unstubAllGlobals());
describe("server-backed account UI", () => {
  it("ignores a forged localStorage admin session", async () => {
    localStorage.setItem(
      "dochengv2.session.v1",
      JSON.stringify({
        state: "authenticated",
        user: { role: "admin" },
        entitlements: [{ productSlug: "resume", state: "active" }],
      }),
    );
    render(
      <AuthProvider>
        <AuthFormCard mode="signin" />
      </AuthProvider>,
    );
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /sign in/i })).toBeEnabled(),
    );
    expect(localStorage.getItem("dochengv2.session.v1")).toBeNull();
    expect(push).not.toHaveBeenCalled();
  });
  it("redirects only after server success and keeps secrets out of browser storage", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string) =>
        Promise.resolve(
          Response.json(
            url.endsWith("/session")
              ? guest
              : {
                  ok: true,
                  session: {
                    state: "authenticated",
                    user: {
                      id: "u",
                      name: "Member",
                      email: "member@example.com",
                      role: "user",
                    },
                    entitlements: [],
                  },
                },
          ),
        ),
      ),
    );
    render(
      <AuthProvider>
        <AuthFormCard mode="signin" nextHref="/account" />
      </AuthProvider>,
    );
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /sign in/i })).toBeEnabled(),
    );
    await user.type(screen.getByLabelText("Email"), "member@example.com");
    await user.type(
      screen.getByLabelText("Password"),
      "correct horse battery staple",
    );
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => expect(push).toHaveBeenCalledWith("/account"));
    expect(localStorage.length).toBe(0);
    expect(document.cookie).not.toContain("docheng-session");
  });
  it("shows server rejection and never redirects on a failed password", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockImplementation((url: string) =>
          Promise.resolve(
            Response.json(
              url.endsWith("/session")
                ? guest
                : { ok: false, message: "Email or password is incorrect." },
              { status: url.endsWith("/session") ? 200 : 401 },
            ),
          ),
        ),
    );
    render(
      <AuthProvider>
        <AuthFormCard mode="signin" />
      </AuthProvider>,
    );
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /sign in/i })).toBeEnabled(),
    );
    await user.type(screen.getByLabelText("Email"), "member@example.com");
    await user.type(
      screen.getByLabelText("Password"),
      "wrong password is long",
    );
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("incorrect");
    expect(push).not.toHaveBeenCalled();
  });
});
