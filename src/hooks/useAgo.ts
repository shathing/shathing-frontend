import { useFormatter } from "next-intl";

export function useAgo() {
  const format = useFormatter();

  const ago = (date: string) => format.relativeTime(new Date(date), new Date)
  return { ago }
}