import QuestionCard from "@/components/QuestionCard";
import { Question } from "@/types";

interface RepaceSectionProps {
  isVisible: boolean;
  filter: string | number; // Can be 'All' or numbers 3, 7, 30
  setFilter: (v: any) => void;
  list: Question[];
  solvedLog: Record<number, string>; // Maps ID -> Date String
  onToggle: (id: number) => void;
  getDaysSince: (date: string) => number;
}

export default function RepaceSection({
  isVisible,
  filter,
  setFilter,
  list,
  solvedLog,
  onToggle,
  getDaysSince,
}: RepaceSectionProps) {
  return (
    <section
      className={`
        flex-1 flex-col min-w-0 
        ${isVisible ? "flex" : "hidden md:flex"}
        md:border-l md:border-gray-200 md:pl-6 md:border-dashed
      `}
    >
      {/* HEADER & FILTERS */}
      <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <h2 className="text-xl font-bold text-amber-900">Repace</h2>
          <p className="text-xs text-amber-600/70 font-medium">
            Review due items
          </p>
        </div>

        {/* Day Filters (Chips) */}
        <div className="flex gap-2 self-start sm:self-auto">
          {[3, 7, 30].map((day) => (
            <button
              key={day}
              onClick={() => setFilter(filter === day ? "All" : day)}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                filter === day
                  ? "bg-amber-100 border-amber-300 text-amber-800 ring-2 ring-amber-200"
                  : "bg-white border-amber-100 text-amber-600 hover:border-amber-300"
              }`}
            >
              Day {day}
            </button>
          ))}
        </div>
      </div>

      {/* SCROLLABLE LIST */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-20">
        {list.map((q) => {
          // Calculate context for the card
          const daysAgo = solvedLog[q.id] ? getDaysSince(solvedLog[q.id]) : 0;

          return (
            <QuestionCard
              key={q.id}
              {...q}
              isSolved={false}
              daysAgo={daysAgo}
              onToggle={onToggle}
            />
          );
        })}

        {/* Empty State */}
        {list.length === 0 && (
          <div className="text-center mt-10 p-6 bg-amber-50/50 rounded-xl border border-amber-100 border-dashed">
            <p className="text-amber-900/40 text-sm font-medium">
              You are all caught up!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
