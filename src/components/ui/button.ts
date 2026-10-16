const base =
  "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 font-medium no-underline disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  primary: "bg-accent text-bg hover:bg-accent-strong hover:text-bg",
  secondary:
    "border border-accent text-accent hover:bg-accent-soft hover:text-accent-strong",
} as const;

/** Classes partagées par les liens d'action et les boutons du quiz. */
export const buttonClass = (
  variant: keyof typeof variants = "primary",
): string => {
  return `${base} ${variants[variant]}`;
};
