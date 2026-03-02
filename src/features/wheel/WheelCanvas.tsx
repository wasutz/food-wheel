"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import appConfig from "@/src/config/app.config.json";

const { colors: COLORS, textColors: TEXT_COLORS, fontFamily, chordPaddingFactor, minFontSize } =
  appConfig.wheel;

interface Props {
  names: string[];
  isSpinning: boolean;
  angle: number;
  setAngle: (a: number) => void;
  onSpinEnd: (finalAngle: number) => void;
  onSpin: () => void;
}

/**
 * Computes the best font size for a wheel slice.
 *
 * 1. Chord height = 2r·sin(θ/2) — actual vertical space the arc provides.
 * 2. Apply chordPaddingFactor so glyphs don't crowd the divider lines.
 * 3. "Absurdity cap" prevents single/double chars from being grotesquely huge.
 * 4. Walk down 1px until text fits the radial width lane; truncate with "…" if needed.
 */
function getFontSize(
  label: string,
  arcAngle: number,
  textRadiusMid: number,
  maxWidthPx: number,
  ctx: CanvasRenderingContext2D
): { size: number; truncated: string } {
  const chordHeight = 2 * textRadiusMid * Math.sin(arcAngle / 2);
  const geometricCap = Math.floor(chordHeight * chordPaddingFactor);

  const len = label.length;
  const caps = appConfig.wheel.absurdityCaps as Record<string, number>;
  const absurdityCap =
    len <= 1 ? caps["1"] :
      len <= 2 ? caps["2"] :
        len <= 3 ? caps["3"] :
          9999;

  const isSingleSlice = arcAngle >= Math.PI * 2 - 0.01;

  const startSize = isSingleSlice
    ? Math.max(minFontSize, Math.floor(maxWidthPx * 0.28))
    : Math.max(minFontSize, Math.min(geometricCap, absurdityCap));

  for (let s = startSize; s >= minFontSize; s--) {
    ctx.font = `700 ${s}px ${fontFamily}`;
    if (ctx.measureText(label).width <= maxWidthPx) {
      return { size: s, truncated: label };
    }
  }

  // Truncate with ellipsis at minimum size
  let text = label;
  ctx.font = `700 ${minFontSize}px ${fontFamily}`;
  while (text.length > 3 && ctx.measureText(text + "…").width > maxWidthPx) {
    text = text.slice(0, -1);
  }
  return { size: minFontSize, truncated: text.length < label.length ? text + "…" : text };
}

