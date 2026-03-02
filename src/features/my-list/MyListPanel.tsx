"use client";

import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import NamePill from "./NamePill";
import SaveClearModal from "./SaveClearModal";
import { useMyListState } from "./useMyListState";
import appConfig from "@/src/config/app.config.json";

const { textareaPlaceholder, panelTitle, saveButtonLabel, clearButtonLabel,
        onWheelLabel, footerHint, emptyHint, emptyHintEmphasis, emptyHintSuffix,
        emptyEmoji } = appConfig.myList;
const fg  = `hsl(${appConfig.theme.foregroundHsl})`;
const mut = `hsl(${appConfig.theme.mutedHsl})`;
const bg  = `hsl(${appConfig.theme.cardHsl})`;

interface Props {
  names: string[];
  setNames: (fn: (prev: string[]) => string[]) => void;
  onSaveConfirmed: (listName: string) => void;
}

export default function MyListPanel({ names, setNames, onSaveConfirmed }: Props) {
  const {
    text, saveInput, modal,
    setSaveInput, setModal,
    handleTextChange, removeName,
    openSaveModal, openClearModal,
    confirmSave, confirmClear,
  } = useMyListState({ names, setNames, onSaveConfirmed });

  const isEmpty = names.length === 0;

  return (
    <>
      <div className="flex flex-col gap-3 animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base" style={{ color: fg }}>{panelTitle}</span>
            {!isEmpty && (
              <span
                className="font-mono text-xs font-bold rounded-full px-2.5 py-0.5"
                style={{ color: appConfig.theme.brandOrange, background: "rgba(255,107,0,0.1)", border: "1px solid rgba(255,107,0,0.25)" }}
              >
                {names.length}
              </span>
            )}
          </div>
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" onClick={openSaveModal} disabled={isEmpty}>
              {saveButtonLabel}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={openClearModal}
              disabled={isEmpty}
              className="text-red-400/70 hover:text-red-400 hover:bg-red-400/10"
            >
              {clearButtonLabel}
            </Button>
          </div>
        </div>

        {/* Textarea + pill chips */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.08)", background: bg }}
        >
          <div className="relative">
            <Textarea
              value={text}
              onChange={e => handleTextChange(e.target.value)}
              placeholder={textareaPlaceholder}
              spellCheck={false}
              className="h-52 resize-none rounded-none border-0 border-b bg-transparent font-mono text-sm leading-loose focus-visible:ring-0 focus-visible:ring-offset-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            />
            <span
              className="absolute bottom-2.5 right-3 text-[0.62rem] font-mono opacity-40 pointer-events-none"
              style={{ color: mut }}
            >
              {names.length} entries
            </span>
          </div>

          {!isEmpty ? (
            <div className="p-3">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[1.5px] mb-2" style={{ color: mut }}>
                {onWheelLabel}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {names.map((name, i) => (
                  <NamePill key={i} name={name} onRemove={() => removeName(i)} />
                ))}
              </div>
            </div>
          ) : (
            <div className="p-5 text-center text-sm" style={{ color: mut }}>
              <span className="text-3xl block mb-2 opacity-30">{emptyEmoji}</span>
              {emptyHint}{" "}
              <strong style={{ color: fg }}>{emptyHintEmphasis}</strong>{" "}
              {emptyHintSuffix}
            </div>
          )}
        </div>

        <p className="text-[0.67rem] text-center tracking-wide" style={{ color: mut }}>
          {footerHint}
        </p>
      </div>

      <SaveClearModal
        modal={modal}
        itemCount={names.length}
        inputValue={saveInput}
        onInputChange={setSaveInput}
        onSaveConfirm={confirmSave}
        onClearConfirm={confirmClear}
        onClose={() => setModal(null)}
      />
    </>
  );
}
