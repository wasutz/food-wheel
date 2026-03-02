type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | { [key: string]: boolean }
  | ClassValue[];

function clsx(...inputs: ClassValue[]): string {
  return inputs
    .flat(Infinity as 0)
    .filter(Boolean)
    .map((v) => {
      if (typeof v === "object" && v !== null) {
        return Object.entries(v as Record<string, boolean>)
          .filter(([, val]) => Boolean(val))
          .map(([key]) => key)
          .join(" ");
      }
      return String(v);
    })
    .join(" ");
}

export function cn(...inputs: ClassValue[]): string {
  return clsx(...inputs);
}
