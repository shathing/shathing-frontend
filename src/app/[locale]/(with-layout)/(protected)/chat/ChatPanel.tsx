"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ImageIcon, SendHorizontalIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const mockMessages = [
  { id: 1, mine: false, text: "Hi! Is the drill still available?", time: "10:12" },
  { id: 2, mine: true, text: "Yes, it is available this evening.", time: "10:14" },
  { id: 3, mine: false, text: "Great. Could I pick it up around 8pm?", time: "10:15" },
  { id: 4, mine: true, text: "Sure, 8pm works for me.", time: "10:16" },
  { id: 5, mine: false, text: "Hi! Is the drill still available?", time: "10:12" },
  { id: 6, mine: true, text: "Yes, it is available this evening.", time: "10:14" },
  { id: 7, mine: false, text: "Great. Could I pick it up around 8pm?", time: "10:15" },
  { id: 8, mine: true, text: "Sure, 8pm works for me.", time: "10:16" },
  { id: 9, mine: false, text: "Hi! Is the drill still available?", time: "10:12" },
  { id: 10, mine: true, text: "Yes, it is available this evening.", time: "10:14" },
  { id: 11, mine: false, text: "Great. Could I pick it up around 8pm?", time: "10:15" },
  { id: 12, mine: true, text: "Sure, 8pm works for me.", time: "10:16" },
  { id: 13, mine: false, text: "Hi! Is the drill still available?", time: "10:12" },
  { id: 14, mine: true, text: "Yes, it is available this evening.", time: "10:14" },
  { id: 15, mine: false, text: "Great. Could I pick it up around 8pm?", time: "10:15" },
  { id: 16, mine: true, text: "Sure, 8pm works for me.", time: "10:16" },
];

type ChatPanelProps = {
  chatRoomId?: string;
  className?: string;
};

export default function ChatPanel({ chatRoomId, className }: ChatPanelProps) {
  const t = useTranslations("Chat");

  if (!chatRoomId) {
    return (
      <section className={cn("h-full min-h-0 flex flex-col border-l sm:border-l-0", className)}>
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">{t("start-chat")}</div>
      </section>
    );
  }

  return (
    <section className={cn("h-full min-h-0 flex flex-col", className)}>
      <header className="shrink-0 flex items-center gap-3 border-b px-5 py-3">
        <Avatar>
          <AvatarFallback />
        </Avatar>
        <div>
          <p className="text-sm font-semibold">유저이름</p>
          <p className="text-xs text-muted-foreground">{t("active-now")}</p>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-muted/20 p-5">
          {mockMessages.map((message) => (
            <div key={message.id} className={`flex ${message.mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                  message.mine ? "bg-primary text-primary-foreground" : "bg-background border"
                }`}
              >
                <p>{message.text}</p>
                <p className="mt-1 text-[10px] opacity-70">{message.time}</p>
              </div>
            </div>
          ))}
        </div>

        <footer className="shrink-0 border-t p-3">
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" aria-label={t("attach-image")}>
              <ImageIcon />
            </Button>
            <Input placeholder={t("message-placeholder")} />
            <Button size="icon" aria-label={t("send")}>
              <SendHorizontalIcon />
            </Button>
          </div>
        </footer>
      </div>
    </section>
  );
}
