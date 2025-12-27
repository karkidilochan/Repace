import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import questions from "@/data/questions.json";
import { getDaysSince } from "@/lib/utils";
import { Question } from "@/types";

export function usePaceLogic() {
  // Auth State
  const [user, setUser] = useState<any>(null);

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"pace" | "repace">("pace");

  // Filter State
  const [patternFilter, setPatternFilter] = useState("All");
  const [paceFilter, setPaceFilter] = useState<"Unsolved" | "Solved" | "All">(
    "Unsolved"
  );
  const [repaceFilter, setRepaceFilter] = useState<"All" | "3" | "7" | "30">(
    "All"
  );

  // Data State
  const [solvedLog, setSolvedLog] = useState<Record<number, string>>({});

  // 1. Auth Effect
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

  // 2. Toggle Logic
  const toggleProblem = (id: number) => {
    const next = { ...solvedLog };
    const now = new Date();

    if (next[id]) {
      const daysAgo = getDaysSince(next[id]);
      if (daysAgo > 0) next[id] = now.toISOString(); // Review
      else delete next[id]; // Undo
    } else {
      next[id] = now.toISOString(); // Solve
    }
    setSolvedLog(next);
  };

  // 3. Filtering Logic
  const patternFilteredQuestions: Question[] = questions.filter(
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

    if (repaceFilter === "3") return isDay3;
    if (repaceFilter === "7") return isDay7;
    if (repaceFilter === "30") return isDay30;
    return isDay3 || isDay7 || isDay30;
  });

  return {
    user,
    solvedLog,
    isSidebarOpen,
    setIsSidebarOpen,
    mobileTab,
    setMobileTab,
    patternFilter,
    setPatternFilter,
    paceFilter,
    setPaceFilter,
    repaceFilter,
    setRepaceFilter,
    toggleProblem,
    paceList,
    repaceList,
  };
}
