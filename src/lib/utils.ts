export const getDaysSince = (dateString: string) => {
  const solved = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - solved.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};
