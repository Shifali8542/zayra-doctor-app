export const formatRelativeMinutes = (minutes: number): string => {
  if (minutes < 1) {
    const sec = Math.max(1, Math.round(minutes * 60));
    return `${sec}s ago`;
  }
  if (minutes < 60) {
    return `${Math.round(minutes)}m ago`;
  }
  const hrs = Math.floor(minutes / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export const formatSeconds = (sec: number): string => `${sec}s`;
export const formatCurrency = (val: number): string => `$${val}`;
export const formatPct = (val: number): string => `${val}%`;
