"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { primaryNav, site } from "@/lib/site";
import { SearchBox } from "./SearchBox";
import { Close, Menu } from "@/components/ui/icons";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.replace(/#.*$/, "")) && href !== "/";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur supports-[backdrop-filter]:bg-paper/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-brand text-on-brand">
            <span className="font-serif text-lg leading-none">
              {site.name.charAt(0)}
            </span>
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight text-ink">
            {site.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "text-ink"
                  : "text-ink-soft hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden w-full max-w-xs md:block">
          <SearchBox />
        </div>

        {/* Profile */}
        <button
          type="button"
          aria-label="Account"
          className="hidden h-9 w-9 shrink-0 place-items-center rounded-full border border-line-strong bg-surface text-sm font-medium text-ink-soft hover:text-ink md:grid"
        >
          {site.author.charAt(0)}
        </button>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="ml-auto grid h-10 w-10 place-items-center rounded-md border border-line-strong bg-surface text-ink md:hidden"
        >
          {mobileOpen ? <Close /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-line bg-paper px-4 py-4 md:hidden">
          <SearchBox className="mb-3" />
          <nav className="flex flex-col">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-base font-medium",
                  isActive(item.href)
                    ? "bg-surface-sunken text-ink"
                    : "text-ink-soft",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
