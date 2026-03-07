import { render, screen } from "@testing-library/react";

import DocsPage from "@/app/docs/page";

describe("DocsPage", () => {
  it("renders the documentation hero", () => {
    render(<DocsPage />);

    expect(
      screen.getByRole("heading", {
        name: /structured guides for product, setup, access, and support workflows./i
      })
    ).toBeInTheDocument();
  });

  it("renders category and article cards", () => {
    render(<DocsPage />);

    expect(screen.getByRole("heading", { name: /getting started/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /technical setup/i })).toBeInTheDocument();
    expect(screen.getByText(/docheng ecosystem quickstart/i)).toBeInTheDocument();
  });

  it("renders release-linked guidance cards", () => {
    render(<DocsPage />);

    expect(screen.getByRole("heading", { name: /guides that explain release impact and next actions./i })).toBeInTheDocument();
    expect(screen.getAllByText(/post-update validation checklist/i).length).toBeGreaterThan(0);
  });
});
