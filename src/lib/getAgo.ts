import "server-only"

import { getFormatter } from "next-intl/server";

export async function getAgo() {
  const format = await getFormatter();

  const ago = (date: string) => format.relativeTime(new Date(date), new Date)
  return { ago }
}