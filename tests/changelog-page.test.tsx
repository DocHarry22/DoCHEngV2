import { render, screen } from "@testing-library/react";

import ChangelogPage from "@/app/changelog/page";

describe("ChangelogPage", () => {
  it("renders the changelog hero", () => {
    render(<ChangelogPage />);

    expect(
      screen.getByRole("heading", {
        name: /transparent changelog for every meaningful docheng ecosystem update./i
      })
    ).toBeInTheDocument();
  });

  it("renders highlighted and recent release sections", () => {
    render(<ChangelogPage />);

    expect(screen.getAllByRole("heading", { name: /structured changelog and release notes layer launched/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: /product-aware release entries with filterable scope and update type./i })).toBeInTheDocument();
  });
});
