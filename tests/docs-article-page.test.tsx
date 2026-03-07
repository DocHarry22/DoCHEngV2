import { render, screen } from "@testing-library/react";

import DocArticlePage from "@/app/docs/[slug]/page";

describe("DocArticlePage", () => {
  it("renders article details for a valid slug", async () => {
    const page = await DocArticlePage({ params: Promise.resolve({ slug: "ecosystem-quickstart" }) });

    render(page);

    expect(screen.getByRole("heading", { name: /docheng ecosystem quickstart/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /quick steps/i })).toBeInTheDocument();
    expect(screen.getByText(/step 1/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open changelog/i })).toBeInTheDocument();
  });

  it("renders related release and route metadata for release-linked docs", async () => {
    const page = await DocArticlePage({ params: Promise.resolve({ slug: "release-notes-rollout-impact" }) });

    render(page);

    expect(screen.getByText(/related releases/i)).toBeInTheDocument();
    expect(screen.getByText(/v0.9.0/i)).toBeInTheDocument();
    expect(screen.getByText(/related routes/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /\/changelog/i })).toBeInTheDocument();
  });
});
