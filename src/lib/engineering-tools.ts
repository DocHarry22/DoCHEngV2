export type ToolInput = {
  key: string;
  label: string;
  unit: string;
  initial: number;
  min: number;
  max?: number;
  exclusiveMin?: boolean;
};
export type ToolResult = {
  label: string;
  value: number;
  unit: string;
  explanation: string;
};
export type EngineeringTool = {
  slug: string;
  name: string;
  summary: string;
  inputs: ToolInput[];
  equation: string;
  assumptions: string;
  reference: { label: string; url: string };
  calculate: (v: Record<string, number>) => ToolResult[];
};
const g = 9.80665;
const nist = {
  label: "NIST Guide to the SI — conversion factors",
  url: "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors",
};
const doe = {
  label: "U.S. Department of Energy — Fluid flow fundamentals",
  url: "https://www.energy.gov/ehss/articles/doe-hdbk-10123-92",
};
const epa = {
  label: "U.S. EPA — EPANET hydraulic modelling",
  url: "https://www.epa.gov/water-research/epanet",
};
const water = {
  label: "U.S. EPA — wastewater process control manual",
  url: "https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=9100NX8X.txt",
};
const positive = (
  key: string,
  label: string,
  unit: string,
  initial: number,
): ToolInput => ({ key, label, unit, initial, min: 0, exclusiveMin: true });
const nonnegative = (
  key: string,
  label: string,
  unit: string,
  initial: number,
): ToolInput => ({ key, label, unit, initial, min: 0 });
const flow = () => positive("flow", "Flow rate", "m³/h", 100),
  density = () => positive("density", "Fluid density", "kg/m³", 1000);
