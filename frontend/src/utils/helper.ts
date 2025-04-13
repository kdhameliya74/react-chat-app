export function formatDateTime(input: string): string {
  const date = new Date(input.replace(' ', 'T')); // Convert to ISO format

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  return date.toLocaleString('en-US', options);
}
