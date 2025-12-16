import { ModelProps } from "@/types";

export default function QuestionModal({ question, onClose }: ModelProps) {
  // Helper for difficulty colors
  const getDifficultyColor = (diff?: string) => {
    if (diff === "Easy") return "bg-green-100 text-green-700";
    if (diff === "Medium") return "bg-yellow-100 text-yellow-700";
    if (diff === "Hard") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    // 1. BACKDROP (Covers screen, clicking it closes modal)
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* 2. MODAL CARD (Clicking here does NOT close modal) */}
      <div
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {question.title}
            </h2>
            <div className="flex gap-2 mt-2">
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${getDifficultyColor(
                  question.difficulty
                )}`}
              >
                {question.difficulty || "Medium"}
              </span>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                {question.pattern}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-xl"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <a
            href={
              question.link ||
              `https://leetcode.com/problems/${question.title
                .toLowerCase()
                .replace(/ /g, "-")}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-[#FFA116] text-white font-bold py-3 rounded-lg hover:bg-[#FF8C00] transition-colors"
          >
            Go To LeetCode &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
