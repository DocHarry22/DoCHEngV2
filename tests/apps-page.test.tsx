import { render, screen } from "@testing-library/react";

import AppsPage from "@/app/apps/page";

describe("AppsPage", () => {
  it("renders the apps hub hero", () => {
    render(<AppsPage />);

    expect(
      screen.getByRole("heading", {
        name: /one launch layer for every docheng app branch./i
      })
    ).toBeInTheDocument();
  });

  it("renders core app cards and availability sections", () => {
    render(<AppsPage />);

    expect(screen.getByRole("heading", { name: /core apps/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /ecosystem registry/i })).toBeInTheDocument();
    expect(screen.getByText(/availability matrix/i)).toBeInTheDocument();
    expect(screen.getAllByText(/docheng desk/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/docheng resume/i).length).toBeGreaterThan(0);
  });

  it("renders subdomain launch links", () => {
    render(<AppsPage />);

    const deskLinks = screen.getAllByRole("link", { name: /open subdomain/i });
    expect(deskLinks.length).toBeGreaterThan(0);

    expect(
      deskLinks.some((link) =>
        (link.getAttribute("href") ?? "").includes("desk.docheng.co.za")
      )
    ).toBe(true);
  });
});
