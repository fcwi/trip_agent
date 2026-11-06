// Original small marks share the rounded pen strokes of the destination artwork.
export function JournalTurn({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 16c4 1 8 0 10-3s1-5-1-5-4 2-2 4 6 1 8-3m-5-1 5 1-1 5" />
    </svg>
  );
}

export function JournalStar({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="m12 2 3.1 6.2 6.6 1.3-4.5 5.1.5 7-5.8-3.5-6.5 2.5 1.2-7.1L2 8.8l7.2-.5Z" />
    </svg>
  );
}
