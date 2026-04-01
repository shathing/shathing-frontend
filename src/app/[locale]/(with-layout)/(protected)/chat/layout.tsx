"use client";

import { ReactNode } from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import ChatList from "./ChatList";

export default function Layout({ children }: { children: ReactNode }) {
  const selectedSegment = useSelectedLayoutSegment();
  const isRoomPage = selectedSegment !== null;

  return (
    <div className="h-[calc(100dvh-48px-48px)] overflow-hidden">
      <div className="grid h-full sm:grid-cols-[300px_1fr]">
        <ChatList className={isRoomPage ? "hidden sm:flex" : undefined} />
        {children}
      </div>
    </div>
  );
}
