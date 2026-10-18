import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { baseCatalogue } from "@/lib/catalogue";
vi.mock("@/lib/server/catalogue", () => ({
  publishedCatalogue: () => baseCatalogue,
}));
import Apps from "@/app/apps/page";
describe("published app marketplace", () => {
  beforeEach(() => history.replaceState(null, "", "/apps"));
  it("renders the real catalogue and no internal workspaces", () => {
    render(<Apps />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "way of working",
    );
    expect(
      screen.getByRole("link", { name: "DoCHEng Desk" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        /Labs Runtime|Current Path|Migration Layer|workspace-project/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "Open Beta" })[0],
    ).toHaveAttribute("href", "https://docheng-desk2.vercel.app/login");
  });
  it("searches, filters, resets and compares actual products", async () => {
    const user = userEvent.setup();
    render(<Apps />);
    await user.type(
      screen.getByRole("searchbox", { name: "Search apps" }),
      "resume",
    );
    expect(screen.getByRole("status")).toHaveTextContent("1 applications");
    expect(
      screen.queryByRole("link", { name: "DoCHEng Desk" }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Reset filters" }));
    await user.selectOptions(
      screen.getByLabelText("Release status"),
      "coming-soon",
    );
    expect(
      screen.getByRole("link", { name: "DoCHEng Compass" }),
    ).toBeInTheDocument();
    expect(location.search).toContain("status=coming-soon");
    await user.click(screen.getByRole("button", { name: "Reset filters" }));
    await user.click(
      screen.getByRole("checkbox", { name: "Compare DoCHEng Desk" }),
    );
    expect(screen.getByRole("table")).toHaveTextContent("DoCHEng Desk");
  });
  it("does not invent free offers for unconfirmed prices", async () => {
    const user = userEvent.setup();
    render(<Apps />);
    await user.selectOptions(screen.getByLabelText("Pricing"), "free");
    expect(screen.getByText(/No apps match/)).toBeInTheDocument();
  });
});
