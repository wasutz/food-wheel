import type { HistoryEntry } from "@/src/types";
import StatItem from "./StatItem";

interface Props {
  names: string[];
  history: HistoryEntry[];
}

export default function WheelStats({ names, history }: Props) {
  if (names.length === 0) return null;
  return (
    <div
      className="flex gap-7 px-5 py-3.5 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <StatItem label="Choices"   value={names.length} />
      <StatItem label="Spins"     value={history.length} />
      {history[0] && <StatItem label="Last pick" value={history[0].name} small />}
    </div>
  );
}
