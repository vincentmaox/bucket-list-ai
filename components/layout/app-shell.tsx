import * as React from "react";
import { StarfieldBg } from "@/components/brand";
import { TopNav } from "./top-nav";

type AppShellProps = {
  children: React.ReactNode;
  showNav?: boolean;
};

export function AppShell({ children, showNav = true }: AppShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <StarfieldBg />
      {showNav && <TopNav />}
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}
