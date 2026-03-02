"use client";

import { useCallback, useEffect, useState } from "react";
import type { HistoryEntry, SavedList, TabId, WheelState, WheelActions } from "@/src/types";
import { DEFAULT_RESTAURANTS } from "@/src/data/restaurants.data";
import appConfig from "@/src/config/app.config.json";
import {
  computeWinner, createHistoryEntry,
  loadStorageState, saveToStorage,
  shuffleArray, sortThaiLocale,
} from "./wheel.utils";

const { keys } = appConfig.storage;

export function useWheelState(): WheelState & WheelActions {
  const [names, setNames]               = useState<string[]>([]);
  const [history, setHistory]           = useState<HistoryEntry[]>([]);
  const [savedLists, setSavedLists]     = useState<SavedList[]>([]);
  const [activeTab, setActiveTab]       = useState<TabId>("my-list");
  const [winner, setWinner]             = useState<string | null>(null);
  const [showWinner, setShowWinner]     = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSpinning, setIsSpinning]     = useState(false);
  const [angle, setAngle]               = useState(0);
  const [mounted, setMounted]           = useState(false);

  // ── Hydration: read from localStorage only on client ──────────────────
  useEffect(() => {
    const stored = loadStorageState();
    setNames(stored.names     ?? DEFAULT_RESTAURANTS);
    setHistory(stored.history ?? []);
    setSavedLists(stored.saved ?? []);
    setMounted(true);
  }, []);

  // ── Persistence ────────────────────────────────────────────────────────
  useEffect(() => { if (mounted) saveToStorage(keys.names,   names);      }, [names,      mounted]);
  useEffect(() => { if (mounted) saveToStorage(keys.history, history);    }, [history,    mounted]);
  useEffect(() => { if (mounted) saveToStorage(keys.saved,   savedLists); }, [savedLists, mounted]);

  // ── Spin handlers ──────────────────────────────────────────────────────
  const handleSpin = useCallback(() => {
    if (!isSpinning && names.length >= 2) setIsSpinning(true);
  }, [isSpinning, names.length]);

  const handleSpinEnd = useCallback((finalAngle: number) => {
    if (names.length === 0) return;
    const winnerName = computeWinner(finalAngle, names);
    setWinner(winnerName);
    setShowWinner(true);
    setShowConfetti(true);
    setIsSpinning(false);
    setAngle(finalAngle);
    setHistory(prev => [createHistoryEntry(winnerName), ...prev]);
    setTimeout(() => setShowConfetti(false), appConfig.wheel.confettiDurationMs);
  }, [names]);

  const closeWinner  = useCallback(() => { setShowWinner(false); setWinner(null); }, []);
  const removeWinner = useCallback(() => {
    if (winner) setNames(prev => prev.filter(n => n !== winner));
    closeWinner();
  }, [winner, closeWinner]);

  const handleSaveConfirmed = useCallback((listName: string) => {
    if (!listName || names.length === 0) return;
    setSavedLists(prev => [
      ...prev,
      { name: listName, names: [...names], date: new Date().toLocaleDateString() },
    ]);
  }, [names]);

  const shuffle = useCallback(() => setNames(prev => shuffleArray(prev)), []);
  const sort    = useCallback(() => setNames(prev => sortThaiLocale(prev)), []);

  return {
    // state
    names, history, savedLists, activeTab,
    winner, showWinner, showConfetti,
    isSpinning, angle, mounted,
    // actions
    setNames, setAngle, handleSpin, handleSpinEnd,
    closeWinner, removeWinner, handleSaveConfirmed,
    setSavedLists, setHistory, setActiveTab,
    shuffle, sort,
  };
}
