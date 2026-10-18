import {
  engineeringTools,
  evaluateTool,
  convertUnit,
} from "@/lib/engineering-tools";
const calculate = (slug: string, v: Record<string, number>) =>
  evaluateTool(
    engineeringTools.find((t) => t.slug === slug)!,
    v,
  );
describe("independent engineering reference cases", () => {
  it("converts dimensions and affine temperatures", () => {
    expect(convertUnit(1, "Length", "ft", "m")).toBe(0.3048);
    expect(convertUnit(1, "Pressure", "bar", "kPa")).toBe(100);
    expect(convertUnit(1, "Flow", "L/s", "m³/h")).toBeCloseTo(3.6);
    expect(convertUnit(32, "Temperature", "°F", "°C")).toBeCloseTo(0);
    expect(convertUnit(100, "Temperature", "°C", "°F")).toBeCloseTo(212);
    expect(() => convertUnit(1, "Length", "m", "kg")).toThrow();
    expect(() => convertUnit(-274, "Temperature", "°C", "K")).toThrow();
  });
  it("checks dilution conservation with a hand-worked 1:10 case", () => {
    const r = calculate("chemical-dilution", {
      stock: 1000,
      target: 100,
      volume: 10,
    });
    expect(r[0].value).toBe(1);
    expect(r[1].value).toBe(9);
    expect(() =>
      calculate("chemical-dilution", { stock: 100, target: 200, volume: 10 }),
    ).toThrow();
  });
  it("checks dosing dimensions independently", () => {
    const r = calculate("chemical-dosing", { flow: 100, dose: 5, stock: 100 });
    expect(r[0].value).toBe(0.5);
    expect(r[1].value).toBe(5);
    expect(calculate("chlorine-dosing", { flow: 100, dose: 2 })[0].value).toBe(
      0.2,
    );
  });
  it("checks pump shaft power for 1 L/s at 10 m and 50% efficiency", () => {
    expect(
      calculate("pump-power", {
        flow: 3.6,
        head: 10,
        density: 1000,
        efficiency: 50,
      })[0].value,
    ).toBeCloseTo(0.196133, 6);
    expect(
      calculate("pump-head", { pressure: 98.0665, density: 1000 })[0].value,
    ).toBeCloseTo(10, 8);
  });
  it("checks pipe area and Darcy loss for a 1 m/s case", () => {
    const q = ((Math.PI * 0.1 ** 2) / 4) * 3600;
    expect(
      calculate("pipe-velocity", { flow: q, diameter: 100 })[0].value,
    ).toBeCloseTo(1, 8);
    expect(
      calculate("pipe-pressure-drop", {
        flow: q,
        diameter: 100,
        length: 100,
        factor: 0.02,
        density: 1000,
      })[0].value,
    ).toBeCloseTo(10, 8);
  });
  it("checks tank geometry, recovery and nominal residence time", () => {
    expect(
      calculate("tank-volume", { diameter: 2, height: 3 })[0].value,
    ).toBeCloseTo(3 * Math.PI, 8);
    expect(
      calculate("ro-recovery", { feed: 100, permeate: 75 }).map((r) => r.value),
    ).toEqual([75, 25]);
    expect(() =>
      calculate("ro-recovery", { feed: 100, permeate: 101 }),
    ).toThrow();
    expect(
      calculate("hydraulic-retention-time", { volume: 250, flow: 100 })[0]
        .value,
    ).toBe(2.5);
  });
  it("checks pollutant mass loading and rejects nonphysical values", () => {
    expect(
      calculate("wastewater-loading", {
        flow: 1000,
        concentration: 250,
        volume: 500,
      }).map((r) => r.value),
    ).toEqual([250, 0.5]);
    expect(() =>
      calculate("pump-power", {
        flow: 100,
        head: 20,
        density: 1000,
        efficiency: 0,
      }),
    ).toThrow();
    expect(() =>
      calculate("pipe-velocity", { flow: 100, diameter: 0 }),
    ).toThrow();
    expect(() =>
      calculate("tank-volume", { diameter: Infinity, height: 1 }),
    ).toThrow();
  });
});
