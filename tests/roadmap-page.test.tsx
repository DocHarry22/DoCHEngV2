import { render, screen } from "@testing-library/react";

import RoadmapPage from "@/app/roadmap/page";

describe("RoadmapPage", () => {
  it("renders roadmap hero heading", () => {
    render(<RoadmapPage />);

    expect(screen.getByRole("heading", { name: /strategic roadmap for a growing parent ecosystem./i })).toBeInTheDocument();
  });

  it("renders roadmap phase sections", () => {
    render(<RoadmapPage />);

    expect(screen.getByRole("heading", { name: /foundation/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /expansion/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /ecosystem scale/i })).toBeInTheDocument();
  });
});
