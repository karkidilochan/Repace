"use client";

import { useState } from "react";
import { usePaceLogic } from "@/hooks/usePaceLogic";
import Sidebar from "@/components/layout/Sidebar";
import PaceSection from "@/components/sections/PaceSection";
import RepaceSection from "@/components/sections/RepaceSection"; // You create this
import LoginModal from "@/components/Login";
import { getDaysSince } from "@/lib/utils";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);

  // 1. Call the Hook
  const logic = usePaceLogic();

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden flex-col md:flex-row">
      {/* 2. Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center z-20">
        <h1 className="font-extrabold text-xl tracking-tight text-gray-900">
          Pace<span className="text-blue-600">Code</span>.
        </h1>
        <button
          onClick={() => logic.setIsSidebarOpen(!logic.isSidebarOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
        >
          {/* SVG here */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* 3. Sidebar */}
      <Sidebar
        isOpen={logic.isSidebarOpen}
        setIsOpen={logic.setIsSidebarOpen}
        patternFilter={logic.patternFilter}
        setPatternFilter={logic.setPatternFilter}
        user={logic.user}
        onLoginClick={() => setShowLogin(true)}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* 4. Mobile Tabs */}
        <div className="md:hidden flex border-b border-gray-200 bg-white">
          <button
            onClick={() => logic.setMobileTab("pace")}
            className={`flex-1 py-3 text-sm font-bold border-b-2 ${
              logic.mobileTab === "pace"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500"
            }`}
          >
            Pace
          </button>
          <button
            onClick={() => logic.setMobileTab("repace")}
            className={`flex-1 py-3 text-sm font-bold border-b-2 ${
              logic.mobileTab === "repace"
                ? "border-amber-600 text-amber-600"
                : "border-transparent text-gray-500"
            }`}
          >
            Repace
          </button>
        </div>

        <div className="flex-1 flex gap-6 p-4 md:p-6 overflow-hidden">
          {/* 5. Sections */}
          <PaceSection
            isVisible={logic.mobileTab === "pace"}
            filter={logic.paceFilter}
            setFilter={logic.setPaceFilter}
            list={logic.paceList}
            solvedLog={logic.solvedLog}
            onToggle={logic.toggleProblem}
          />

          <RepaceSection
            isVisible={logic.mobileTab === "repace"}
            filter={logic.repaceFilter}
            setFilter={logic.setRepaceFilter}
            list={logic.repaceList}
            solvedLog={logic.solvedLog}
            onToggle={logic.toggleProblem}
            getDaysSince={getDaysSince}
          />
        </div>
      </main>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}
