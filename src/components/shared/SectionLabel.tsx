import type { ReactNode } from "react";

/**
 * A small all-caps section label used across multiple feature panels.
 * Extracted to eliminate copy-paste between StoreBrowseView and StoreDetailView.
 */
export default function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.63rem] font-semibold uppercase tracking-[1.5px] text-muted-foreground">
      {children}
    </p>
  );
}
