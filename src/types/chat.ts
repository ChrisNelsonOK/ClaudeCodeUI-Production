export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  isError?: boolean;
  attachments?: Attachment[];
  parentId?: string; // For conversation branching
  children?: string[]; // Child message IDs
}

export interface Attachment {
  id: string;
  type: 'image' | 'document';
  name: string;
  size: number;
  url: string;
  mimeType: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  archived?: boolean;
  tags?: string[];
}

export interface ChatState {
  conversations: Record<string, Conversation>;
  currentConversationId: string | null;
  isLoading: boolean;
  isStreaming: boolean;
  searchQuery: string;
}