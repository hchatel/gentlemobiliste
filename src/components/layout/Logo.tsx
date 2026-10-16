/** Pictogramme : une route courbe partagée et son marquage. Décoratif. */
export const LogoMark = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect width="32" height="32" rx="8" className="fill-accent" />
      <path
        d="M6 21c5-9 15-9 20 0"
        fill="none"
        className="stroke-bg"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M9 26h4m3 0h4m3 0h2"
        className="stroke-ochre"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
