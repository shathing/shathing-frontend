export interface ChatMessage {
  id: number;
  chatRoomId?: number;
  senderId?: number;
  senderUsername?: string;
  content: string;
  createdDate?: string;
  createdAt?: string;
  mine?: boolean;
}
