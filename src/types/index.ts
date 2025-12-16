export interface Question {
  id: number;
  title: string;
  pattern: string;
  difficulty?: string;
  link?: string;
}

export interface ModelProps {
  question: Question;
  onClose: () => void;
}

export interface ProgressLog {
  nextReview: string; // ISO Date
  status: "Reviewing" | "Mastered";
}

export interface QuestionCardProps {
  id: number;
  title: string;
  pattern: string;
  difficulty: string;
  link: string;
  isSolved: boolean;
  onToggle: (id: number) => void;
  onCardClick: () => void;
  // Optional: Show "3 days ago" in the card
  daysAgo?: number;
}
