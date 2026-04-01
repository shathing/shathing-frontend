const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
const fallbackWsUrl = `${apiBaseUrl.replace(/^http/, "ws")}/ws-chat`;
const configuredWsUrl = process.env.NEXT_PUBLIC_CHAT_WS_URL || fallbackWsUrl;
const configuredSockJsUrl = process.env.NEXT_PUBLIC_CHAT_SOCKJS_URL || "";

export const CHAT_WS_URL = configuredWsUrl.replace(/^http/, "ws");
export const CHAT_SOCKJS_URL = configuredSockJsUrl;

export const CHAT_STOMP_SUBSCRIBE_DEST_TEMPLATE =
  process.env.NEXT_PUBLIC_CHAT_STOMP_SUBSCRIBE_DEST_TEMPLATE ?? "/topic/chat/rooms/{chatRoomId}";

export const CHAT_STOMP_SEND_DEST_TEMPLATE =
  process.env.NEXT_PUBLIC_CHAT_STOMP_SEND_DEST_TEMPLATE ?? "/pub/chat/rooms/{chatRoomId}/messages";

export const CHAT_STOMP_CONNECT_HEADERS: Record<string, string> = {
  "accept-version": "1.2",
  "heart-beat": "10000,10000",
};

export const CHAT_STOMP_RECONNECT_DELAY = 5000;
export const CHAT_STOMP_HEARTBEAT_INCOMING = 10000;
export const CHAT_STOMP_HEARTBEAT_OUTGOING = 10000;
export const CHAT_MESSAGE_PAGE_SIZE = 30;
