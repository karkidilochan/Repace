import { ProgressLog } from '@/types';

const KEY = 'repace-progress';

export const getProgress = (): Record<string, ProgressLog> => {
  // SAFETY CHECK: Next.js runs on server first, where window is undefined
  if (typeof window === 'undefined') return {}; 
  
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : {};
};

export const saveProgress = (id: string, log: ProgressLog) => {
  const current = getProgress();
  const updated = { ...current, [id]: log };
  localStorage.setItem(KEY, JSON.stringify(updated));
};