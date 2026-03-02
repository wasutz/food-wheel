import type { HistoryEntry } from "@/src/types";
import { cn } from "@/src/lib/utils";
import appConfig from "@/src/config/app.config.json";

const { medals: MEDALS, fallbackEmoji: FALLBACK } = appConfig.history;
const fg  = `hsl(${appConfig.theme.foregroundHsl})`;
const mut = `hsl(${appConfig.theme.mutedHsl})`;

interface Props {
  entry: HistoryEntry;
  rank: number;
}

/** A single row in the spin history list. */
export default function HistoryCard({ entry, rank }: Props) {
  const isFirst = rank === 0;
  return (
    <div
      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl"
      style={{
        background: isFirst ? "rgba(255,107,0,0.08)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${isFirst ? "rgba(255,107,0,0.2)" : "rgba(255,255,255,0.08)"}`,
      }}
    >
      <span className="text-lg shrink-0">{MEDALS[rank] ?? FALLBACK}</span>
      <div className="flex-1 min-w-0">
        <div
          className={cn("font-semibold text-sm truncate", !isFirst && "opacity-70")}
          style={{ color: fg }}
          title={entry.name}
        >
          {entry.name}
        </div>
        <div className="font-mono text-[0.67rem] mt-0.5" style={{ color: mut }}>
          {entry.time}
        </div>
      </div>
      <span className="font-mono text-[0.68rem] shrink-0" style={{ color: mut }}>
        #{rank + 1}
      </span>
    </div>
  );
}
