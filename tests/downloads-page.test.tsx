import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { baseCatalogue } from "@/lib/catalogue";
import { publishedCatalogue } from "@/lib/server/catalogue";
vi.mock("@/lib/server/catalogue", () => ({
  publishedCatalogue: vi.fn(() => baseCatalogue),
}));
import Downloads from "@/app/downloads/page";
it("withdraws unverifiable installers and preserves product anchors", () => {
  const { container } = render(<Downloads />);
  expect(
    screen.getByRole("heading", {
      name: "Core DoCHEng installers are not yet verified",
    }),
  ).toBeInTheDocument();
  for (const slug of ["desk", "resume", "compass"])
    expect(container.querySelector("#" + slug)).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Download for Android (APK)" }),
  ).toHaveAttribute(
    "href",
    "https://github.com/DocHarry22/apologiasancta-ui/releases/download/android-v1.0.3/apologia-sancta.apk",
  );
  expect(
    screen.queryByRole("link", { name: "Download for Windows" }),
  ).not.toBeInTheDocument();
  expect(screen.queryByText(/v2\.4\.1/)).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Open DoCHEng Desk website" })).toHaveAttribute(
    "href", "https://docheng-desk2.vercel.app/login",
  );
});

it("does not expose retained website evidence when a product returns to planned status", () => {
  vi.mocked(publishedCatalogue).mockReturnValueOnce([
    { ...baseCatalogue[0], status: "planned", releases: [] },
  ]);
  render(<Downloads />);
  expect(screen.queryByRole("link", { name: "Open DoCHEng Desk website" })).not.toBeInTheDocument();
});
