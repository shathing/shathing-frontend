"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const chatList = [
  { id: 1, username: "mina", preview: "Could I pick it up tonight?", time: "2m", unread: 2, active: true },
  { id: 2, username: "alex", preview: "Thanks, I will return it tomorrow.", time: "1h", unread: 0, active: false },
  { id: 3, username: "jisu", preview: "Can you share one more photo?", time: "3h", unread: 0, active: false },
  { id: 4, username: "jordan", preview: "I can meet near the station.", time: "1d", unread: 0, active: false },
  { id: 5, username: "sora", preview: "Is this still available?", time: "2d", unread: 0, active: false },
  { id: 6, username: "sora", preview: "Is this still available?", time: "2d", unread: 0, active: false },
  { id: 7, username: "sora", preview: "Is this still available?", time: "2d", unread: 0, active: false },
  { id: 8, username: "sora", preview: "Is this still available?", time: "2d", unread: 0, active: false },
  { id: 9, username: "sora", preview: "Is this still available?", time: "2d", unread: 0, active: false },
  { id: 10, username: "sora", preview: "Is this still available?", time: "2d", unread: 0, active: false },
  { id: 11, username: "mina", preview: "Could I pick it up tonight?", time: "2m", unread: 2, active: true },
  { id: 12, username: "alex", preview: "Thanks, I will return it tomorrow.", time: "1h", unread: 0, active: false },
  { id: 13, username: "jisu", preview: "Can you share one more photo?", time: "3h", unread: 0, active: false },
  { id: 14, username: "jordan", preview: "I can meet near the station.", time: "1d", unread: 0, active: false },
  { id: 15, username: "sora", preview: "Is this still available?", time: "2d", unread: 0, active: false },
  { id: 16, username: "sora", preview: "Is this still available?", time: "2d", unread: 0, active: false },
  { id: 17, username: "sora", preview: "Is this still available?", time: "2d", unread: 0, active: false },
  { id: 18, username: "sora", preview: "Is this still available?", time: "2d", unread: 0, active: false },
  { id: 19, username: "sora", preview: "Is this still available?", time: "2d", unread: 0, active: false },
  { id: 20, username: "sora", preview: "Is this still available?", time: "2d", unread: 0, active: false },
];

export default function ChatList({ className }: { className?: string }) {
  const router = useRouter();

  return (
    <aside className={cn("flex h-full flex-col border-r overflow-scroll", className)}>
      <ul className="flex-1 overflow-y-auto">
        {chatList.map((thread) => (
          <li key={thread.id}>
            <button
              type="button"
              className={`flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-accent ${
                thread.active ? "bg-accent/70" : ""
              }`}
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
        ))}
      </ul>
    </aside>
  );
}
