"use client";

import { useEffect, useState } from "react";
import questions from "@/data/questions.json";
import QuestionCard from "@/components/QuestionCard";
import { Question } from "@/types";
import QuestionModal from "@/components/QuestionModel";
import { supabase } from "@/lib/supabase";
import LoginModal from "@/components/Login";

const LEARNING_PATH = [
  "Arrays & Hashing",
  "Two Pointers",
  "Sliding Window",
  "Stack",
  "Binary Search",
  "Linked List",
  "Trees",
  "Tries",
  "Heap / Priority Queue",
  "Backtracking",
  "Graphs",
  "Advanced Graphs",
  "1-D Dynamic Programming",
  "2-D Dynamic Programming",
  "Greedy",
  "Intervals",
  "Math & Geometry",
  "Bit Manipulation",
];

const getDaysSince = (dateString: string) => {
  const solved = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - solved.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false); // Changed default to false

  // --- RESPONSIVE STATES ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Menu
  const [mobileTab, setMobileTab] = useState<"pace" | "repace">("pace"); // Mobile Tabs

  const [patternFilter, setPatternFilter] = useState("All");
  const [paceFilter, setPaceFilter] = useState<"Unsolved" | "Solved" | "All">(
    "Unsolved"
  );
  const [repaceFilter, setRepaceFilter] = useState<"All" | 3 | 7 | 30>("All");
  const [solvedLog, setSolvedLog] = useState<Record<number, string>>({});
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );

  // --- LOGIC (Unchanged) ---
  const toggleProblem = (id: number) => {
    const next = { ...solvedLog };
    const now = new Date();
    const TEST_MODE = false;
    const TEST_DAYS_AGO = 7;

    if (next[id]) {
      const daysAgo = getDaysSince(next[id]);
      if (daysAgo > 0) {
        next[id] = now.toISOString();
      } else {
        delete next[id];
      }
    } else {
      if (TEST_MODE) {
        const fakeDate = new Date();
        fakeDate.setDate(now.getDate() - TEST_DAYS_AGO);
        next[id] = fakeDate.toISOString();
      } else {
        next[id] = now.toISOString();
      }
    }
    setSolvedLog(next);
  };

  const patternFilteredQuestions = questions.filter(
    (q) => patternFilter === "All" || q.pattern === patternFilter
  );

  const paceList = patternFilteredQuestions.filter((q) => {
    const isSolved = !!solvedLog[q.id];
    if (paceFilter === "Unsolved") return !isSolved;
    if (paceFilter === "Solved") return isSolved;
    return true;
  });

  const repaceList = patternFilteredQuestions.filter((q) => {
    if (!solvedLog[q.id]) return false;
    const daysAgo = getDaysSince(solvedLog[q.id]);
    const isDay3 = daysAgo === 3;
    const isDay7 = daysAgo === 7;
    const isDay30 = daysAgo === 30;

    if (repaceFilter === 3) return isDay3;
    if (repaceFilter === 7) return isDay7;
    if (repaceFilter === 30) return isDay30;
    return isDay3 || isDay7 || isDay30;
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden flex-col md:flex-row">
      {/* --- MOBILE HEADER (Only visible on small screens) --- */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center z-20">
        <h1 className="font-extrabold text-xl tracking-tight text-gray-900">
          Pace<span className="text-blue-600">Code</span>.
        </h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
        >
          {/* Hamburger Icon */}
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

      {/* --- SIDEBAR --- */}
      {/* Logic: Fixed overlay on Mobile. Static sidebar on Desktop. */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 
          ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full p-4 gap-4">
          <div className="px-2 flex justify-between items-center">
            <h1 className="font-extrabold text-2xl tracking-tight text-gray-900 hidden md:block">
              Pace<span className="text-blue-600">Code</span>.
            </h1>
            {/* Close button for Mobile only */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 text-gray-500"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 bg-gray-50 border-b border-gray-100 rounded-t-xl">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Patterns
              </h2>
            </div>
            <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar border-x border-b border-gray-100 rounded-b-xl">
              <button
                onClick={() => {
                  setPatternFilter("All");
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  patternFilter === "All"
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                All Patterns
              </button>
              <div className="border-t border-gray-100 my-2 mx-2"></div>
              {LEARNING_PATH.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPatternFilter(p);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                    patternFilter === p
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100">
            {user ? (
              <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-500 truncate">Logged in as:</p>
                <p className="text-xs font-bold text-gray-800 truncate mb-2">
                  {user.email}
                </p>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="text-xs text-red-500 hover:underline text-left"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="w-full bg-blue-600 text-black py-2 rounded text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                Log In / Sign Up
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* --- MOBILE BACKDROP (When menu is open) --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* MOBILE TABS (Pace vs Repace switcher) */}
        <div className="md:hidden flex border-b border-gray-200 bg-white">
          <button
            onClick={() => setMobileTab("pace")}
            className={`flex-1 py-3 text-sm font-bold border-b-2 ${
              mobileTab === "pace"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500"
            }`}
          >
            Pace
          </button>
          <button
            onClick={() => setMobileTab("repace")}
            className={`flex-1 py-3 text-sm font-bold border-b-2 ${
              mobileTab === "repace"
                ? "border-amber-600 text-amber-600"
                : "border-transparent text-gray-500"
            }`}
          >
            Repace
          </button>
        </div>

        <div className="flex-1 flex gap-6 p-4 md:p-6 overflow-hidden">
          {/* --- PACE SECTION --- */}
          {/* Logic: Hidden on mobile unless tab is active. Always visible on Desktop. */}
          <section
            className={`
            flex-1 flex-col min-w-0 
            ${mobileTab === "pace" ? "flex" : "hidden md:flex"}
          `}
          >
            <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h2 className="text-xl font-bold text-gray-800">Pace</h2>
              <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm self-start sm:self-auto">
                {["Unsolved", "Solved", "All"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setPaceFilter(status as any)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                      paceFilter === status
                        ? "bg-gray-900 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-20">
              {paceList.map((q) => (
                <QuestionCard
                  key={q.id}
                  {...q}
                  difficulty="Easy"
                  link="link"
                  isSolved={!!solvedLog[q.id]}
                  onCardClick={() => setSelectedQuestion(q)}
                  onToggle={toggleProblem}
                />
              ))}
              {paceList.length === 0 && (
                <div className="text-center text-gray-400 mt-10 text-sm">
                  No problems found.
                </div>
              )}
            </div>
          </section>

          {/* --- REPACE SECTION --- */}
          {/* Logic: Hidden on mobile unless tab is active. Always visible on Desktop. */}
          <section
            className={`
            flex-1 flex-col min-w-0 
            ${mobileTab === "repace" ? "flex" : "hidden md:flex"}
            md:border-l md:border-gray-200 md:pl-6 md:border-dashed
          `}
          >
            <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <h2 className="text-xl font-bold text-amber-900">Repace</h2>
                <p className="text-xs text-amber-600/70 font-medium">
                  Review due items
                </p>
              </div>

              <div className="flex gap-2 self-start sm:self-auto">
                {[3, 7, 30].map((day) => (
                  <button
                    key={day}
                    onClick={() =>
                      setRepaceFilter(
                        repaceFilter === day ? "All" : (day as any)
                      )
                    }
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                      repaceFilter === day
                        ? "bg-amber-100 border-amber-300 text-amber-800 ring-2 ring-amber-200"
                        : "bg-white border-amber-100 text-amber-600 hover:border-amber-300"
                    }`}
                  >
                    Day {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-20">
              {repaceList.map((q) => {
                const daysAgo = getDaysSince(solvedLog[q.id]);
                return (
                  <QuestionCard
                    key={q.id}
                    {...q}
                    difficulty="Easy"
                    link="link"
                    isSolved={false}
                    daysAgo={daysAgo}
                    onToggle={toggleProblem}
                    onCardClick={() => setSelectedQuestion(q)}
                  />
                );
              })}
              {repaceList.length === 0 && (
                <div className="text-center mt-10 p-6 bg-amber-50/50 rounded-xl border border-amber-100 border-dashed">
                  <p className="text-amber-900/40 text-sm font-medium">
                    You are all caught up!
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {selectedQuestion && (
        <QuestionModal
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
        />
      )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}
