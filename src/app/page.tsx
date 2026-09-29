import { Container } from "@/components/layout/Container";
import { Hero } from "@/components/home/Hero";
import { OpenTrackRecord } from "@/components/home/OpenTrackRecord";
import { FeaturedSpotlight } from "@/components/home/FeaturedSpotlight";
import { LatestNotes } from "@/components/home/LatestNotes";
import { RecentlyResearched } from "@/components/home/RecentlyResearched";
import { ResearchJournal } from "@/components/home/ResearchJournal";
import { ExploreSignals } from "@/components/home/ExploreSignals";
import { TrustStrip } from "@/components/home/TrustStrip";
import { SubscribeBand } from "@/components/home/SubscribeBand";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default function Home() {
  const base = site.url.replace(/\/$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: site.name,
        url: base,
        description: site.description,
        founder: { "@type": "Person", name: site.author },
      },
      {
        "@type": "WebSite",
        name: site.name,
        url: base,
        description: site.description,
      },
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <OpenTrackRecord />
      <Container className="space-y-20 py-16 sm:py-20">
        <FeaturedSpotlight />
        <LatestNotes />
        <RecentlyResearched />
        <ResearchJournal />
        <ExploreSignals />
      </Container>
      <TrustStrip />
      <SubscribeBand />
    </>
  );
}
