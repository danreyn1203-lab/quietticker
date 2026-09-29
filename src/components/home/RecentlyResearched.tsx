import { getResearchLog } from "@/lib/researchLog";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ResearchedCard } from "./ResearchedCard";

export async function RecentlyResearched() {
  const log = await getResearchLog();
  const companies = log?.companies ?? [];
  if (companies.length === 0) return null;

  return (
    <section id="research" className="scroll-mt-24">
      <SectionHeading
        eyebrow="Recently researched"
        title="Companies I’ve been digging into"
        description="Every card links to the full write-up — my rating, the evidence, and the risks. “Owns” means I actually hold it."
      />
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <ResearchedCard key={company.ticker + company.dateResearched} company={company} />
        ))}
      </div>
    </section>
  );
}
