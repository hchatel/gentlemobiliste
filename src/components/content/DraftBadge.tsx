export const DraftBadge = ({ label }: { label: string }) => {
  return (
    <span className="inline-block rounded-sm border border-ochre px-1.5 py-0.5 text-xs font-semibold tracking-wide text-ink uppercase">
      {label}
    </span>
  );
};
