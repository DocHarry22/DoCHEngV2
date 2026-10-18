"use client";
import { useState } from "react";
import {
  engineeringTools,
  evaluateTool,
  unitGroups,
  convertUnit,
  type ToolResult,
} from "@/lib/engineering-tools";
import { Card } from "@/components/ui/card";
export function Calculator({ slug }: { slug: string }) {
  const tool = engineeringTools.find((t) => t.slug === slug)!;
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(tool.inputs.map((i) => [i.key, String(i.initial)])),
  );
  const [results, setResults] = useState<ToolResult[]>([]);
  const [error, setError] = useState("");
  return (
    <Card className="space-y-5">
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            const parsed = Object.fromEntries(
              Object.entries(values).map(([k, v]) => {
                if (!v.trim()) throw new Error("Complete all inputs.");
                return [k, Number(v)];
              }),
            );
            setResults(evaluateTool(tool, parsed));
            setError("");
          } catch (error) {
            setResults([]);
            setError(
              error instanceof Error ? error.message : "Check the inputs.",
            );
          }
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {tool.inputs.map((i) => (
            <label className="text-sm" key={i.key}>
              {i.label} ({i.unit})
              <input
                required
                className="field mt-2"
                type="number"
                step="any"
                min={i.min}
                max={i.max}
                value={values[i.key]}
                onChange={(e) => {
                  setValues({ ...values, [i.key]: e.target.value });
                  setResults([]);
                  setError("");
                }}
              />
            </label>
          ))}
        </div>
        <button className="action-button">Calculate</button>
      </form>
      {error ? <p role="alert">{error}</p> : null}
      <div aria-live="polite" className="space-y-3">
        {results.map((r, i) => (
          <div className="result-panel" key={i}>
            <p className="eyebrow">{r.label}</p>
            <p className="mt-2 text-3xl font-semibold">
              {new Intl.NumberFormat("en-ZA", {
                maximumSignificantDigits: 7,
              }).format(r.value)}{" "}
              <span className="text-base">{r.unit}</span>
            </p>
            <p className="mt-2 text-sm">{r.explanation}</p>
          </div>
        ))}
      </div>
      {results.length ? (
        <button
          className="text-link"
          onClick={() => {
            const report = {
              tool: tool.name,
              calculatedAt: new Date().toISOString(),
              inputs: tool.inputs.map((i) => ({
                label: i.label,
                value: values[i.key],
                unit: i.unit,
              })),
              equation: tool.equation,
              assumptions: tool.assumptions,
              results,
              reference: tool.reference,
            };
            const link = document.createElement("a");
            link.href = URL.createObjectURL(
              new Blob([JSON.stringify(report, null, 2)], {
                type: "application/json",
              }),
            );
            link.download = tool.slug + "-calculation.json";
            link.click();
            setTimeout(() => URL.revokeObjectURL(link.href), 1000);
          }}
        >
          Export calculation
        </button>
      ) : null}
    </Card>
  );
}
export function UnitConverter() {
  const [dimension, setDimension] = useState("Length");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("mm");
  const [value, setValue] = useState("1");
  const units = Object.keys(unitGroups[dimension]);
  let result = "",
    error = "";
  try {
    if (value.trim())
      result = new Intl.NumberFormat("en-ZA", {
        maximumSignificantDigits: 10,
      }).format(convertUnit(Number(value), dimension, from, to));
  } catch (e) {
    error = e instanceof Error ? e.message : "Check the value.";
  }
  return (
    <Card className="space-y-5">
      <label className="block text-sm">
        Quantity
        <select
          className="field mt-2"
          value={dimension}
          onChange={(e) => {
            const d = e.target.value;
            setDimension(d);
            const options = Object.keys(unitGroups[d]);
            setFrom(options[0]);
            setTo(options[1]);
          }}
        >
          {Object.keys(unitGroups).map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        Value
        <input
          className="field mt-2"
          type="number"
          step="any"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ["From", from, setFrom],
          ["To", to, setTo],
        ].map(([label, unit, setter]) => (
          <label key={String(label)} className="text-sm">
            {String(label)}
            <select
              className="field mt-2"
              value={String(unit)}
              onChange={(e) => (setter as (v: string) => void)(e.target.value)}
            >
              {units.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <p className="result-panel text-3xl font-semibold" role="status">
        {error || (!value.trim() ? "Enter a value" : result + " " + to)}
      </p>
      <p className="text-sm">
        Units are grouped by physical dimension. Temperature uses an affine
        conversion; pressure values must share the same absolute or gauge
        reference.
      </p>
      <a
        className="text-link"
        href="https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors"
        target="_blank"
        rel="noopener noreferrer"
      >
        NIST conversion references
      </a>
    </Card>
  );
}
