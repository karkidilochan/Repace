export interface Question {
  id: string;
  title: string;
  pattern: string; // e.g., "Two Pointers"
  link: string;
}

export interface ProgressLog {
  nextReview: string; // ISO Date
  status: 'Reviewing' | 'Mastered';
}