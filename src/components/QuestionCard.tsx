import { QuestionCardProps } from "@/types";

export default function QuestionCard({
  id,
  title,
  pattern,
  difficulty = "Medium", // Default to Medium if undefined
  link,
  isSolved,
  onToggle,
  daysAgo,
}: QuestionCardProps) {
  // Auto-generate LeetCode link if one isn't provided in the JSON
  const problemLink =
    link ||
    `https://leetcode.com/problems/${title.toLowerCase().replace(/ /g, "-")}/`;

  // Helper for difficulty badge colors
  const getDiffColor = (d: string) => {
    if (d === "Easy") return "bg-green-100 text-green-700 border-green-200";
    if (d === "Hard") return "bg-red-100 text-red-700 border-red-200";
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  return (
    <div
      className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
        isSolved
          ? "bg-green-50/40 border-green-200"
          : "bg-white border-gray-200"
      }`}
    >
      {/* 1. LEFT: The Big Tick Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(id);
        }}
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
          isSolved
            ? "bg-green-500 text-white shadow-green-200 shadow-md scale-105 ring-green-400"
            : "bg-gray-100 text-gray-300 hover:bg-gray-200 hover:text-gray-400 group-hover:bg-gray-200"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </button>

      {/* 2. CENTER: Title & Metadata */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <h3
          className={`font-semibold text-sm text-gray-900 truncate ${
            isSolved ? "text-gray-400" : ""
          }`}
        >
          {title}
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty Badge */}
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${getDiffColor(
              difficulty
            )}`}
          >
            {difficulty}
          </span>

          {/* Pattern Badge */}
          <span className="text-[10px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full truncate">
            {pattern}
          </span>

          {/* "Last Solved" Context (Only shows if daysAgo is passed) */}
          {daysAgo !== undefined && (
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
              Last: {daysAgo}d ago
            </span>
          )}
        </div>
      </div>

      {/* 3. RIGHT: LeetCode Link */}
      <a
        href={problemLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 group/link flex items-center gap-1 pl-4 border-l border-gray-100 hover:text-blue-600 transition-colors"
        title="Open in LeetCode"
      >
        <span className="text-xs font-bold text-gray-400 group-hover/link:text-blue-600 hidden sm:block">
          Solve
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5 text-gray-300 group-hover/link:text-blue-600 transform group-hover/link:translate-x-0.5 transition-transform"
        >
          <path
            fillRule="evenodd"
            d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 19H4.25A2.25 2.25 0 012 16.75V6.25A2.25 2.25 0 014.25 4h4a.75.75 0 010 1.5h-4z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
            clipRule="evenodd"
          />
        </svg>
      </a>
    </div>
  );
}
