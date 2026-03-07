import { render, screen } from "@testing-library/react";

import PricingPage from "@/app/pricing/page";

describe("PricingPage", () => {
  it("renders the dedicated pricing hero", () => {
    render(<PricingPage />);

    expect(
      screen.getByRole("heading", {
        name: /product-specific pricing built for technical execution at scale./i
      })
    ).toBeInTheDocument();
  });

  it("renders product pricing cards", () => {
    render(<PricingPage />);

    expect(screen.getByRole("heading", { name: /docheng desk/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /docheng resume/i })).toBeInTheDocument();
  });
});
