import type { Restaurant, RestaurantCategory } from "@/src/types";
import { cn } from "@/src/lib/utils";
import ExploreCheckbox from "./ExploreCheckbox";

interface Props {
  restaurant: Restaurant;
  category: RestaurantCategory | undefined;
  checked: boolean;
  onToggle: () => void;
}

export default function RestaurantRow({ restaurant, category, checked, onToggle }: Props) {
  return (
    <div
      onClick={onToggle}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 cursor-pointer border-b border-white/[0.04] last:border-0 transition-colors",
        checked ? "bg-orange-500/[0.07]" : "hover:bg-white/[0.04]"
      )}
    >
      <ExploreCheckbox checked={checked} onChange={onToggle} />
      <span className="flex-1 text-[0.82rem] text-foreground">{restaurant.name}</span>
      <div className="flex items-center gap-1.5 shrink-0">
        {restaurant.floor && (
          <span className="font-mono text-[0.6rem] text-muted-foreground bg-white/[0.05] border border-white/[0.07] rounded px-1.5 py-0.5">
            {restaurant.floor}F
          </span>
        )}
        <span className="text-base" title={category?.label}>{category?.emoji}</span>
      </div>
    </div>
  );
}
