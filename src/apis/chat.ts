import http from "./config";
import { CreateChatRoomRequest, GetChatRoomMessagesRequest } from "@/types/apis/chat";
import { ChatRoom } from "@/types/models/chat-room";

export const chatApi = {
  /** 채팅방 생성 */
  createRoom: (request: CreateChatRoomRequest) => http.post<ChatRoom>("/chat/rooms", request),

  /** 채팅방 목록 조회 */
  getRooms: () => http.get("/chat/rooms"),

  /** 채팅 메시지 조회 */
  getMessages: (roomId: number, request?: GetChatRoomMessagesRequest) =>
    http.get(`/chat/rooms/${roomId}/messages`, { params: request }),
};
