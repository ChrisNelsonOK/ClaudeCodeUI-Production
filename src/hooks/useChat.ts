import { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, Conversation, Attachment } from '../types/chat';
import { useApp } from '../context/AppContext';
import { storage } from '../utils/storage';

export const useChat = () => {
  const { addNotification } = useApp();
  const [conversations, setConversations] = useState<Record<string, Conversation>>(() => {
    return storage.load<Record<string, Conversation>>('conversations') || {};
  });
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const currentConversation = currentConversationId ? conversations[currentConversationId] : null;

  // Persist conversations to storage whenever they change
  useEffect(() => {
    storage.save('conversations', conversations);
  }, [conversations]);

  const createNewConversation = useCallback((title?: string) => {
    const id = uuidv4();
    const conversation: Conversation = {
      id,
      title: title || 'New Conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    setConversations(prev => ({ ...prev, [id]: conversation }));
    setCurrentConversationId(id);
    
    addNotification({
      type: 'success',
      title: 'New Conversation',
      message: 'Started a new conversation',
      duration: 2000
    });
    
    return id;
  }, [addNotification]);

  const addMessage = useCallback((conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    const id = uuidv4();
    const newMessage: Message = {
      ...message,
      id,
      timestamp: Date.now(),
    };

    setConversations(prev => {
      const conversation = prev[conversationId];
      if (!conversation) return prev;

      const updatedConversation = {
        ...conversation,
        messages: [...conversation.messages, newMessage],
        updatedAt: Date.now(),
        title: conversation.messages.length === 0 && message.type === 'user' 
          ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
          : conversation.title
      };

      return { ...prev, [conversationId]: updatedConversation };
    });

    return id;
  }, []);

  const updateMessage = useCallback((conversationId: string, messageId: string, updates: Partial<Message>) => {
    setConversations(prev => {
      const conversation = prev[conversationId];
      if (!conversation) return prev;

      const updatedMessages = conversation.messages.map(msg =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      );

      return {
        ...prev,
        [conversationId]: {
          ...conversation,
          messages: updatedMessages,
          updatedAt: Date.now()
        }
      };
    });
  }, []);

  const deleteMessage = useCallback((conversationId: string, messageId: string) => {
    setConversations(prev => {
      const conversation = prev[conversationId];
      if (!conversation) return prev;

      const updatedMessages = conversation.messages.filter(msg => msg.id !== messageId);

      return {
        ...prev,
        [conversationId]: {
          ...conversation,
          messages: updatedMessages,
          updatedAt: Date.now()
        }
      };
    });

    addNotification({
      type: 'info',
      title: 'Message Deleted',
      message: 'Message has been removed from conversation',
      duration: 2000
    });
  }, [addNotification]);

  const sendMessage = useCallback(async (content: string, attachments?: Attachment[]) => {
    if (!content.trim()) return;

    let conversationId = currentConversationId;
    if (!conversationId) {
      conversationId = createNewConversation();
    }

    // Add user message
    const userMessageId = addMessage(conversationId, {
      type: 'user',
      content,
      attachments
    });

    // Add streaming assistant message
    const assistantMessageId = addMessage(conversationId, {
      type: 'assistant',
      content: '',
      isStreaming: true
    });

    setIsLoading(true);
    setIsStreaming(true);

    try {
      // Simulate Claude API call with streaming
      abortControllerRef.current = new AbortController();
      
      // Simulate streaming response
      const simulatedResponse = `I'd be happy to help you with that! Here's my response to: "${content}"

This is a simulated Claude response that demonstrates the streaming capability. In a real implementation, this would connect to the actual Anthropic Claude API.

**Key points:**
- Real-time streaming responses
- Message persistence and conversation management  
- Support for attachments and multimedia content
- Advanced chat features like message editing and regeneration

The system is designed to handle complex conversations with branching, search capabilities, and export functionality.`;

      let currentContent = '';
      const words = simulatedResponse.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        if (abortControllerRef.current?.signal.aborted) break;
        
        currentContent += (i > 0 ? ' ' : '') + words[i];
        
        updateMessage(conversationId, assistantMessageId, {
          content: currentContent,
          isStreaming: i < words.length - 1
        });
        
        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
      }

      updateMessage(conversationId, assistantMessageId, {
        content: currentContent,
        isStreaming: false
      });

    } catch (error) {
      updateMessage(conversationId, assistantMessageId, {
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        isStreaming: false,
        isError: true
      });

      addNotification({
        type: 'error',
        title: 'Message Failed',
        message: 'Unable to get response from Claude',
        duration: 4000
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [currentConversationId, createNewConversation, addMessage, updateMessage, addNotification]);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      addNotification({
        type: 'info',
        title: 'Generation Stopped',
        message: 'Response generation has been cancelled',
        duration: 2000
      });
    }
  }, [addNotification]);

  const regenerateMessage = useCallback(async (conversationId: string, messageId: string) => {
    const conversation = conversations[conversationId];
    if (!conversation) return;

    const messageIndex = conversation.messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1 || messageIndex === 0) return;

    const previousMessage = conversation.messages[messageIndex - 1];
    if (previousMessage.type !== 'user') return;

    // Remove the current assistant message and regenerate
    deleteMessage(conversationId, messageId);
    setCurrentConversationId(conversationId);
    
    await sendMessage(previousMessage.content, previousMessage.attachments);
  }, [conversations, deleteMessage, sendMessage]);

  const exportConversation = useCallback((conversationId: string, format: 'json' | 'markdown' | 'txt' = 'json') => {
    const conversation = conversations[conversationId];
    if (!conversation) return;

    let content = '';
    
    if (format === 'json') {
      content = JSON.stringify(conversation, null, 2);
    } else if (format === 'markdown') {
      content = `# ${conversation.title}\n\n`;
      conversation.messages.forEach(msg => {
        content += `## ${msg.type === 'user' ? 'User' : 'Claude'}\n${msg.content}\n\n`;
      });
    } else {
      content = `${conversation.title}\n${'='.repeat(conversation.title.length)}\n\n`;
      conversation.messages.forEach(msg => {
        content += `${msg.type === 'user' ? 'User' : 'Claude'}: ${msg.content}\n\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversation.title.replace(/[^\w\s-]/g, '')}.${format}`;
    a.click();
    URL.revokeObjectURL(url);

    addNotification({
      type: 'success',
      title: 'Conversation Exported',
      message: `Downloaded as ${format.toUpperCase()} file`,
      duration: 3000
    });
  }, [conversations, addNotification]);

  const searchMessages = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const filteredConversations = Object.values(conversations).filter(conv => {
    if (!searchQuery) return true;
    
    const queryLower = searchQuery.toLowerCase();
    return conv.title.toLowerCase().includes(queryLower) ||
           conv.messages.some(msg => msg.content.toLowerCase().includes(queryLower));
  });

  return {
    conversations: filteredConversations,
    currentConversation,
    currentConversationId,
    isLoading,
    isStreaming,
    searchQuery,
    createNewConversation,
    setCurrentConversationId,
    sendMessage,
    stopGeneration,
    deleteMessage,
    regenerateMessage,
    exportConversation,
    searchMessages,
  };
};