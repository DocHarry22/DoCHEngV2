import { render, screen } from "@testing-library/react";

import SupportPage from "@/app/support/page";

describe("SupportPage", () => {
  it("renders the support hero", () => {
    render(<SupportPage />);

    expect(
      screen.getByRole("heading", {
        name: /one support layer for product, pricing, access, and technical guidance./i
      })
    ).toBeInTheDocument();
  });

  it("renders support categories and contact form shell", () => {
    render(<SupportPage />);

    expect(screen.getByRole("heading", { name: /product support/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /technical help/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /contact docheng support/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/enquiry type/i)).toBeInTheDocument();
  });
});
