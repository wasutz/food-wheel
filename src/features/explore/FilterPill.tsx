import { cn } from "@/src/lib/utils";

interface Props {
  active: boolean;
  onClick: () => void;
  label: string;
  emoji: string;
  count: number;
}

export default function FilterPill({ active, onClick, label, emoji, count }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[0.72rem] transition-all whitespace-nowrap",
        active
          ? "bg-orange-500/[0.15] border-orange-500/40 text-orange-400 font-bold"
          : "bg-white/[0.04] border-white/[0.08] text-muted-foreground hover:border-white/20"
      )}
    >
      <span>{emoji}</span>
      <span>{label}</span>
      <span className="font-mono text-[0.62rem] opacity-60">{count}</span>
    </button>
  );
}
