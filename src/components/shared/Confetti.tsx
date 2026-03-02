"use client";

import { useEffect, useState } from "react";
import appConfig from "@/src/config/app.config.json";

interface Piece {
  id: number;
  left: string;
  color: string;
  w: number;
  h: number;
  circle: boolean;
  dur: number;
  delay: number;
}

const { confettiColors: COLORS, confettiPieceCount: PIECE_COUNT } = appConfig.wheel;

export default function Confetti() {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    setPieces(
      Array.from({ length: PIECE_COUNT }, (_, id) => ({
        id,
        left:   Math.random() * 100 + "vw",
        color:  COLORS[Math.floor(Math.random() * COLORS.length)],
        w:      Math.random() * 7 + 5,
        h:      Math.random() * 7 + 5,
        circle: Math.random() > 0.5,
        dur:    Math.random() * 2 + 2,
        delay:  Math.random() * 0.6,
      }))
    );
  }, []);

  return (
    <>
      {pieces.map(p => (
        <div
          key={p.id}
          className="fixed -top-5 pointer-events-none z-[200] animate-confetti-fall"
          style={{
            left:              p.left,
            background:        p.color,
            width:             p.w,
            height:            p.h,
            borderRadius:      p.circle ? "50%" : 2,
            animationDuration: `${p.dur}s`,
            animationDelay:    `${p.delay}s`,
            opacity:           0.9,
          }}
        />
      ))}
    </>
  );
}
