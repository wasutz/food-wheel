import type { SavedList } from "@/src/types";
import { Button } from "@/src/components/ui/button";
import appConfig from "@/src/config/app.config.json";

const fg  = `hsl(${appConfig.theme.foregroundHsl})`;
const mut = `hsl(${appConfig.theme.mutedHsl})`;

interface Props {
  list: SavedList;
  onLoad: () => void;
  onDelete: () => void;
}

/** A single clickable card in the Saved lists panel. */
export default function SavedListCard({ list, onLoad, onDelete }: Props) {
  return (
    <div
      onClick={onLoad}
      className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl cursor-pointer transition-all"
      style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.06)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,107,0,0.2)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate" style={{ color: fg }}>
          {list.name}
        </div>
        <div className="text-[0.68rem] mt-0.5" style={{ color: mut }}>
          {list.names.length} restaurants · {list.date}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={e => { e.stopPropagation(); onDelete(); }}
        className="shrink-0 h-7 w-7 hover:bg-red-400/10 hover:text-red-400"
        style={{ color: mut }}
        aria-label={appConfig.saved.deleteAriaLabel}
      >
        ✕
      </Button>
    </div>
  );
}
