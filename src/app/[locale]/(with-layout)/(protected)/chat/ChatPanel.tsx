"use client";

import { chatApi } from "@/apis/chat";
import {
  CHAT_MESSAGE_PAGE_SIZE,
  CHAT_SOCKJS_URL,
  CHAT_STOMP_CONNECT_HEADERS,
  CHAT_STOMP_HEARTBEAT_INCOMING,
  CHAT_STOMP_HEARTBEAT_OUTGOING,
  CHAT_STOMP_RECONNECT_DELAY,
  CHAT_STOMP_SEND_DEST_TEMPLATE,
  CHAT_STOMP_SUBSCRIBE_DEST_TEMPLATE,
  CHAT_WS_URL,
} from "@/constants/chat";
import useGetMe from "@/hooks/apis/useGetMe";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { ChatMessage as ChatMessageModel } from "@/types/models/chat-message";
import { useQuery } from "@tanstack/react-query";
import { Client, IMessage } from "@stomp/stompjs";
import { ImageIcon, RotateCcw, SendHorizontalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";

type ChatMessageItem = {
  id: number;
  mine: boolean;
  text: string;
  time: string;
  createdAt: number;
};

type ChatPanelProps = {
  chatRoomId?: string;
  className?: string;
};

const resolveStompDestination = (template: string, chatRoomId: string) => template.replace("{chatRoomId}", chatRoomId);

const formatMessageTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const toChatMessageItem = (message: ChatMessageModel, myUsername?: string): ChatMessageItem => {
  const createdAt = new Date(message.createdDate).getTime();

  return {
    id: message.id,
    mine: message.sender.username === myUsername,
    text: message.content,
    time: formatMessageTime(createdAt),
    createdAt,
  };
};

const mergeMessages = (initialMessages: ChatMessageItem[], liveMessages: ChatMessageItem[]) => {
  const merged = new Map<number, ChatMessageItem>();
  for (const message of initialMessages) merged.set(message.id, message);
  for (const message of liveMessages) merged.set(message.id, message);
  return [...merged.values()].sort((a, b) => a.createdAt - b.createdAt);
};

export default function ChatPanel({ chatRoomId, className }: ChatPanelProps) {
  const t = useTranslations("Chat");
  const roomId = Number(chatRoomId);
  const hasValidRoomId = Number.isFinite(roomId);
  const { data: me } = useGetMe({ enabled: !!chatRoomId });
  const [connectedRoomId, setConnectedRoomId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [liveMessagesByRoom, setLiveMessagesByRoom] = useState<Record<string, ChatMessageItem[]>>({});
  const clientRef = useRef<Client | null>(null);
  const messageViewportRef = useRef<HTMLDivElement | null>(null);
  const myUsernameRef = useRef<string | undefined>(me?.username);

  useEffect(() => {
    myUsernameRef.current = me?.username;
  }, [me?.username]);

  const {
    data: initialMessageSlice,
    isPending: isPendingMessages,
    isError: isErrorMessages,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["chatApi.getMessages", roomId, me?.username ?? ""],
    enabled: hasValidRoomId,
    queryFn: async () => {
      const { data } = await chatApi.getMessages(roomId, { size: CHAT_MESSAGE_PAGE_SIZE });
      return {
        ...data,
        items: data.items.map((item) => toChatMessageItem(item, me?.username)),
      };
    },
  });

  const initialMessages = initialMessageSlice?.items ?? [];

  useEffect(() => {
    if (!hasValidRoomId || !chatRoomId) return;

    const roomKey = chatRoomId;
    const subscribeDestination = resolveStompDestination(CHAT_STOMP_SUBSCRIBE_DEST_TEMPLATE, chatRoomId);
    setConnectedRoomId(null);

    const client = new Client({
      connectHeaders: CHAT_STOMP_CONNECT_HEADERS,
      reconnectDelay: CHAT_STOMP_RECONNECT_DELAY,
      heartbeatIncoming: CHAT_STOMP_HEARTBEAT_INCOMING,
      heartbeatOutgoing: CHAT_STOMP_HEARTBEAT_OUTGOING,
      ...(CHAT_SOCKJS_URL
        ? {
            webSocketFactory: () => new SockJS(CHAT_SOCKJS_URL) as unknown as WebSocket,
          }
        : {
            brokerURL: CHAT_WS_URL,
          }),
      onConnect: () => {
        setConnectedRoomId(roomKey);
        client.subscribe(subscribeDestination, (stompMessage: IMessage) => {
          try {
            const payload = JSON.parse(stompMessage.body) as ChatMessageModel;
            const nextMessage = toChatMessageItem(payload, myUsernameRef.current);

            setLiveMessagesByRoom((prev) => {
              const roomMessages = prev[roomKey] ?? [];
              return { ...prev, [roomKey]: [...roomMessages, nextMessage] };
            });
          } catch {
            return;
          }
        });
      },
      onStompError: () => setConnectedRoomId((prev) => (prev === roomKey ? null : prev)),
      onWebSocketError: () => setConnectedRoomId((prev) => (prev === roomKey ? null : prev)),
      onWebSocketClose: () => setConnectedRoomId((prev) => (prev === roomKey ? null : prev)),
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      if (clientRef.current === client) clientRef.current = null;
    };
  }, [chatRoomId, hasValidRoomId]);

  const messages = chatRoomId ? mergeMessages(initialMessages, liveMessagesByRoom[chatRoomId] ?? []) : initialMessages;

  const isRoomConnected = Boolean(chatRoomId && connectedRoomId === chatRoomId);

  useEffect(() => {
    const viewport = messageViewportRef.current;
    if (!viewport) return;
    viewport.scrollTop = viewport.scrollHeight;
  }, [messages]);

  const handleSendMessage = () => {
    if (!chatRoomId || !hasValidRoomId) return;
    const content = messageInput.trim();
    if (!content) return;

    const client = clientRef.current;
    if (!client || !client.connected) return;

    const sendDestination = resolveStompDestination(CHAT_STOMP_SEND_DEST_TEMPLATE, chatRoomId);
    client.publish({
      destination: sendDestination,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setMessageInput("");
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const nativeEvent = event.nativeEvent;
    if (nativeEvent.isComposing || nativeEvent.keyCode === 229) return;
    if (event.key !== "Enter" || event.shiftKey) return;
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

  return (
    <section className={cn("h-full min-h-0 flex flex-col", className)}>
      <header className="shrink-0 flex items-center gap-3 border-b px-5 py-3">
        <Avatar>
          <AvatarFallback>{(me?.username ?? String(chatRoomId)).slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold">{t("room-title", { id: chatRoomId })}</p>
          <p className="text-xs text-muted-foreground">{connectionLabel}</p>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        <div ref={messageViewportRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-muted/20 p-5">
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
            messages.map((message) => (
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
            ))
          )}
        </div>

        <footer className="shrink-0 border-t p-3">
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" aria-label={t("attach-image")}>
              <ImageIcon />
            </Button>
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
