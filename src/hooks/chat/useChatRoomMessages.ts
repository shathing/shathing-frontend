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
import { ChatMessage } from "@/types/models/chat-message";
import { useQuery } from "@tanstack/react-query";
import { Client, IMessage } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";

export type ChatMessageItem = {
  id: number;
  mine: boolean;
  text: string;
  time: string;
  createdAt: number;
};

const resolveStompDestination = (template: string, chatRoomId: string) => template.replace("{chatRoomId}", chatRoomId);

const formatMessageTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const toChatMessageItem = (message: ChatMessage, myUsername?: string): ChatMessageItem => {
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

export default function useChatRoomMessages(chatRoomId?: string) {
  const roomId = Number(chatRoomId);
  const hasValidRoomId = Number.isFinite(roomId);
  const { data: me } = useGetMe({ enabled: !!chatRoomId });
  const [connectedRoomId, setConnectedRoomId] = useState<string | null>(null);
  const [liveMessages, setLiveMessages] = useState<ChatMessageItem[]>([]);
  const clientRef = useRef<Client | null>(null);
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

    const subscribeDestination = resolveStompDestination(CHAT_STOMP_SUBSCRIBE_DEST_TEMPLATE, chatRoomId);
    setConnectedRoomId(null);
    setLiveMessages([]);

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
        setConnectedRoomId(chatRoomId);
        client.subscribe(subscribeDestination, (stompMessage: IMessage) => {
          try {
            const payload = JSON.parse(stompMessage.body) as ChatMessage;
            setLiveMessages((prev) => [...prev, toChatMessageItem(payload, myUsernameRef.current)]);
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

    const sendDestination = resolveStompDestination(CHAT_STOMP_SEND_DEST_TEMPLATE, chatRoomId);
    client.publish({
      destination: sendDestination,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ content }),
    });

    return true;
  };

  return {
    hasValidRoomId,
    isRoomConnected: Boolean(chatRoomId && connectedRoomId === chatRoomId),
    isPendingMessages,
    isErrorMessages,
    meUsername: me?.username,
    messages: mergeMessages(initialMessages, liveMessages),
    refetchMessages,
    sendMessage,
  };
}
