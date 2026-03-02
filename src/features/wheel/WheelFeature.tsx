"use client";

import { useEffect } from "react";
import appConfig from "@/src/config/app.config.json";
import { useWheelState } from "./useWheelState";
import WheelCanvas from "./WheelCanvas";
import WheelHeader from "./WheelHeader";
import WheelStats from "./WheelStats";
import MyListPanel from "@/src/features/my-list/MyListPanel";
import ExplorePanel from "@/src/features/explore/ExplorePanel";
import SavedPanel from "@/src/features/saved/SavedPanel";
import HistoryPanel from "@/src/features/history/HistoryPanel";
import WinnerModal from "@/src/components/shared/WinnerModal";
import Confetti from "@/src/components/shared/Confetti";
import { cn } from "@/src/lib/utils";
import type { TabId } from "@/src/types";

const TABS = appConfig.tabs as Array<{ id: TabId; label: string; icon: string }>;
const { theme, layout, myList } = appConfig;

export default function WheelFeature() {
  const state = useWheelState();
  const {
    names, history, savedLists, activeTab,
    winner, showWinner, showConfetti, isSpinning, angle, mounted,
    setNames, setAngle, handleSpin, handleSpinEnd,
    closeWinner, removeWinner, handleSaveConfirmed,
    setSavedLists, setHistory, setActiveTab, shuffle, sort,
  } = state;

  // Global keyboard: Space to spin or close winner modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.key === " " && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        if (showWinner) closeWinner(); else handleSpin();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showWinner, handleSpin, closeWinner]);

  // ── Loading state ─────────────────────────────────────────────────────
  if (!mounted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: `hsl(${theme.backgroundHsl})` }}
      >
        <span className="text-5xl animate-spin-glow">{appConfig.app.emoji}</span>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: `hsl(${theme.backgroundHsl})`,
        backgroundImage: theme.backgroundGradient.join(", "),
      }}
    >
      {/* Two-column layout */}
      <div
        className="app-grid grid mx-auto min-h-screen"
        style={{ maxWidth: layout.maxWidth, gridTemplateColumns: `1fr ${layout.sidebarWidth}` }}
      >
        {/* ── LEFT: wheel ── */}
        <div className="wheel-column flex flex-col gap-5 px-10 py-7">
          <WheelHeader onSort={sort} onShuffle={shuffle} />

          <div className="flex-1 flex flex-col items-center justify-center min-h-0">
            <WheelCanvas
              names={names}
              isSpinning={isSpinning}
              angle={angle}
              setAngle={setAngle}
              onSpinEnd={handleSpinEnd}
              onSpin={handleSpin}
            />
            {!isSpinning && names.length >= myList.minRestaurantsToSpin && (
              <p
                className="desktop-hint mt-4 text-[0.68rem] tracking-widest text-center"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                {myList.spacePressHint}{" "}
                <kbd
                  className="font-mono rounded px-1.5 py-0.5 text-[0.65rem]"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  {myList.spaceKeyLabel}
                </kbd>
              </p>
            )}
            {names.length === 1 && (
              <p className="mt-4 text-sm text-center" style={{ color: "rgba(245,158,11,0.6)" }}>
                {myList.minRestaurantsHint.replace("{min}", String(myList.minRestaurantsToSpin))}
              </p>
            )}
          </div>

          <WheelStats names={names} history={history} />
        </div>

        {/* ── RIGHT: sidebar ── */}
        <div
          className="flex flex-col h-screen sticky top-0 overflow-hidden"
          style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* Tab bar */}
          <div
            className="flex px-4 pt-4 gap-0.5 shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-0.5 pb-2.5 pt-2",
                  "text-[0.78rem] font-medium border-b-2 transition-all duration-150 cursor-pointer bg-transparent",
                  activeTab === t.id ? "font-bold" : ""
                )}
                style={{
                  position: "relative", bottom: -1,
                  borderBottomColor: activeTab === t.id ? theme.brandOrange : "transparent",
                  color: activeTab === t.id ? `hsl(${theme.foregroundHsl})` : `hsl(${theme.mutedHsl})`,
                }}
              >
                <span className="text-[0.55rem] opacity-40">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className="flex-1 overflow-y-auto p-4 pb-7">
            {activeTab === "my-list" && (
              <MyListPanel names={names} setNames={setNames} onSaveConfirmed={handleSaveConfirmed} />
            )}
            {activeTab === "explore" && (
              <ExplorePanel
                onUse={places => { setNames(() => places); setActiveTab("my-list"); }}
                onAdd={places => setNames(prev => [...new Set([...prev, ...places])])}
              />
            )}
            {activeTab === "saved" && (
              <SavedPanel
                savedLists={savedLists}
                setSavedLists={setSavedLists}
                onLoad={sl => { setNames(() => sl.names); setActiveTab("my-list"); }}
              />
            )}
            {activeTab === "history" && (
              <HistoryPanel history={history} onClear={() => setHistory(() => [])} />
            )}
          </div>
        </div>
      </div>

      {showWinner && winner && (
        <WinnerModal winner={winner} onClose={closeWinner} onRemove={removeWinner} />
      )}
      {showConfetti && <Confetti />}
    </div>
  );
}