export default function WheelCanvas({ names, isSpinning, angle, setAngle, onSpinEnd, onSpin }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const angleRef = useRef(angle);
  const idleAnimRef = useRef<number>(0);
  const isSpinRef = useRef(false);
  const hasSpunRef = useRef(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { canvasSize, innerRadius, outerTextRadiusFactor, spinMinRevolutions,
    spinMaxRevolutions, spinMinDurationMs, spinMaxDurationMs } = appConfig.wheel;

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => { angleRef.current = angle; }, [angle]);

  const drawWheel = useCallback((currentAngle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const r = W / 2 - 10;
    ctx.clearRect(0, 0, W, H);
    const n = names.length;

    // ── Empty state ───────────────────────────────────────────────────────
    if (n === 0) {
      ctx.save();
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, "#1e1500");
      grad.addColorStop(1, "#0f0a00");
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = grad; ctx.fill();
      ctx.strokeStyle = "rgba(255,200,80,0.15)"; ctx.lineWidth = 3; ctx.stroke();
      ctx.setLineDash([8, 8]);
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.72, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,200,80,0.08)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = "80px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("🍜", cx, cy - 42);
      ctx.font = `700 32px ${fontFamily}`; ctx.fillStyle = "rgba(255,200,80,0.65)";
      ctx.fillText("Add restaurants", cx, cy + 40);
      ctx.font = `400 20px ${fontFamily}`; ctx.fillStyle = "rgba(255,200,80,0.3)";
      ctx.fillText("to get spinning →", cx, cy + 76);
      ctx.textBaseline = "alphabetic"; ctx.restore();
      return;
    }

    // ── Slices ────────────────────────────────────────────────────────────
    const arc = (Math.PI * 2) / n;
    const initialOffset = -arc / 2;
    const outerTextR = r * outerTextRadiusFactor;
    const textRegionW = outerTextR - innerRadius - 10;
    const textRadiusMid = (innerRadius + outerTextR) / 2;

    for (let i = 0; i < n; i++) {
      const start = currentAngle + initialOffset + i * arc;
      const end = start + arc;
      const mid = (start + end) / 2;
      const color = COLORS[i % COLORS.length];
      const textColor = TEXT_COLORS[i % TEXT_COLORS.length];

      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end); ctx.closePath();
      ctx.fillStyle = color; ctx.fill();

      if (n > 1) {
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.lineTo(cx + r * Math.cos(start), cy + r * Math.sin(start));
        ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.lineWidth = 1.5; ctx.stroke();
      }

      ctx.save(); ctx.translate(cx, cy); ctx.rotate(mid);
      const { size: fs, truncated: lbl } = getFontSize(names[i], arc, textRadiusMid, textRegionW, ctx);
      ctx.font = `700 ${fs}px ${fontFamily}`;
      ctx.fillStyle = textColor; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(lbl, innerRadius + 10, 0);
      ctx.textBaseline = "alphabetic"; ctx.restore();
    }

    // ── Rim, hub ──────────────────────────────────────────────────────────
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,208,0,0.2)"; ctx.lineWidth = 3; ctx.stroke();

    ctx.beginPath(); ctx.arc(cx, cy, innerRadius + 3, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0,0,0,0.7)"; ctx.lineWidth = 6; ctx.stroke();

    const hubGrad = ctx.createRadialGradient(cx - 8, cy - 8, 0, cx, cy, innerRadius);
    hubGrad.addColorStop(0, "#ff9500"); hubGrad.addColorStop(0.5, "#ff6b00"); hubGrad.addColorStop(1, "#b84d00");
    ctx.beginPath(); ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = hubGrad; ctx.fill();
    ctx.strokeStyle = "rgba(255,208,0,0.5)"; ctx.lineWidth = 2; ctx.stroke();

    ctx.font = "28px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("🍽️", cx, cy); ctx.textBaseline = "alphabetic";
  }, [names]);

  useEffect(() => { drawWheel(angleRef.current); }, [names, drawWheel]);

  useEffect(() => {
    if (!isSpinning || isSpinRef.current) return;
    isSpinRef.current = true;
    hasSpunRef.current = true;
    cancelAnimationFrame(idleAnimRef.current);

    const totalSpins = spinMinRevolutions + Math.random() * (spinMaxRevolutions - spinMinRevolutions);
    const extraAngle = Math.random() * Math.PI * 2;
    const totalAngle = Math.PI * 2 * totalSpins + extraAngle;
    const duration = spinMinDurationMs + Math.random() * (spinMaxDurationMs - spinMinDurationMs);
    const startTime = performance.now();
    const startAngle = angleRef.current;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

    function animate(now: number) {
      const t = Math.min((now - startTime) / duration, 1);
      const newAngle = startAngle + totalAngle * easeOut(t);
      angleRef.current = newAngle;
      drawWheel(newAngle);
      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        isSpinRef.current = false;
        setAngle(newAngle);
        onSpinEnd(newAngle);
      }
    }
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isSpinning]);

  useEffect(() => {
    if (hasSpunRef.current || isSpinning || names.length === 0) {
      cancelAnimationFrame(idleAnimRef.current);
      return;
    }

    const IDLE_SPEED = 0.002;
    let lastTime = performance.now();

    function idleTick(now: number) {
      const dt = now - lastTime;
      lastTime = now;
      angleRef.current += IDLE_SPEED * (dt / 16.67);
      drawWheel(angleRef.current);

      idleAnimRef.current = requestAnimationFrame(idleTick);
    }

    idleAnimRef.current = requestAnimationFrame(idleTick);
    return () => cancelAnimationFrame(idleAnimRef.current);
  }, [isSpinning, names, drawWheel]);


  const canSpin = !isSpinning && names.length >= 2;

  return (
    <div className="relative w-full max-w-[640px] aspect-square">
      {/* Ambient glow */}
      <div className="absolute pointer-events-none rounded-full transition-all duration-500" style={{
        inset: -32,
        background: isSpinning
          ? "radial-gradient(circle, rgba(255,107,0,0.22) 0%, transparent 65%)"
          : isHovered && canSpin
            ? "radial-gradient(circle, rgba(255,107,0,0.14) 0%, transparent 65%)"
            : "radial-gradient(circle, rgba(255,107,0,0.06) 0%, transparent 65%)",
      }} />

      {/* Pointer arrow */}
      <div className="absolute top-1/2 -translate-y-1/2 -right-7 z-10 transition-[filter] duration-300"
        style={{ filter: `drop-shadow(0 0 10px rgba(255,208,0,${isSpinning ? "0.9" : "0.5"}))` }}>
        <div className="w-0 h-0 transition-[border-right-color] duration-300" style={{
          borderTop: "16px solid transparent",
          borderBottom: "16px solid transparent",
          borderRight: `32px solid ${isSpinning ? "#ffd000" : "#e6bc00"}`,
        }} />
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        onClick={canSpin ? onSpin : undefined}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        className="block relative z-[1] rounded-full w-full h-full transition-transform duration-200"
        style={{
          cursor: canSpin ? "pointer" : isSpinning ? "wait" : "default",
          transform: isHovered && canSpin && !isMobile ? "scale(1.015)" : "scale(1)",
        }}
      />

      {/* Desktop hover tooltip */}
      {!isMobile && isHovered && canSpin && (
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-fade-in-up">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/35 bg-black/90 backdrop-blur-lg whitespace-nowrap">
            <span>🖱️</span>
            <span className="text-[0.82rem] font-semibold text-amber-300">Click anywhere to spin</span>
          </div>
        </div>
      )}

      {/* Mobile tap button */}
      {isMobile && canSpin && (
        <div className="absolute -bottom-[72px] left-1/2 -translate-x-1/2 z-20">
          <button onClick={onSpin}
            className="flex items-center gap-2.5 px-9 py-3.5 rounded-full text-white font-bold text-base tracking-wide animate-tap-pulse"
            style={{ background: "linear-gradient(135deg, #ff6b00 0%, #ff9a00 100%)", WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}>
            <span className="text-xl">👆</span>
            Tap to Spin
          </button>
        </div>
      )}

      {/* Spinning indicator */}
      {isSpinning && (
        <div className={`absolute ${isMobile ? "-bottom-[72px]" : "bottom-[10%]"} left-1/2 -translate-x-1/2 z-20 pointer-events-none`}>
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/90 backdrop-blur-lg whitespace-nowrap"
            style={{ border: "1px solid rgba(255,107,0,0.35)" }}>
            <span className="w-2 h-2 rounded-full animate-tap-pulse inline-block" style={{ background: "#ff6b00" }} />
            <span className="text-[0.84rem] font-semibold" style={{ color: "#ff6b00" }}>Spinning…</span>
          </div>
        </div>
      )}
    </div>
  );
}
