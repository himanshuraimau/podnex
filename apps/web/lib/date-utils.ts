/**
 * Format duration in seconds to human readable format (e.g., "5:32", "1:05:32")
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format a date as relative time (e.g., "2 hours ago", "3 days ago")
 */
export function formatDistanceToNow(date: Date, options?: { addSuffix?: boolean }): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return options?.addSuffix ? "just now" : "0 minutes";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    const text = `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"}`;
    return options?.addSuffix ? `${text} ago` : text;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    const text = `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"}`;
    return options?.addSuffix ? `${text} ago` : text;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    const text = `${diffInDays} ${diffInDays === 1 ? "day" : "days"}`;
    return options?.addSuffix ? `${text} ago` : text;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    const text = `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"}`;
    return options?.addSuffix ? `${text} ago` : text;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  const text = `${diffInYears} ${diffInYears === 1 ? "year" : "years"}`;
  return options?.addSuffix ? `${text} ago` : text;
}
