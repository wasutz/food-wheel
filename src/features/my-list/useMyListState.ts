"use client";

import { useEffect, useRef, useState } from "react";
import type { ModalState } from "@/src/types";
import appConfig from "@/src/config/app.config.json";

interface Params {
  names: string[];
  setNames: (fn: (prev: string[]) => string[]) => void;
  onSaveConfirmed: (listName: string) => void;
}

const { saveNamePrefix } = appConfig.myList;

export function useMyListState({ names, setNames, onSaveConfirmed }: Params) {
  const [text, setText]           = useState(names.join("\n"));
  const [saveInput, setSaveInput] = useState("");
  const [modal, setModal]         = useState<ModalState>(null);
  const syncFromExternal          = useRef(true);

  // Keep textarea in sync when names are changed externally (e.g. Explore → use list)
  useEffect(() => {
    if (syncFromExternal.current) setText(names.join("\n"));
  }, [names]);

  const applyNames = (newNames: string[]) => {
    syncFromExternal.current = false;
    setNames(() => newNames);
    setText(newNames.join("\n"));
    setTimeout(() => { syncFromExternal.current = true; }, 0);
  };

  const handleTextChange = (val: string) => {
    syncFromExternal.current = false;
    setText(val);
    const parsed = val.split("\n").map(n => n.trim()).filter(Boolean);
    setNames(() => parsed);
    setTimeout(() => { syncFromExternal.current = true; }, 0);
  };

  const removeName = (idx: number) => applyNames(names.filter((_, i) => i !== idx));

  const openSaveModal = () => {
    const num = Math.floor(Math.random() * 90 + 10);
    setSaveInput(`${saveNamePrefix} ${num}`);
    setModal({ type: "save-prompt" });
  };

  const openClearModal = () => setModal({ type: "clear-confirm" });

  const confirmSave = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSaveConfirmed(trimmed);
    setModal({ type: "save-success", listName: trimmed });
  };

  const confirmClear = () => {
    applyNames([]);
    setModal({ type: "clear-success" });
  };

  return {
    text, saveInput, modal,
    setSaveInput, setModal,
    handleTextChange, removeName,
    openSaveModal, openClearModal,
    confirmSave, confirmClear,
  };
}
