/** Formats an ISO datetime string → "2m ago", "1h ago", etc. */
export const formatRelativeTime = (isoString: string): string => {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const hrs = Math.floor(diffMin / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

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

export const getTimeGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};
