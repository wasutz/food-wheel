/** A single entry in the spin history. */
export interface HistoryEntry {
  name: string;
  time: string;
}

/** A persisted list of restaurant names with metadata. */
export interface SavedList {
  name: string;
  names: string[];
  date: string;
}

/** Union of all sidebar tab identifiers (must match `config.tabs[].id`). */
export type TabId = "my-list" | "explore" | "saved" | "history";

/** A single tab descriptor as stored in config. */
export interface TabConfig {
  id: TabId;
  label: string;
  icon: string;
}

// ── Modal types (used by my-list feature) ───────────────────────────────────

export type ModalType =
  | "save-prompt"
  | "save-success"
  | "clear-confirm"
  | "clear-success";

export type ModalState =
  | { type: "save-prompt" }
  | { type: "save-success"; listName: string }
  | { type: "clear-confirm" }
  | { type: "clear-success" }
  | null;

// ── Wheel feature hook shapes ────────────────────────────────────────────────

export interface WheelState {
  names: string[];
  history: HistoryEntry[];
  savedLists: SavedList[];
  activeTab: TabId;
  winner: string | null;
  showWinner: boolean;
  showConfetti: boolean;
  isSpinning: boolean;
  angle: number;
  mounted: boolean;
}

export interface WheelActions {
  setNames: (fn: (prev: string[]) => string[]) => void;
  setAngle: (a: number) => void;
  handleSpin: () => void;
  handleSpinEnd: (finalAngle: number) => void;
  closeWinner: () => void;
  removeWinner: () => void;
  handleSaveConfirmed: (listName: string) => void;
  setSavedLists: (fn: (prev: SavedList[]) => SavedList[]) => void;
  setHistory: (fn: (prev: HistoryEntry[]) => HistoryEntry[]) => void;
  setActiveTab: (tab: TabId) => void;
  shuffle: () => void;
  sort: () => void;
}
