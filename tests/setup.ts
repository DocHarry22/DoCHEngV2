import "@testing-library/jest-dom/vitest";

import React from "react";
import { vi } from "vitest";
vi.mock("server-only", () => ({}));

vi.mock("next/image", () => ({
  default: (
    props: React.ImgHTMLAttributes<HTMLImageElement> & {
      priority?: boolean;
      fill?: boolean;
    },
  ) => {
    const domProps = { ...props };
    delete domProps.priority;
    delete domProps.fill;
    return React.createElement("img", { ...domProps, alt: props.alt ?? "" });
  },
}));
