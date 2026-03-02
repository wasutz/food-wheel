"use client";

import { useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/src/components/ui/dialog";
import type { ModalState } from "@/src/types";
import appConfig from "@/src/config/app.config.json";

const {
  savePrompt, saveSuccess, clearConfirm, clearSuccess,
  cancelLabel, saveListLabel, doneLabel, yesClearLabel, gotItLabel,
  savePlaceholder,
} = appConfig.modal;

const CONFIGS = {
  "save-prompt":   savePrompt,
  "save-success":  saveSuccess,
  "clear-confirm": clearConfirm,
  "clear-success": clearSuccess,
} as const;

interface Props {
  modal: ModalState;
  itemCount: number;
  inputValue: string;
  onInputChange: (val: string) => void;
  onSaveConfirm: (name: string) => void;
  onClearConfirm: () => void;
  onClose: () => void;
}

export default function SaveClearModal({
  modal, itemCount, inputValue, onInputChange,
  onSaveConfirm, onClearConfirm, onClose,
}: Props) {
  // ⚠️ Hook must be unconditional (Rules of Hooks).
  useEffect(() => {
    if (!modal) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && modal.type === "save-prompt") onSaveConfirm(inputValue);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modal, inputValue, onClose, onSaveConfirm]);

  if (!modal) return null;

  const cfg      = CONFIGS[modal.type];
  const isPrompt = modal.type === "save-prompt" || modal.type === "clear-confirm";

  const subtitle =
    modal.type === "save-prompt"   ? `${itemCount} restaurant${itemCount !== 1 ? "s" : ""} will be saved` :
    modal.type === "save-success"  ? `"${(modal as { listName: string }).listName}" saved to your collection.` :
    modal.type === "clear-confirm" ? `This will remove all ${itemCount} restaurant${itemCount !== 1 ? "s" : ""} from the wheel.` :
                                     "Ready for a fresh start. Add new restaurants above.";

  const handlePrimary = () => {
    if (modal.type === "save-prompt")    onSaveConfirm(inputValue);
    else if (modal.type === "clear-confirm") onClearConfirm();
    else onClose();
  };

  const primaryLabel =
    modal.type === "save-prompt"   ? saveListLabel :
    modal.type === "save-success"  ? doneLabel :
    modal.type === "clear-confirm" ? yesClearLabel :
                                     gotItLabel;

  return (
    <Dialog open onOpenChange={open => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <div className={`w-16 h-16 rounded-full border flex items-center justify-center text-3xl mx-auto mb-1 ${cfg.iconBg}`}>
            {cfg.icon}
          </div>
          <DialogTitle>{cfg.title}</DialogTitle>
          <DialogDescription>{subtitle}</DialogDescription>
        </DialogHeader>

        {modal.type === "save-prompt" && (
          <div className="my-2">
            <Input
              autoFocus
              value={inputValue}
              onChange={e => onInputChange(e.target.value)}
              placeholder={savePlaceholder}
              className="text-center bg-white/[0.04] border-white/10 focus-visible:ring-orange-500/40"
            />
          </div>
        )}

        <DialogFooter>
          {isPrompt && (
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-white/10 bg-transparent hover:bg-white/[0.05]"
            >
              {cancelLabel}
            </Button>
          )}
          <Button
            onClick={handlePrimary}
            disabled={modal.type === "save-prompt" && !inputValue.trim()}
            className={
              modal.type === "clear-confirm"
                ? "flex-1 bg-red-500/[0.15] border border-red-500/30 text-red-400 hover:bg-red-500/25 shadow-none"
                : modal.type === "save-prompt"
                  ? "flex-1 bg-amber-400/[0.15] border border-amber-400/30 text-amber-300 hover:bg-amber-400/25 shadow-none"
                  : "flex-1"
            }
            variant={modal.type === "save-success" || modal.type === "clear-success" ? "outline" : "ghost"}
          >
            {primaryLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