export const engineeringTools: EngineeringTool[] = [
  {
    slug: "chemical-dilution",
    name: "Chemical dilution",
    summary: "Estimate stock and diluent volumes for an ideal dilution.",
    inputs: [
      positive("stock", "Stock concentration", "mg/L", 1000),
      nonnegative("target", "Target concentration", "mg/L", 100),
      positive("volume", "Final solution volume", "L", 10),
    ],
    equation: "C₁V₁ = C₂V₂; Vstock = Ctarget × Vfinal / Cstock",
    assumptions:
      "Same solute and concentration basis. Volumes are assumed additive; density change, heat of mixing, chemical compatibility and safe handling are excluded. This is a mass-balance estimate, not a mixing procedure.",
    reference: nist,
    calculate: (v) => {
      if (v.target > v.stock)
        throw new Error(
          "Target concentration cannot exceed stock concentration in a dilution.",
        );
      const stock = (v.target * v.volume) / v.stock;
      return [
        {
          label: "Stock volume",
          value: stock,
          unit: "L",
          explanation: "Ideal stock volume in the final total volume.",
        },
        {
          label: "Diluent volume",
          value: v.volume - stock,
          unit: "L",
          explanation:
            "Assumes additive volumes; verify solution properties independently.",
        },
      ];
    },
  },
  {
    slug: "chemical-dosing",
    name: "Chemical dosing",
    summary:
      "Convert a specified process dose into mass and stock solution flow.",
    inputs: [
      flow(),
      nonnegative("dose", "Specified dose", "mg/L", 5),
      positive("stock", "Stock concentration of active chemical", "g/L", 100),
    ],
    equation: "ṁ = Q × C / 1000 [kg/h]; Qstock = Q × C / Cstock [L/h]",
    assumptions:
      "Steady flow; concentration refers to active chemical. Does not select a safe or effective dose, account for reactions, or size a dosing system.",
    reference: water,
    calculate: (v) => [
      {
        label: "Active chemical mass flow",
        value: (v.flow * v.dose) / 1000,
        unit: "kg/h",
        explanation: "The specified dose multiplied by the water flow.",
      },
      {
        label: "Stock solution flow",
        value: (v.flow * v.dose) / v.stock,
        unit: "L/h",
        explanation:
          "Uses stock active concentration in g/L, not solution mass percent.",
      },
    ],
  },
  {
    slug: "pump-power",
    name: "Pump power",
    summary:
      "Estimate shaft power from flow, head, density and pump efficiency.",
    inputs: [
      flow(),
      nonnegative("head", "Total pump head", "m", 20),
      density(),
      { ...positive("efficiency", "Pump efficiency", "%", 75), max: 100 },
    ],
    equation: "Pshaft = ρ g Q H / η; QSI = Q / 3600; η = efficiency / 100",
    assumptions:
      "Steady incompressible flow. Pump efficiency excludes motor/drive losses. Head must already represent the required total pump head. g = 9.80665 m/s².",
    reference: doe,
    calculate: (v) => [
      {
        label: "Estimated shaft power",
        value:
          (v.density * g * (v.flow / 3600) * v.head) /
          (v.efficiency / 100) /
          1000,
        unit: "kW",
        explanation:
          "Mechanical power at the shaft; electrical input requires motor and drive efficiencies.",
      },
    ],
  },
  {
    slug: "pump-head",
    name: "Pump head",
    summary: "Convert a pressure rise into equivalent fluid head.",
    inputs: [nonnegative("pressure", "Pressure rise", "kPa", 200), density()],
    equation: "Hpressure = Δp / (ρg); ΔpSI = Δp × 1000",
    assumptions:
      "Pressure head only, for an incompressible fluid. Total pump head may also require elevation and velocity-head differences. System friction, NPSH and pump curves are not evaluated.",
    reference: doe,
    calculate: (v) => [
      {
        label: "Equivalent pressure head",
        value: (v.pressure * 1000) / (v.density * g),
        unit: "m",
        explanation:
          "Metres of the specified fluid corresponding to this pressure difference.",
      },
    ],
  },
  {
    slug: "pipe-velocity",
    name: "Pipe velocity",
    summary: "Find average flow velocity in a full circular pipe.",
    inputs: [flow(), positive("diameter", "Internal pipe diameter", "mm", 100)],
    equation: "v = Q / A; A = πD²/4; QSI = Q/3600; DSI = D/1000",
    assumptions:
      "Full circular pipe, steady flow and internal diameter. Does not establish acceptable velocity, water hammer, pipe strength or erosion limits.",
    reference: doe,
    calculate: (v) => [
      {
        label: "Average velocity",
        value: v.flow / 3600 / ((Math.PI * (v.diameter / 1000) ** 2) / 4),
        unit: "m/s",
        explanation: "Cross-section average, not local peak velocity.",
      },
    ],
  },
  {
    slug: "pipe-pressure-drop",
    name: "Pipe pressure drop",
    summary:
      "Estimate major friction loss using a supplied Darcy friction factor.",
    inputs: [
      flow(),
      positive("diameter", "Internal pipe diameter", "mm", 100),
      nonnegative("length", "Straight pipe length", "m", 100),
      positive("factor", "Darcy friction factor", "dimensionless", 0.02),
      density(),
    ],
    equation: "Δp = fD (L/D) ρv²/2; v = (Q/3600) / [π(D/1000)²/4]",
    assumptions:
      "Darcy factor, not Fanning factor. User supplies a factor appropriate to Reynolds number and relative roughness. Full circular pipe, steady incompressible flow. Fittings, elevation, transients and entrance losses are excluded.",
    reference: epa,
    calculate: (v) => {
      const d = v.diameter / 1000;
      const velocity = v.flow / 3600 / ((Math.PI * d * d) / 4);
      return [
        {
          label: "Major friction pressure loss",
          value:
            (v.factor * (v.length / d) * v.density * velocity ** 2) / 2 / 1000,
          unit: "kPa",
          explanation:
            "Straight-pipe major loss only; minor losses must be added separately.",
        },
      ];
    },
  },
  {
    slug: "tank-volume",
    name: "Tank volume",
    summary: "Calculate the working volume of an upright circular cylinder.",
    inputs: [
      positive("diameter", "Internal tank diameter", "m", 3),
      nonnegative("height", "Liquid depth", "m", 4),
    ],
    equation: "V = πD²h/4",
    assumptions:
      "Upright cylindrical tank with a flat base. Use internal diameter and liquid depth. Excludes dished ends, internals, freeboard and structural design.",
    reference: nist,
    calculate: (v) => [
      {
        label: "Liquid volume",
        value: (Math.PI * v.diameter ** 2 * v.height) / 4,
        unit: "m³",
        explanation: "Geometric volume at the entered liquid depth.",
      },
      {
        label: "Liquid volume",
        value: ((Math.PI * v.diameter ** 2 * v.height) / 4) * 1000,
        unit: "L",
        explanation: "1 m³ = 1000 L.",
      },
    ],
  },
  {
    slug: "ro-recovery",
    name: "RO recovery",
    summary: "Calculate the water recovery ratio from feed and permeate flows.",
    inputs: [
      positive("feed", "Feed flow", "m³/h", 100),
      nonnegative("permeate", "Permeate flow", "m³/h", 75),
    ],
    equation:
      "Recovery = 100 Qpermeate/Qfeed; Qconcentrate = Qfeed − Qpermeate",
    assumptions:
      "Steady volumetric balance with no other flow outlets or recycles. Does not predict membrane rejection, scaling, pressure requirements, quality or allowable recovery.",
    reference: nist,
    calculate: (v) => {
      if (v.permeate > v.feed)
        throw new Error(
          "Permeate cannot exceed feed for this single-pass balance.",
        );
      return [
        {
          label: "Water recovery",
          value: (100 * v.permeate) / v.feed,
          unit: "%",
          explanation: "Fraction of feed leaving as permeate.",
        },
        {
          label: "Concentrate flow",
          value: v.feed - v.permeate,
          unit: "m³/h",
          explanation: "Feed minus permeate under the stated steady balance.",
        },
      ];
    },
  },
  {
    slug: "chlorine-dosing",
    name: "Chlorine mass balance",
    summary:
      "Convert an independently specified active chlorine dose to mass flow.",
    inputs: [
      flow(),
      nonnegative(
        "dose",
        "Independently specified active dose",
        "mg/L as Cl₂",
        2,
      ),
    ],
    equation: "ṁCl₂ [kg/h] = Q [m³/h] × dose [mg/L] / 1000",
    assumptions:
      "Arithmetic mass flow only. Does not prescribe a dose or verify disinfection, residual, demand, contact time, pH, by-products or safe handling. It is not a drinking-water safety assessment.",
    reference: water,
    calculate: (v) => [
      {
        label: "Active chlorine mass flow",
        value: (v.flow * v.dose) / 1000,
        unit: "kg/h as Cl₂",
        explanation:
          "Specified active dose only; not a recommendation for chlorine use or product strength.",
      },
    ],
  },
  {
    slug: "hydraulic-retention-time",
    name: "Hydraulic retention time",
    summary: "Calculate nominal residence time from working volume and flow.",
    inputs: [positive("volume", "Working liquid volume", "m³", 250), flow()],
    equation: "θ = V/Q",
    assumptions:
      "Nominal steady volumetric residence time. Excludes short-circuiting, dead zones, recycle and residence-time distributions; it is not effective disinfection contact time.",
    reference: water,
    calculate: (v) => [
      {
        label: "Nominal retention time",
        value: v.volume / v.flow,
        unit: "h",
        explanation: "Working liquid volume divided by volumetric throughput.",
      },
    ],
  },
  {
    slug: "wastewater-loading",
    name: "Wastewater loading",
    summary:
      "Convert concentration and daily flow into mass and volumetric loads.",
    inputs: [
      positive("flow", "Daily flow", "m³/day", 1000),
      nonnegative(
        "concentration",
        "Specified pollutant concentration",
        "mg/L",
        250,
      ),
      positive("volume", "Reactor working volume", "m³", 500),
    ],
    equation: "Load = Q × C / 1000 [kg/day]; volumetric load = Load / V",
    assumptions:
      "Steady average flow and a representative concentration of a specified pollutant. Does not establish treatment capacity, removal performance, sludge age or discharge compliance.",
    reference: water,
    calculate: (v) => [
      {
        label: "Influent mass load",
        value: (v.flow * v.concentration) / 1000,
        unit: "kg/day",
        explanation: "Mass entering each day for the specified constituent.",
      },
      {
        label: "Volumetric loading",
        value: (v.flow * v.concentration) / 1000 / v.volume,
        unit: "kg/(m³·day)",
        explanation: "Influent load per unit reactor working volume.",
      },
    ],
  },
];
export function evaluateTool(
  tool: EngineeringTool,
  values: Record<string, number>,
) {
  for (const input of tool.inputs) {
    const v = values[input.key];
    if (
      !Number.isFinite(v) ||
      v < input.min ||
      (input.exclusiveMin && v === input.min) ||
      (input.max !== undefined && v > input.max)
    )
      throw new Error("Check " + input.label + " and its units.");
  }
  const results = tool.calculate(values);
  if (results.some((r) => !Number.isFinite(r.value)))
    throw new Error("The inputs exceed the supported numerical range.");
  return results;
}
export const unitGroups: Record<
  string,
  Record<string, { factor: number; offset?: number }>
