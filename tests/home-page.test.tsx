import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { baseCatalogue } from "@/lib/catalogue";
vi.mock("@/lib/server/catalogue", () => ({
  publishedCatalogue: () => baseCatalogue,
}));
import Home from "@/app/page";
it("preserves the brand tree and connects real applications and engineering tools", () => {
  render(<Home />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Curiosity",
  );
  expect(screen.getByText("The engineering tree")).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /Explore all 12 tools/ }),
  ).toHaveAttribute("href", "/tools");
  expect(
    screen.queryByText("future-product.docheng.co.za"),
  ).not.toBeInTheDocument();
  expect(
    screen.getByText(/Paid checkout is not activated/),
  ).toBeInTheDocument();
  for (const product of baseCatalogue.filter((p) => p.launch)) {
    expect(screen.getAllByRole("link").some((link) => link.getAttribute("href") === product.launch!.url)).toBe(true);
  }
  expect(screen.getByRole("link", { name: "Download for Android (APK)" })).toHaveAttribute(
    "href", baseCatalogue.find((p) => p.slug === "apologia-sancta")!.releases[0].externalUrl,
  );
});
