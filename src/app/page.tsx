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
  const [showLogin, setShowLogin] = useState(true);
  const [patternFilter, setPatternFilter] = useState("All");
  const [paceFilter, setPaceFilter] = useState<"Unsolved" | "Solved" | "All">(
    "Unsolved"
  );
  const [repaceFilter, setRepaceFilter] = useState<"All" | 3 | 7 | 30>("All");
  const [solvedLog, setSolvedLog] = useState<Record<number, string>>({});
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );

  // --- SMART TOGGLE LOGIC ---
  const toggleProblem = (id: number) => {
    const next = { ...solvedLog };
    const now = new Date();

    // --- TESTING CONFIG ---
    const TEST_MODE = false; // Set to false when deploying
    const TEST_DAYS_AGO = 7; // Change to 7 or 30 to test other buckets
    // ----------------------

    if (next[id]) {
      // SCENARIO A: The problem is already in the log
      const daysAgo = getDaysSince(next[id]);

      if (daysAgo > 0) {
        // CASE 1: REVIEW
        // It's an old problem (from Repace). Update date to NOW.
        next[id] = now.toISOString();
      } else {
        // CASE 2: UNDO
        // It was solved "Today". User clicked it again to delete it.
        delete next[id];
      }
    } else {
      // SCENARIO B: The problem is NOT solved yet

      if (TEST_MODE) {
        // TEST LOGIC: Pretend we solved it in the past
        // This instantly pushes it into the "Repace" column
        const fakeDate = new Date();
        fakeDate.setDate(now.getDate() - TEST_DAYS_AGO);
        next[id] = fakeDate.toISOString();
      } else {
        // PRODUCTION LOGIC: Mark as solved right now
        next[id] = now.toISOString();
      }
    }

    setSolvedLog(next);
  };

  // --- FILTERING ---
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

    // Strict buckets
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
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 flex flex-col p-4 gap-4 bg-white border-r border-gray-200">
        <div className="px-2">
          <h1 className="font-extrabold text-2xl tracking-tight text-gray-900">
            Pace<span className="text-blue-600">Code</span>.
          </h1>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-3 bg-gray-50 border-b border-gray-100 rounded-t-xl">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Patterns
            </h2>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar border-x border-b border-gray-100 rounded-b-xl">
            <button
              onClick={() => setPatternFilter("All")}
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
                onClick={() => setPatternFilter(p)}
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
        {/* SIDEBAR FOOTER */}
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
              className="w-full bg-blue-600 text-white py-2 rounded text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              Log In / Sign Up
            </button>
          )}
        </div>
      </aside>

      <main className="flex-1 flex gap-6 p-6 overflow-hidden">
        {/* --- PACE SECTION --- */}
        <section className="flex-1 flex flex-col min-w-0">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Pace</h2>
            <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
              {["Unsolved", "Solved", "All"].map((status) => (
                <button
                  key={status}
                  onClick={() => setPaceFilter(status as any)}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
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
        <section className="flex-1 flex flex-col min-w-0 border-l border-gray-200 pl-6 border-dashed">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-amber-900">Repace</h2>
              <p className="text-xs text-amber-600/70 font-medium">
                Review due items
              </p>
            </div>

            <div className="flex gap-2">
              {[3, 7, 30].map((day) => (
                <button
                  key={day}
                  onClick={() =>
                    setRepaceFilter(repaceFilter === day ? "All" : (day as any))
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
                  // CRITICAL: Force it to look "Unsolved" (Gray) in Repace
                  // This encourages the user to click it to "Complete" the review
                  isSolved={false}
                  // Pass context so the card shows "Last: 3d ago"
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
