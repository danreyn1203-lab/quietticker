import "server-only";
import { promises as fs } from "fs";
import path from "path";

/**
 * "This week's closest look" — a single editable spotlight shown on the
 * homepage. Stored as JSON so the author can edit it from /admin, same as
 * articles. Separate from the demo discovery data.
 */
export interface Featured {
  eyebrow: string;
  ticker: string;
  name: string;
  exchange: string;
  sector: string;
  industry: string;
  price: number;
  currency?: string;
  priceNote?: string;
  whyWatching: string; // markdown
  tags: string[];
  catalystLabel?: string;
  catalyst?: string; // markdown
  owns: boolean;
  positionNote?: string;
  note?: string; // e.g. "Full write-up coming soon"
  ctaHref?: string;
  ctaLabel?: string;
  disclaimer?: string;
}

const FILE = path.join(process.cwd(), "src", "content", "featured.json");

export async function getFeatured(): Promise<Featured | null> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Featured;
  } catch {
    return null;
  }
}

export async function saveFeatured(data: Featured): Promise<void> {
  if (!data.ticker || !data.name || !data.whyWatching) {
    throw new Error("Featured spotlight needs at least a ticker, name and thesis.");
  }
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf8");
}
