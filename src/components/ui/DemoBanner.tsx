/**
 * Global honesty banner. While the site runs on illustrative data, every
 * visitor is told up front — demo values are never dressed up as real (§53).
 */
export function DemoBanner() {
  return (
    <div className="bg-brand text-on-brand">
      <p className="mx-auto max-w-6xl px-4 py-1.5 text-center text-xs sm:px-6">
        <span className="font-semibold">Design preview</span>
        <span className="opacity-90">
          {" "}
          — companies, prices, and financials shown here are fictional sample
          data, not investment advice.
        </span>
      </p>
    </div>
  );
}
