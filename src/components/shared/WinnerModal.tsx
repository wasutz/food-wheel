"use client";

import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/src/components/ui/dialog";
import appConfig from "@/src/config/app.config.json";

const { subtitle, celebrationEmoji, letsEatLabel, removeLabel } = appConfig.winner;

interface Props {
  winner: string;
  onClose: () => void;
  onRemove: () => void;
}

export default function WinnerModal({ winner, onClose, onRemove }: Props) {
  return (
    <Dialog open onOpenChange={open => !open && onClose()}>
      <DialogContent className="text-center max-w-sm overflow-hidden">
        {/* Glow */}
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,107,0,0.15) 0%, transparent 70%)" }}
        />

        <div className="relative flex flex-col items-center gap-3">
          <div className="text-5xl">{celebrationEmoji}</div>
          <p className="text-[0.65rem] tracking-[3px] uppercase text-white/30 font-semibold">
            {subtitle}
          </p>
          <h2
            className="text-3xl font-black text-amber-300 leading-tight break-words w-full"
            style={{ textShadow: "0 0 40px rgba(255,208,0,0.4)" }}
          >
            {winner}
          </h2>
        </div>

        <DialogFooter className="flex-col gap-2 mt-6">
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold h-11 text-base shadow-lg shadow-orange-500/30 hover:opacity-90"
          >
            {letsEatLabel}
          </Button>
          <Button
            variant="ghost"
            onClick={onRemove}
            className="w-full text-white/40 hover:text-white/70 hover:bg-white/[0.05]"
          >
            {removeLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
