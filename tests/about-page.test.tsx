import { render, screen } from "@testing-library/react";

import AboutPage from "@/app/about/page";

describe("AboutPage", () => {
  it("renders the company credibility hero", () => {
    render(<AboutPage />);

    expect(
      screen.getByRole("heading", {
        name: /docheng is a founder-led ecosystem company built for technical execution./i
      })
    ).toBeInTheDocument();
  });

  it("renders mission, philosophy, team, and credibility sections", () => {
    render(<AboutPage />);

    expect(screen.getByRole("heading", { name: /how we make decisions/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /focused, product-led team structure/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /operational proof over marketing claims/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /from platform foundations to ecosystem expansion/i })).toBeInTheDocument();
  });
});
