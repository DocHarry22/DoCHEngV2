import "@testing-library/jest-dom/vitest";

import React from "react";
import { vi } from "vitest";

vi.mock("next/image", () => ({
	default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean; fill?: boolean }) => {
		const { priority: _priority, fill: _fill, ...domProps } = props;
		return React.createElement("img", { ...domProps, alt: props.alt ?? "" });
	}
}));
