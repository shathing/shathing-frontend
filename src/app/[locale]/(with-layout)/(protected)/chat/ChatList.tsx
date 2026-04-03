"use client";

import { chatApi } from "@/apis/chat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

const formatListTime = (dateValue?: string) => {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
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
      return [...data].sort((a, b) => {
        if (!a.lastMessageAt) return 1;
        if (!b.lastMessageAt) return -1;
        return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
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
          <Button variant="outline" onClick={() => refetch()}>
            <RotateCcw className="size-4" />
            {t("retry")}
          </Button>
        </div>
      ) : chatList.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-4 text-center text-sm text-muted-foreground">
          {t("empty-rooms")}
        </div>
      ) : (
        <ul className="flex-1 overflow-y-auto">
          {chatList.map((thread) => {
            const isActive = activeRoomId === thread.id.toString();

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
                    <AvatarFallback>{thread.otherMember.username.slice(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{thread.otherMember.username}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatListTime(thread.lastMessageAt ?? undefined)}
                      </span>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{thread.lastMessage ?? ""}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
