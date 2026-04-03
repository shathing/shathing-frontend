"use client";

import { chatApi } from "@/apis/chat";
import useGetMe from "@/hooks/apis/useGetMe";
import { ChatMessage } from "@/types/models/chat-message";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Client, IMessage } from "@stomp/stompjs";
import { useInView } from "react-intersection-observer";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

export type ChatMessageItem = {
  id: number;
  mine: boolean;
  text: string;
  time: string;
  createdAt: number;
};

const formatMessageTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const toChatMessageItem = (message: ChatMessage, myId?: number): ChatMessageItem => {
  const createdAt = new Date(message.createdDate).getTime();

  return {
    id: message.id,
    mine: message.sender.id === myId,
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

export default function useChatRoomMessages(chatRoomId?: string) {
  const roomId = Number(chatRoomId);
  const hasValidRoomId = Number.isFinite(roomId);
  const { data: me } = useGetMe({ enabled: !!chatRoomId });
  const [connectedRoomId, setConnectedRoomId] = useState<string | null>(null);
  const [liveMessages, setLiveMessages] = useState<ChatMessageItem[]>([]);
  const [viewportElement, setViewportElement] = useState<HTMLDivElement | null>(null);
  const clientRef = useRef<Client | null>(null);
  const myIdRef = useRef<number | undefined>(me?.id);
  const messageViewportRef = useRef<HTMLDivElement | null>(null);
  const restoreScrollOffsetRef = useRef<number | null>(null);
  const previousMessagesLengthRef = useRef(0);
  const requestedWhileInViewRef = useRef(false);
  const { ref: topSentinelRef, inView } = useInView({
    root: viewportElement,
    threshold: 0,
  });

  useEffect(() => {
    myIdRef.current = me?.id;
  }, [me?.id]);

  const setViewportRef = useCallback((node: HTMLDivElement | null) => {
    messageViewportRef.current = node;
    setViewportElement(node);
  }, []);

  const {
    data: pagedMessageSlices,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isPending: isPendingMessages,
    isError: isErrorMessages,
    refetch: refetchMessages,
  } = useInfiniteQuery({
    queryKey: ["chatApi.getMessages", roomId, me?.id ?? -1],
    enabled: hasValidRoomId,
    initialPageParam: undefined as number | undefined,
    queryFn: async ({ pageParam }) => {
      const { data } = await chatApi.getMessages(roomId, { size: 30, beforeMessageId: pageParam });
      return {
        ...data,
        items: data.items.map((item) => toChatMessageItem(item, me?.id)),
      };
    },
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursorId ?? undefined : undefined),
  });

  const pagedMessages = pagedMessageSlices?.pages.flatMap((page) => page.items) ?? [];
  const messages = mergeMessages(pagedMessages, liveMessages);

  useEffect(() => {
    if (!hasValidRoomId || !chatRoomId) return;
    setConnectedRoomId(null);
    setLiveMessages([]);

    const client = new Client({
      connectHeaders: {
        "accept-version": "1.2",
        "heart-beat": "10000,10000",
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      brokerURL: process.env.NEXT_PUBLIC_CHAT_WS_URL,
      onConnect: () => {
        setConnectedRoomId(chatRoomId);
        client.subscribe(`/topic/chat/rooms/${chatRoomId}`, (stompMessage: IMessage) => {
          try {
            const payload = JSON.parse(stompMessage.body) as ChatMessage;
            setLiveMessages((prev) => [...prev, toChatMessageItem(payload, myIdRef.current)]);
          } catch {
            return;
          }
        });
      },
      onStompError: () => setConnectedRoomId((prev) => (prev === chatRoomId ? null : prev)),
      onWebSocketError: () => setConnectedRoomId((prev) => (prev === chatRoomId ? null : prev)),
      onWebSocketClose: () => setConnectedRoomId((prev) => (prev === chatRoomId ? null : prev)),
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      if (clientRef.current === client) clientRef.current = null;
    };
  }, [chatRoomId, hasValidRoomId]);

  const sendMessage = (content: string) => {
    if (!chatRoomId || !hasValidRoomId) return false;

    const client = clientRef.current;
    if (!client || !client.connected) return false;

    client.publish({
      destination: `/pub/chat/rooms/${chatRoomId}/messages`,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ content }),
    });

    return true;
  };

  useEffect(() => {
    restoreScrollOffsetRef.current = null;
    previousMessagesLengthRef.current = 0;
    requestedWhileInViewRef.current = false;
  }, [chatRoomId]);

  useLayoutEffect(() => {
    const viewport = messageViewportRef.current;
    if (!viewport) return;

    if (restoreScrollOffsetRef.current !== null) {
      viewport.scrollTop = viewport.scrollHeight - restoreScrollOffsetRef.current;
      restoreScrollOffsetRef.current = null;
      previousMessagesLengthRef.current = messages.length;
      return;
    }

    if (messages.length > previousMessagesLengthRef.current) {
      viewport.scrollTop = viewport.scrollHeight;
    }

    previousMessagesLengthRef.current = messages.length;
  }, [messages.length]);

  useEffect(() => {
    if (!inView) {
      requestedWhileInViewRef.current = false;
      return;
    }

    if (!hasNextPage || isFetchingNextPage || requestedWhileInViewRef.current) return;

    const viewport = messageViewportRef.current;
    if (!viewport) return;

    requestedWhileInViewRef.current = true;
    restoreScrollOffsetRef.current = viewport.scrollHeight - viewport.scrollTop;
    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  return {
    hasValidRoomId,
    hasNextPage,
    isRoomConnected: Boolean(chatRoomId && connectedRoomId === chatRoomId),
    isPendingMessages,
    isErrorMessages,
    isFetchingNextPage,
    meUsername: me?.username,
    messages,
    fetchNextPage,
    refetchMessages,
    sendMessage,
    setViewportRef,
    topSentinelRef,
  };
}
