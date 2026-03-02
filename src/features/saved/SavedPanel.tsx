"use client";

import type { SavedList } from "@/src/types";
import SavedListCard from "./SavedListCard";
import appConfig from "@/src/config/app.config.json";

const { panelTitle, emptyTitle, emptySubtitle, emptyEmoji } = appConfig.saved;
const fg  = `hsl(${appConfig.theme.foregroundHsl})`;
const mut = `hsl(${appConfig.theme.mutedHsl})`;

interface Props {
  savedLists: SavedList[];
  setSavedLists: (fn: (prev: SavedList[]) => SavedList[]) => void;
  onLoad: (sl: SavedList) => void;
}

export default function SavedPanel({ savedLists, setSavedLists, onLoad }: Props) {
  const deleteList = (i: number) =>
    setSavedLists(prev => prev.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-3">
      <span className="font-bold text-base" style={{ color: fg }}>
        {panelTitle}
      </span>

      {savedLists.length === 0 ? (
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
          {savedLists.map((sl, i) => (
            <SavedListCard
              key={i}
              list={sl}
              onLoad={() => onLoad(sl)}
              onDelete={() => deleteList(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
