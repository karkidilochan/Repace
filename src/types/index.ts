export interface Question {
  id: number;
  title: string;
  pattern: string;
  difficulty: string;
  link: string;
  tag?: string;
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
  daysAgo?: number;
}
