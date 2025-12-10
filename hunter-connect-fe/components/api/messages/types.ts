export interface Conversation {
  id: string;
  lastMessage: string;
  lastMessageAt: any;
  participants: string[];
  participantData: any;
  unread?: Record<string, number>; 
}

export interface Message {
  id: string;
  text: string;
  timestamp: any;
  senderId: string;
}
