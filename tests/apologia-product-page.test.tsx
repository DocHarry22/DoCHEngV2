import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { baseCatalogue } from "@/lib/catalogue";
vi.mock("@/lib/server/catalogue", () => ({ publishedCatalogue: () => baseCatalogue }));
import Product from "@/app/products/[slug]/page";

describe("Apologia Sancta product information", () => {
  it("connects visitors to the actual app, 3D graph and trivia routes", async () => {
    render(await Product({ params: Promise.resolve({ slug: "apologia-sancta" }) }));
    expect(screen.getByRole("heading", { name: "Apologia Sancta", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open Apologia Sancta" })).toHaveAttribute("href", "https://sandybrown-bear-488955.hostingersite.com/");
    expect(screen.getByRole("link", { name: "Explore the 3D Galaxy →" })).toHaveAttribute("href", "https://mediumvioletred-kingfisher-797460.hostingersite.com/graph");
    expect(screen.getByRole("link", { name: "Open live trivia →" })).toHaveAttribute("href", "https://sandybrown-bear-488955.hostingersite.com/mobile/");
    expect(screen.getByRole("link", { name: "View Android download and checksum →" })).toHaveAttribute("href", "/downloads#apologia-sancta");
  });

  it("keeps service limits and editorial status clear without inventing prices", async () => {
    const user = userEvent.setup();
    const { container } = render(await Product({ params: Promise.resolve({ slug: "apologia-sancta" }) }));
    expect(container).toHaveTextContent("265 questions");
    expect(container).toHaveTextContent("No paid plan prices or subscription checkout are published");
    expect(container).toHaveTextContent("No live lessons were published, and solo practice could not load");
    await user.click(screen.getByText("Are the graph’s connection weights truth scores?"));
    expect(screen.getByText(/They help visualize connections; they do not establish/)).toBeVisible();
    const schema = JSON.parse(container.querySelector('script[type="application/ld+json"]')!.textContent!);
    expect(schema).not.toHaveProperty("offers");
    expect(container.innerHTML).not.toMatch(/github\.com\/DocHarry22\/apologia-graph|Bearer|chatgpt\.site/);
    expect(screen.queryByRole("link", { name: /buy|checkout/i })).not.toBeInTheDocument();
  });

  it("browses current 3D and 2D screenshots", async () => {
    const user = userEvent.setup();
    render(await Product({ params: Promise.resolve({ slug: "apologia-sancta" }) }));
    expect(screen.getByRole("img", { name: /The live 3D Galaxy with orbit/ })).toHaveAttribute("src", "/screenshots/apologia-galaxy-3d.png");
    await user.click(screen.getByRole("button", { name: "Next screenshot" }));
    expect(screen.getByRole("img", { name: /The same curated argument map in 2D/ })).toHaveAttribute("src", "/screenshots/apologia-galaxy-2d.png");
    expect(screen.getByText("2 / 7")).toBeInTheDocument();
  });
});
