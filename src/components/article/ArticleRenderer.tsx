import type { ArticleBlock } from "@/lib/articles/types";
import { Prose, LeadIn } from "./Prose";
import {
  ArticleHeading,
  Callout,
  StatGrid,
  SplitBar,
  Legend,
  Verdict,
  RiskList,
} from "./blocks";
import { ComparisonTable } from "./ComparisonTable";
import { BarChart } from "./BarChart";

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "prose":
      return <Prose md={block.md} />;
    case "leadin":
      return <LeadIn md={block.md} />;
    case "callout":
      return <Callout label={block.label} md={block.md} />;
    case "heading":
      return <ArticleHeading num={block.num} text={block.text} />;
    case "stats":
      return <StatGrid items={block.items} />;
    case "splitbar":
      return (
        <SplitBar
          label={block.label}
          segments={block.segments}
          caption={block.caption}
        />
      );
    case "legend":
      return <Legend items={block.items} />;
    case "barchart":
      return (
        <BarChart
          title={block.title}
          sub={block.sub}
          data={block.data}
          max={block.max}
          diverging={block.diverging}
          source={block.source}
        />
      );
    case "table":
      return (
        <ComparisonTable
          columns={block.columns}
          rows={block.rows}
          note={block.note}
        />
      );
    case "verdict":
      return (
        <Verdict kicker={block.kicker} heading={block.heading} md={block.md} />
      );
    case "risks":
      return <RiskList items={block.items} />;
    default:
      return null;
  }
}

export function ArticleRenderer({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="flex flex-col gap-5">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
