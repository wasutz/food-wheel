import { cn } from "@/src/lib/utils";

interface Props {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
}

export default function ExploreCheckbox({ checked, indeterminate, onChange }: Props) {
  return (
    <div
      onClick={e => { e.stopPropagation(); onChange(); }}
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      className={cn(
        "w-4 h-4 rounded flex items-center justify-center text-[0.6rem] font-bold text-white shrink-0 cursor-pointer transition-all border",
        checked
          ? "bg-orange-500 border-orange-500"
          : indeterminate
            ? "bg-orange-500/30 border-orange-500"
            : "bg-transparent border-white/20 hover:border-white/40"
      )}
    >
      {checked ? "✓" : indeterminate ? "–" : ""}
    </div>
  );
}