> = {
  Length: {
    m: { factor: 1 },
    mm: { factor: 0.001 },
    km: { factor: 1000 },
    ft: { factor: 0.3048 },
    in: { factor: 0.0254 },
  },
  Pressure: {
    Pa: { factor: 1 },
    kPa: { factor: 1000 },
    MPa: { factor: 1e6 },
    bar: { factor: 1e5 },
    psi: { factor: 6894.757293168 },
  },
  Volume: { "m³": { factor: 1 }, L: { factor: 0.001 }, mL: { factor: 1e-6 } },
  Flow: {
    "m³/h": { factor: 1 / 3600 },
    "L/s": { factor: 0.001 },
    "L/min": { factor: 0.001 / 60 },
    "m³/day": { factor: 1 / 86400 },
  },
  Mass: {
    kg: { factor: 1 },
    g: { factor: 0.001 },
    mg: { factor: 1e-6 },
    lb: { factor: 0.45359237 },
  },
  Temperature: {
    K: { factor: 1 },
    "°C": { factor: 1, offset: 273.15 },
    "°F": { factor: 5 / 9, offset: 255.3722222222222 },
  },
};
export function convertUnit(
  value: number,
  dimension: string,
  from: string,
  to: string,
) {
  const source = unitGroups[dimension]?.[from],
    target = unitGroups[dimension]?.[to];
  if (!Number.isFinite(value) || !source || !target)
    throw new Error("Select compatible units and enter a finite value.");
  const si = value * source.factor + (source.offset ?? 0);
  if (dimension === "Temperature" && si < 0)
    throw new Error("Temperature cannot be below absolute zero.");
  const result = (si - (target.offset ?? 0)) / target.factor;
  if (!Number.isFinite(result))
    throw new Error("Value exceeds the supported numerical range.");
  return result;
}
