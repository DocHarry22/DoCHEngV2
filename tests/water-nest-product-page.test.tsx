import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { baseCatalogue } from "@/lib/catalogue";
vi.mock("@/lib/server/catalogue", () => ({ publishedCatalogue: () => baseCatalogue }));
import Product from "@/app/products/[slug]/page";

describe("Water Nest product information", () => {
  it("shows dated catalogue prices and preserves the out-of-stock item", async () => {
    const { container } = render(await Product({ params: Promise.resolve({ slug: "water-nest" }) }));
    expect(screen.getByRole("heading", { name: "Water Nest", level: 1 })).toBeInTheDocument();
    const table = screen.getByRole("table", { name: "Catalogue examples — 23 October 2026" });
    for (const [name, price, stock] of [
      ["Melted Spray Sediment Filters", "R50", "In stock"],
      ["T33 Taste and Odour Filter", "R85", "In stock"],
      ['Sediment Filter 10" x 4.5" – 1 Micron', "R120", "In stock"],
      ["Inline Alkaline Filter", "R395", "In stock"],
      ["Melted Spray Antibacterial Filters", "R115", "Out of stock"],
    ]) {
      const row = within(table).getByRole("row", { name: new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) });
      expect(within(row).getAllByRole("cell").map((cell) => cell.textContent)).toEqual([price, stock]);
    }
    const schema = JSON.parse(container.querySelector('script[type="application/ld+json"]')!.textContent!);
    expect(schema["@type"]).toBe("WebPage");
    expect(schema.about).toMatchObject({ "@type": "WebSite", url: "https://waternest.co.za/" });
    expect(schema).not.toHaveProperty("offers");
    expect(schema).not.toHaveProperty("aggregateRating");
    expect(container.innerHTML).not.toMatch(/WaterNestOps|github\.com|Bearer|chatgpt\.site/);
  });

  it("links to the store and service request and labels the retained screenshot accurately", async () => {
    const user = userEvent.setup();
    render(await Product({ params: Promise.resolve({ slug: "water-nest" }) }));
    expect(screen.getByRole("link", { name: "Shop Water Nest" })).toHaveAttribute("href", "https://waternest.co.za/shop");
    expect(screen.getByRole("link", { name: "Request a service →" })).toHaveAttribute("href", "https://waternest.co.za/services/book");
    expect(screen.getByRole("link", { name: "Request a custom quote →" })).toHaveAttribute("href", "https://waternest.co.za/quote");
    expect(screen.getByRole("img", { name: /Water Nest’s public homepage, captured on 18 October/ })).toHaveAttribute("src", "/screenshots/water-nest.png");
    await user.click(screen.getByText("Can I request installation without buying equipment?"));
    expect(screen.getByText(/Water Nest confirms the scope and supplies a written quotation/)).toBeVisible();
    expect(screen.getByText(/No order, booking or payment was submitted/)).toBeInTheDocument();
  });
});
