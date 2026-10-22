import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { baseCatalogue } from "@/lib/catalogue";
vi.mock("@/lib/server/catalogue", () => ({ publishedCatalogue: () => baseCatalogue }));
import Product from "@/app/products/[slug]/page";

describe("Paperplane product information", () => {
  it("shows draft prices without offering checkout or exposing the private workspace", async () => {
    const { container } = render(await Product({ params: Promise.resolve({ slug: "paperplane" }) }));
    expect(screen.getByRole("heading", { name: "Paperplane", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Request early access" })).toHaveAttribute("href", "/support?product=paperplane#contact-form");
    expect(container).toHaveTextContent("Invitation-only engineering preview");
    expect(container).toHaveTextContent("Paid checkout is disabled");
    const table = screen.getByRole("table", { name: "Paperplane plans — draft prices, checkout coming soon" });
    const pro = within(table).getByRole("row", { name: /^Pro/ });
    expect(within(pro).getAllByRole("cell").map((cell) => cell.textContent)).toEqual(["R99", "R990", "$9", "$90"]);
    const business = within(table).getByRole("row", { name: /^Business/ });
    expect(within(business).getAllByRole("cell").map((cell) => cell.textContent)).toEqual(["R249", "R2,490", "$24", "$240"]);
    expect(container).toHaveTextContent("Business has no shared team seats");
    const schema = JSON.parse(container.querySelector('script[type="application/ld+json"]')!.textContent!);
    expect(schema).not.toHaveProperty("offers");
    expect(container.innerHTML).not.toMatch(/chatgpt\.site|hostingersite\.com|github\.com|Bearer/);
    expect(screen.queryByRole("link", { name: /buy|checkout/i })).not.toBeInTheDocument();
  });

  it("browses real app screenshots and explains local processing", async () => {
    const user = userEvent.setup();
    render(await Product({ params: Promise.resolve({ slug: "paperplane" }) }));
    expect(screen.getByRole("img", { name: /Paperplane PDF editor with a fictional/ })).toHaveAttribute("src", "/screenshots/paperplane-editor.png");
    await user.click(screen.getByRole("button", { name: "Next screenshot" }));
    expect(screen.getByRole("img", { name: /Organize a fictional three-page/ })).toHaveAttribute("src", "/screenshots/paperplane-organize.png");
    expect(screen.getByRole("heading", { name: "Make scans searchable" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Save a repeatable routine" })).toBeInTheDocument();
    await user.click(screen.getByText("Where do my files go?"));
    expect(screen.getByText(/Tools that use the processing service upload the files you choose/)).toBeVisible();
  });
});
