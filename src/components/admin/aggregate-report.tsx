type Row = Record<string, string | number | null>;
export function AggregateReport({ metrics }: { metrics: Row[] }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Marketplace activity</h2>
      <p className="text-sm">
        Approximate first-party page views, grouped by date, route and broad
        referral campaign. No visitor identifiers or unique-visitor claims.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            Aggregate marketplace page views
          </caption>
          <thead>
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Route</th>
              <th className="p-2">Campaign</th>
              <th className="p-2">Views</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((row, index) => (
              <tr key={index}>
                <td className="p-2">{row.day}</td>
                <td className="p-2">{row.path}</td>
                <td className="p-2">{row.campaign}</td>
                <td className="p-2">{row.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!metrics.length ? <p>No page-view counts have been recorded.</p> : null}
    </section>
  );
}
