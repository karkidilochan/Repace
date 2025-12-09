export const calculateNextReview = (rating: 'Easy' | 'Medium' | 'Hard'): string => {
  const now = new Date();
  if (rating === 'Hard') return now.toISOString(); // Review immediately
  if (rating === 'Medium') now.setDate(now.getDate() + 3);
  if (rating === 'Easy') now.setDate(now.getDate() + 7);
  return now.toISOString();
};