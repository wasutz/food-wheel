interface Props {
  name: string;
  onRemove: () => void;
}

export default function NamePill({ name, onRemove }: Props) {
  return (
    <div
      className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full max-w-[180px] transition-colors"
      style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}
    >
      <span
        className="truncate text-[0.75rem]"
        style={{ color: "hsl(36,100%,96%)" }}
        title={name}
      >
        {name}
      </span>
      <button
        onClick={onRemove}
        className="shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[0.7rem] leading-none transition-colors hover:text-white"
        style={{ color: "hsl(0,0%,53%)" }}
        title={`Remove ${name}`}
        aria-label={`Remove ${name}`}
      >
        ×
      </button>
    </div>
  );
}
