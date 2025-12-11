interface QuestionCardProps {
  id: number;
  title: string;
  pattern: string;
  isSolved: boolean;
  onToggle: (id: number) => void;
  // Optional: Show "3 days ago" in the card
  daysAgo?: number; 
}

export default function QuestionCard({ id, title, pattern, isSolved, onToggle, daysAgo }: QuestionCardProps) {
  return (
    <div className={`group relative border p-4 rounded-xl shadow-sm flex justify-between items-center transition-all duration-200 hover:shadow-md ${
      isSolved ? 'bg-green-50/50 border-green-200' : 'bg-white border-gray-200'
    }`}>
      
      {/* TEXT SECTION */}
      <div className="flex-1 pr-4">
        <h3 className={`font-semibold text-sm transition-colors ${
          isSolved ? 'text-green-800' : 'text-gray-800'
        }`}>
          {title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {pattern}
          </span>
          {/* Show "Due" context if provided */}
          {daysAgo !== undefined && (
             <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
               Last: {daysAgo}d ago
             </span>
          )}
        </div>
      </div>

      {/* THE BIG TICK MARK BUTTON */}
      <button 
        onClick={() => onToggle(id)}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-100 ${
            isSolved 
            ? 'bg-green-500 text-white shadow-green-200 shadow-lg scale-110' 
            : 'bg-gray-100 text-gray-300 hover:bg-gray-200 hover:scale-105'
        }`}
      >
        {/* SVG Check Icon */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={3} 
          stroke="currentColor" 
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </button>

    </div>
  );
}