import QuestionCard from "@/components/QuestionCard";
import { Question } from "@/types";

interface PaceSectionProps {
  isVisible: boolean;
  filter: string;
  setFilter: (v: any) => void;
  list: Question[];
  solvedLog: Record<number, string>;
  onToggle: (id: number) => void;
}

export default function PaceSection({
  isVisible,
  filter,
  setFilter,
  list,
  solvedLog,
  onToggle,
}: PaceSectionProps) {
  return (
    <section
      className={`flex-1 flex-col min-w-0 ${
        isVisible ? "flex" : "hidden md:flex"
      }`}
    >
      <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="text-xl font-bold text-gray-800">Pace</h2>
        <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm self-start sm:self-auto">
          {["Unsolved", "Solved", "All"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                filter === status
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
        {list.map((q) => (
          <QuestionCard
            key={q.id}
            {...q}
            isSolved={!!solvedLog[q.id]}
            onToggle={onToggle}
          />
        ))}
        {list.length === 0 && (
          <div className="text-center text-gray-400 mt-10 text-sm">
            No problems found.
          </div>
        )}
      </div>
    </section>
  );
}
