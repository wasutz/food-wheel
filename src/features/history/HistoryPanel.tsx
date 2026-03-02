"use client";

import type { HistoryEntry } from "@/src/types";
import { Button } from "@/src/components/ui/button";
import HistoryCard from "./HistoryCard";
import appConfig from "@/src/config/app.config.json";

const { panelTitle, clearLabel, emptyTitle, emptySubtitle, emptyEmoji } = appConfig.history;
const fg = `hsl(${appConfig.theme.foregroundHsl})`;
const mut = `hsl(${appConfig.theme.mutedHsl})`;

interface Props {
  history: HistoryEntry[];
  onClear: () => void;
}

export default function HistoryPanel({ history, onClear }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-bold text-base" style={{ color: fg }}>
          {panelTitle}
        </span>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-xs"
            style={{ color: "rgba(248,113,113,0.7)" }}
          >
            {clearLabel}
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-12 gap-3 text-sm text-center"
          style={{ color: mut }}
        >
          <span className="text-4xl opacity-25">{emptyEmoji}</span>
          <div>
            {emptyTitle}
            <br />
            <span className="text-xs opacity-60">{emptySubtitle}</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {history.map((entry, i) => (
            <HistoryCard key={i} entry={entry} rank={i} />
          ))}
        </div>
      )}
    </div>
  );
}
