"use client";

import { Button } from "@/src/components/ui/button";
import appConfig from "@/src/config/app.config.json";

interface Props {
  onSort: () => void;
  onShuffle: () => void;
}

export default function WheelHeader({ onSort, onShuffle }: Props) {
  const { title, subtitle, emoji } = appConfig.app;
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <span className="text-2xl">{emoji}</span>
          <h1 className="font-black text-2xl tracking-tight" style={{ color: "hsl(36,100%,96%)" }}>
            {title}
          </h1>
        </div>
        <p className="text-[0.7rem] tracking-[1.5px] uppercase" style={{ color: "hsl(0,0%,53%)" }}>
          {subtitle}
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onSort}>↑ Sort</Button>
        <Button variant="outline" size="sm" onClick={onShuffle}>⇌ Shuffle</Button>
      </div>
    </div>
  );
}
