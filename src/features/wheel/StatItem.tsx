import { cn } from "@/src/lib/utils";
import appConfig from "@/src/config/app.config.json";

const fg  = `hsl(${appConfig.theme.foregroundHsl})`;
const mut = `hsl(${appConfig.theme.mutedHsl})`;

interface Props {
  label: string;
  value: string | number;
  /** Use smaller text for long values (e.g. restaurant names). */
  small?: boolean;
}

/** A single labelled statistic in the WheelStats bar. */
export default function StatItem({ label, value, small }: Props) {
  return (
    <div>
      <div className="text-[0.6rem] uppercase tracking-widest mb-0.5" style={{ color: mut }}>
        {label}
      </div>
      <div
        className={cn(
          "whitespace-nowrap overflow-hidden text-ellipsis",
          small ? "font-semibold text-[0.82rem] max-w-[140px]" : "font-bold text-lg font-mono"
        )}
        style={{ color: fg }}
      >
        {value}
      </div>
    </div>
  );
}
