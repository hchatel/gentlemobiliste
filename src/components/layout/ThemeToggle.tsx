"use client";

import { THEME_STORAGE_KEY } from "@/lib/theme";

type ThemeToggleProps = { labels: { toDark: string; toLight: string } };

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  className: "size-5",
} as const;

/**
 * Bascule clair/sombre. Le thème courant vit dans `data-theme` (posé avant le
 * rendu) : l'icône et le libellé affichés sont choisis en CSS, sans état React,
 * donc sans décalage à l'hydratation. Masqué tant que `data-theme` est absent
 * (sans JavaScript).
 */
export const ThemeToggle = ({ labels }: ThemeToggleProps) => {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Stockage indisponible : le choix vaut pour la page en cours seulement.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle inline-flex size-10 cursor-pointer items-center justify-center rounded-md text-ink hover:text-accent"
    >
      {/* Thème clair actif : on propose la lune (passer en sombre). */}
      <span className="theme-to-dark">
        <svg {...iconProps}>
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
        <span className="sr-only">{labels.toDark}</span>
      </span>
      {/* Thème sombre actif : on propose le soleil (passer en clair). */}
      <span className="theme-to-light">
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
        <span className="sr-only">{labels.toLight}</span>
      </span>
    </button>
  );
};
