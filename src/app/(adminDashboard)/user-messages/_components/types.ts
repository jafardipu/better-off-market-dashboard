export type ChatParticipant = {
  _id: string;
  name: string;
  profile?: string | null;
};

/** The other person in a 1:1 chat, plus the chat's own id. */
export type SelectedUser = ChatParticipant & { chatId?: string };

/** One row as returned by the `chat_list` socket event. */
export type ChatListItem = {
  chat: {
    _id: string;
    participants: ChatParticipant[];
  };
  message: {
    text?: string;
    imageUrl?: string[];
    sender: string;
    createdAt: string;
    seen?: boolean;
  } | null;
  unreadMessageCount?: number;
};

export type ChatMessage = {
  _id: string;
  sender: string;
  receiver?: string;
  text: string;
  imageUrl?: string[];
  createdAt: string;
  updatedAt?: string;
  seen?: boolean;
  chat?: string;
  /** true while an optimistic (not-yet-confirmed) message is in flight */
  _isPending?: boolean;
  _status?: "sending" | "sent";
};

/** Sidebar-friendly projection of a ChatListItem. */
export type Conversation = {
  id: string;
  name: string;
  initials: string;
  online: boolean;
  timestamp: string;
  lastMessage: string;
  unread: boolean;
  profile?: string | null;
};

export type ChatContact = {
  _id: string;
  name: string;
  initials: string;
  profile?: string | null;
  online?: boolean;
};
