import { NextResponse } from "next/server";
import { isAuthor } from "@/lib/auth";
import { saveFeatured, type Featured } from "@/lib/articles/featured";

/** Author-only: update "This week's closest look". */
export async function PUT(request: Request) {
  if (!(await isAuthor())) {
    return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 });
  }
  let data: Featured;
  try {
    data = (await request.json()) as Featured;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad JSON" }, { status: 400 });
  }
  try {
    await saveFeatured(data);
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Save failed" },
      { status: 400 },
    );
  }
  return NextResponse.json({ ok: true });
}
