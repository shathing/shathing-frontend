export interface CreateChatRoomRequest {
  otherMemberId: number;
}

export interface GetChatRoomMessagesRequest {
  beforeMessageId?: number;
  size?: number;
}
