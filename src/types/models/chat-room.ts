export interface ChatRoom {
  id: number;
  otherMemberId?: number;
  otherMemberUsername?: string;
  otherMember?: {
    id?: number;
    username?: string;
  };
  lastMessage?: string;
  lastMessageCreatedDate?: string;
  unreadCount?: number;
}
