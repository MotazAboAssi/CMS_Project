// src/pages/dashboard/page.tsx
import * as React from "react";
import { Sidebar } from "./components/sidebar/main";
import { Header } from "./components/header/main";
import { ScheduleGrid } from "./components/SchedualeGrid/main";

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-screen bg-neutral-50 overflow-hidden select-none font-sans text-neutral-900 antialiased">
      {/* 1. Inline structural sidebar configured via shadcn Drawer primitives */}
      <Sidebar />

      {/* Main Workspace Frame Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Header />
        {/* 3. Primary Virtual Canvas Area Slot */}
        <main className="flex-1 min-h-0 w-full bg-white relative ">
          <ScheduleGrid />
        </main>
      </div>
    </div>
  );
}
