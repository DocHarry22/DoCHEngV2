import { ImageResponse } from "next/og";
export const alt = "DoCHEng — Driven by Curiosity";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#08131c",
        color: "#eef5f6",
        padding: 80,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", fontSize: 30, color: "#66d5bc" }}>
        DoCHEng · Driven by Curiosity
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 88,
          fontWeight: 700,
          letterSpacing: -4,
        }}
      >
        Curiosity, put to work.
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#b5c6d1" }}>
        Engineering · Documents · Careers · Research
      </div>
      <div style={{ display: "flex", fontSize: 20, color: "#66d5bc" }}>
        www.docheng.co.za
      </div>
    </div>,
    size,
  );
}
