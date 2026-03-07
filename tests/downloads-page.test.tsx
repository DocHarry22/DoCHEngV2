import { fireEvent, render, screen } from "@testing-library/react";

import DownloadsPage from "@/app/downloads/page";

describe("DownloadsPage", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/downloads");
  });

  it("renders the distribution hero", () => {
    render(<DownloadsPage />);

    expect(
      screen.getByRole("heading", {
        name: /download each branch with platform clarity and release-stage confidence./i
      })
    ).toBeInTheDocument();
  });

  it("renders build catalog entries", () => {
    const { container } = render(<DownloadsPage />);

    expect(screen.getAllByRole("heading", { name: /docheng desk/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("heading", { name: /docheng resume/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("heading", { name: /docheng compass/i }).length).toBeGreaterThan(0);

    expect(container.querySelector("#desk")).toBeInTheDocument();
    expect(container.querySelector("#resume")).toBeInTheDocument();
    expect(container.querySelector("#compass")).toBeInTheDocument();
  });

  it("renders interactive distribution controls and product deep links", () => {
    render(<DownloadsPage />);

    expect(screen.getByRole("button", { name: /all statuses/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /desktop/i })).toBeInTheDocument();

    const deskAnchor = screen.getAllByRole("link", { name: /docheng desk/i }).find((link) => link.getAttribute("href") === "#desk");
    expect(deskAnchor).toBeDefined();
  });

  it("applies filters from URL query params", () => {
    window.history.replaceState({}, "", "/downloads?platform=desktop&status=limited");

    render(<DownloadsPage />);

    expect(screen.getByText(/with desktop \/ limited filters./i)).toBeInTheDocument();
  });

  it("syncs query params when controls change", () => {
    render(<DownloadsPage />);

    fireEvent.click(screen.getByRole("button", { name: /android/i }));
    fireEvent.click(screen.getByRole("button", { name: /limited/i }));

    expect(window.location.search).toContain("platform=android");
    expect(window.location.search).toContain("status=limited");
  });
});
