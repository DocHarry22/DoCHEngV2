import { render, screen } from "@testing-library/react";

import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders the main value proposition", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        name: /one root platform. multiple app branches. more growth ahead./i
      })
    ).toBeInTheDocument();
  });
});
