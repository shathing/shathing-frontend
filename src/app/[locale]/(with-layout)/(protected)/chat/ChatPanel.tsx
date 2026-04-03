"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import useChatRoomMessages from "@/hooks/chat/useChatRoomMessages";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ImageIcon, RotateCcw, SendHorizontalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { KeyboardEvent, useState } from "react";

type ChatPanelProps = {
  chatRoomId?: string;
  className?: string;
};

export default function ChatPanel({ chatRoomId, className }: ChatPanelProps) {
  const t = useTranslations("Chat");
  const router = useRouter();
  const [messageInput, setMessageInput] = useState("");
  const {
    hasValidRoomId,
    isRoomConnected,
    isPendingMessages,
    isErrorMessages,
    isFetchingNextPage,
    meUsername,
    messages,
    refetchMessages,
    roomAccessError,
    sendMessage,
    setViewportRef,
    topSentinelRef,
  } = useChatRoomMessages(chatRoomId);

  const handleSendMessage = () => {
    const content = messageInput.trim();
    if (!content) return;
    if (sendMessage(content)) setMessageInput("");
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    handleSendMessage();
  };

  const connectionLabel = isRoomConnected ? t("active-now") : t("connecting");

  if (!chatRoomId) {
    return (
      <section className={cn("h-full min-h-0 flex flex-col border-l sm:border-l-0", className)}>
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">{t("start-chat")}</div>
      </section>
    );
  }

  if (!hasValidRoomId) {
    return (
      <section className={cn("h-full min-h-0 flex flex-col border-l sm:border-l-0", className)}>
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">{t("invalid-room")}</div>
      </section>
    );
  }

  if (roomAccessError) {
    return (
      <section className={cn("h-full min-h-0 flex flex-col border-l sm:border-l-0", className)}>
        <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-sm text-muted-foreground">
            {roomAccessError === "forbidden" ? t("access-denied") : t("room-not-found")}
          </p>
          <Button variant="outline" onClick={() => router.replace("/chat")}>
            {t("back-to-list")}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("h-full min-h-0 flex flex-col", className)}>
      <header className="shrink-0 flex items-center gap-3 border-b px-5 py-3">
        <Avatar>
          <AvatarFallback>{(meUsername ?? String(chatRoomId)).slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold">{t("room-title", { id: chatRoomId })}</p>
          <p className="text-xs text-muted-foreground">{connectionLabel}</p>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        <div ref={setViewportRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-muted/20 p-5">
          {isPendingMessages ? (
            <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
              <Spinner />
              <span>{t("loading-messages")}</span>
            </div>
          ) : isErrorMessages ? (
            <div className="flex h-full items-center justify-center">
              <button
                type="button"
                className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
                onClick={() => refetchMessages()}
              >
                <RotateCcw className="size-4" />
                {t("retry")}
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              {t("empty-messages")}
            </div>
          ) : (
            <>
              <div ref={topSentinelRef} className="h-px" />
              {isFetchingNextPage && (
                <div className="flex justify-center py-2">
                  <Spinner />
                </div>
              )}
              {messages.map((message) => (
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
            </>
          )}
        </div>

        <footer className="shrink-0 border-t p-3">
          <div className="flex items-center gap-2">
            <Input
              placeholder={t("message-placeholder")}
              value={messageInput}
              onChange={(event) => setMessageInput(event.target.value)}
              onKeyDown={handleInputKeyDown}
            />
            <Button
              size="icon"
              aria-label={t("send")}
              disabled={!isRoomConnected || messageInput.trim().length === 0}
              onClick={handleSendMessage}
            >
              <SendHorizontalIcon />
            </Button>
          </div>
        </footer>
      </div>
    </section>
  );
}
