"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Compass, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const NAV_ITEMS = [
  { href: "/", label: "人生沙漏", icon: Sparkles },
  { href: "/wishes", label: "愿望清单", icon: Compass },
  { href: "/map", label: "世界地图", icon: Compass },
  { href: "/memories", label: "人生记录", icon: Sparkles },
  { href: "/budget", label: "资金账本", icon: Compass },
  { href: "/onboarding", label: "AI 引导", icon: Sparkles },
];

export function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass-panel-strong mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span className="text-xl font-bold tracking-tight">
            <span className="text-glow-amber text-amber">bucket</span>
            <span className="text-starlight">·</span>
            <span className="text-glow-aurora text-aurora">list</span>
            <span className="text-muted-foreground text-sm font-mono ml-1">.ai</span>
          </span>
        </Link>

        {/* 桌面导航 */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-all",
                  active
                    ? "glass-panel text-amber"
                    : "text-muted-foreground hover:text-starlight hover:bg-white/5"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 移动端汉堡 */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden rounded-lg p-2 glass-panel inline-flex items-center justify-center text-starlight hover:text-amber transition-colors"
            aria-label="打开导航"
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-72 glass-panel-strong border-l border-white/10"
          >
            <SheetTitle className="text-lg font-bold mb-4 pt-2">
              导航
            </SheetTitle>
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-all",
                      active
                      ? "glass-panel text-amber"
                      : "text-muted-foreground hover:text-starlight hover:bg-white/5"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
