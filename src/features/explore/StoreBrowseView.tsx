import type { City } from "@/src/types";
import { Select } from "@/src/components/ui/select";
import SectionLabel from "@/src/components/shared/SectionLabel";
import appConfig from "@/src/config/app.config.json";

const { cityLabel, storeLabel } = appConfig.explore;

interface Props {
  cities: City[];
  cityId: string;
  onCityChange: (id: string) => void;
  onSelectStore: (id: string) => void;
}

export default function StoreBrowseView({ cities, cityId, onCityChange, onSelectStore }: Props) {
  const city = cities.find(c => c.id === cityId)!;

  return (
    <div className="flex flex-col gap-5 animate-fade-up">
      {/* City selector */}
      <section className="flex flex-col gap-2">
        <SectionLabel>{cityLabel}</SectionLabel>
        <Select
          value={cityId}
          onChange={e => onCityChange(e.target.value)}
          className="h-10 bg-white/[0.04] border-white/10 text-sm text-foreground"
        >
          {cities.map(c => (
            <option key={c.id} value={c.id} style={{ background: "#111" }}>
              {c.emoji} {c.name}
            </option>
          ))}
        </Select>
      </section>

      {/* Store cards */}
      <section className="flex flex-col gap-2">
        <SectionLabel>{storeLabel}</SectionLabel>
        <div className="flex flex-col gap-1.5">
          {city.stores.map(s => (
            <button
              key={s.id}
              onClick={() => onSelectStore(s.id)}
              className="flex items-center gap-2.5 px-3 py-3 rounded-xl border border-white/[0.07] bg-white/[0.03] text-left w-full hover:bg-white/[0.07] hover:border-orange-500/30 transition-all group"
            >
              <span className="text-xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[0.86rem] text-foreground group-hover:text-orange-400 transition-colors truncate">
                  {s.name}
                </div>
                <div className="text-[0.65rem] text-muted-foreground mt-0.5 truncate">
                  {s.description}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-[0.65rem] text-muted-foreground bg-white/[0.05] border border-white/[0.07] rounded-full px-2 py-0.5">
                  {s.restaurants.length}
                </span>
                <span className="text-muted-foreground group-hover:text-orange-400 transition-colors text-sm">→</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
