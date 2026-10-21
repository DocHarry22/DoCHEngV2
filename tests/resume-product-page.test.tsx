import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { baseCatalogue } from "@/lib/catalogue";
vi.mock("@/lib/server/catalogue", () => ({ publishedCatalogue: () => baseCatalogue }));
import Product, { generateMetadata } from "@/app/products/[slug]/page";

describe("CareerForge product information", () => {
  it("separates free live access from planned paid backup prices", async () => {
    const { container } = render(await Product({ params: Promise.resolve({ slug: "resume" }) }));
    expect(screen.getByRole("heading", { name: "CareerForge", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Create my résumé" })).toHaveAttribute("href", "https://resume.docheng.co.za/builder/?new=1");
    const table = screen.getByRole("table", { name: "Cloud-backup plans — preview, coming soon" });
    const plus = within(table).getByRole("row", { name: /^Plus/ });
    expect(within(plus).getAllByRole("cell").map((cell) => cell.textContent)).toEqual(["R19", "R190", "$1.49", "$14.90", "10"]);
    const pro = within(table).getByRole("row", { name: /^Pro/ });
    expect(within(pro).getAllByRole("cell").map((cell) => cell.textContent)).toEqual(["R39", "R390", "$2.99", "$29.90", "50"]);
    expect(container).not.toHaveTextContent(/R399|R79|Career Plus/);
    const schema = JSON.parse(container.querySelector('script[type="application/ld+json"]')!.textContent!);
    expect(schema.offers).toMatchObject({ price: "0", priceCurrency: "ZAR" });
    expect(schema.offers).not.toHaveProperty("url");
    expect(screen.queryByRole("link", { name: /buy|checkout/i })).not.toBeInTheDocument();
  });

  it("shows current app screenshots and lets visitors browse them", async () => {
    const user = userEvent.setup();
    render(await Product({ params: Promise.resolve({ slug: "resume" }) }));
    expect(screen.getByRole("img", { name: /résumé builder: editable sections/ })).toHaveAttribute("src", "/screenshots/resume-builder.png");
    await user.click(screen.getByRole("button", { name: "Next screenshot" }));
    expect(screen.getByRole("img", { name: /Choose from eight résumé layouts/ })).toHaveAttribute("src", "/screenshots/resume-templates.png");
    expect(await generateMetadata({ params: Promise.resolve({ slug: "resume" }) })).toMatchObject({ title: "CareerForge — DoCHEng Resume" });
  });
});
