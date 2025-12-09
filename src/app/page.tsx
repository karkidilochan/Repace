"use client"; // <--- 1. DIRECTIVE: This tells Next.js "Send this JS to the browser"

import { useState } from 'react'; // <--- The Hook
import questions from '@/data/questions.json';
import QuestionCard from '@/components/QuestionCard';

export default function Home() {
  
  const [filter, setFilter] = useState('All');

  // --- DATA PROCESSING (The "Controller Logic") ---
  
  // 1. Get a list of unique patterns for the dropdown.
  const allPatterns = Array.from(new Set(questions.map(q => q.pattern)));

  // 2. Filter the data based on state.
  const visibleQuestions = questions.filter(q => {
    if (filter === 'All') return true; // Show everything
    return q.pattern === filter;
  });

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-800">
      
      {/* HEADER SECTION */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Repace Lite</h1>
        
        {/* THE DROPDOWN (The Input) */}
        <div className="flex items-center gap-2">
          <label className="font-medium">Filter by:</label>
          <select 
            className="border border-gray-300 rounded p-2 bg-white"
            value={filter} // Bind value to state (Two-way binding)
            onChange={(e) => {
              // EVENT HANDLER
              // e.target.value is the string the user selected.
              // We call setFilter to update state and trigger a re-render.
              setFilter(e.target.value); 
            }}
          >
            <option value="All">All Patterns</option>
            {/* Dynamic Options: Map through our unique patterns */}
            {allPatterns.map(pattern => (
              <option key={pattern} value={pattern}>
                {pattern}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* GRID SECTION (The View) */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* We map over visibleQuestions (the filtered list), not all questions */}
        {visibleQuestions.map((q) => (
          <QuestionCard 
            key={q.id} 
            title={q.title} 
            pattern={q.pattern} 
          />
        ))}

        {/* Empty State Handling */}
        {visibleQuestions.length === 0 && (
          <p className="col-span-2 text-center text-gray-500 py-10">
            No questions found for this pattern.
          </p>
        )}
      </div>
      
    </main>
  );
}