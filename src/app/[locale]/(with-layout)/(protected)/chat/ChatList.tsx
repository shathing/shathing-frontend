"use client";

import { chatApi } from "@/apis/chat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

type ChatListItem = {
  id: string;
  username: string;
  preview: string;
  time: string;
  unread: number;
  updatedAt?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

const toStringValue = (value: unknown) => (typeof value === "string" ? value : undefined);

const toNumberValue = (value: unknown) => (typeof value === "number" ? value : undefined);

const parseRoomItems = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];

  const candidates = [payload.items, payload.content, payload.rooms, payload.chatRooms, payload.data];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
};

const formatListTime = (dateValue?: string) => {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
};

const normalizeRoom = (payload: unknown): ChatListItem | null => {
  if (!isRecord(payload)) return null;

  const id = toNumberValue(payload.id) ?? Number(payload.id);
  if (!Number.isFinite(id)) return null;

  const otherMember = isRecord(payload.otherMember) ? payload.otherMember : undefined;
  const username =
    toStringValue(payload.otherMemberUsername) ??
    toStringValue(payload.otherUsername) ??
    toStringValue(otherMember?.username) ??
    `room-${id}`;
  const preview =
    toStringValue(payload.lastMessage) ??
    toStringValue(payload.lastMessageContent) ??
    toStringValue(payload.recentMessage) ??
    "";
  const updatedAt =
    toStringValue(payload.lastMessageCreatedDate) ??
    toStringValue(payload.lastMessageCreatedAt) ??
    toStringValue(payload.updatedAt) ??
    toStringValue(payload.createdDate);
  const unread = toNumberValue(payload.unreadCount) ?? toNumberValue(payload.unread) ?? 0;

  return {
    id: String(id),
    username,
    preview,
    time: formatListTime(updatedAt),
    unread,
    updatedAt,
  };
};

export default function ChatList({ className }: { className?: string }) {
  const t = useTranslations("Chat");
  const router = useRouter();
  const pathname = usePathname();

  const {
    data: chatList = [],
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["chatApi.getRooms"],
    queryFn: async () => {
      const { data } = await chatApi.getRooms();
      return parseRoomItems(data)
        .map(normalizeRoom)
        .filter((room): room is ChatListItem => room !== null)
        .sort((a, b) => {
          if (!a.updatedAt) return 1;
          if (!b.updatedAt) return -1;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
    },
  });

  const activeRoomId = pathname?.startsWith("/chat/") ? pathname.split("/")[2] : undefined;

  return (
    <aside className={cn("flex h-full flex-col border-r overflow-hidden", className)}>
      {isPending ? (
        <div className="flex flex-1 items-center justify-center gap-2 text-sm text-muted-foreground">
          <Spinner />
          <span>{t("loading-rooms")}</span>
        </div>
      ) : isError ? (
        <div className="flex flex-1 items-center justify-center">
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
            onClick={() => refetch()}
          >
            <RotateCcw className="size-4" />
            {t("retry")}
          </button>
        </div>
      ) : chatList.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-4 text-center text-sm text-muted-foreground">
          {t("empty-rooms")}
        </div>
      ) : (
        <ul className="flex-1 overflow-y-auto">
          {chatList.map((thread) => {
            const isActive = activeRoomId === thread.id;

            return (
              <li key={thread.id}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-accent",
                    isActive && "bg-accent/70",
                  )}
                  onClick={() => router.push(`/chat/${thread.id}`)}
                >
                  <Avatar>
                    <AvatarFallback>{thread.username.slice(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{thread.username}</p>
                      <span className="text-xs text-muted-foreground">{thread.time}</span>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{thread.preview}</p>
                  </div>
                  {thread.unread > 0 && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                      {thread.unread}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
