import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { ThemeToggle } from "@/components/theme/theme-toggle";

const setThemeMock = vi.fn();

vi.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: "light",
    setTheme: setThemeMock
  })
}));

describe("ThemeToggle", () => {
  it("calls setTheme with dark when clicked from light mode", async () => {
    const user = userEvent.setup();

    render(<ThemeToggle />);

    await user.click(screen.getByRole("button", { name: /toggle color mode/i }));

    expect(setThemeMock).toHaveBeenCalledWith("dark");
  });
});
