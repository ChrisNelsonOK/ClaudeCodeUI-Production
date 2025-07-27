import React from 'react';
import { Search, Plus, Archive, Trash2, MessageSquare, Calendar } from 'lucide-react';
import { useChat } from '../hooks/useChat';

const ConversationSidebar: React.FC = () => {
  const { 
    conversations, 
    currentConversationId, 
    setCurrentConversationId, 
    createNewConversation,
    searchQuery,
    searchMessages,
    exportConversation
  } = useChat();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const groupedConversations = conversations.reduce((groups, conv) => {
    const date = formatDate(conv.updatedAt);
    if (!groups[date]) groups[date] = [];
    groups[date].push(conv);
    return groups;
  }, {} as Record<string, typeof conversations>);

  return (
    <div className="w-80 bg-gray-800/50 backdrop-blur-xl border-r border-gray-700/50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Conversations</h2>
          <button
            onClick={() => createNewConversation()}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => searchMessages(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-gray-700/70 transition-all duration-200"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(groupedConversations).map(([date, convs]) => (
          <div key={date} className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-medium text-gray-400">{date}</h3>
            </div>
            
            <div className="space-y-2">
              {convs.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setCurrentConversationId(conversation.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group hover:bg-gray-700/50 ${
                    currentConversationId === conversation.id 
                      ? 'bg-blue-500/20 border border-blue-500/30' 
                      : 'border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <h4 className="text-white text-sm font-medium truncate">
                          {conversation.title}
                        </h4>
                      </div>
                      
                      {conversation.messages.length > 0 && (
                        <p className="text-xs text-gray-400 truncate">
                          {conversation.messages[conversation.messages.length - 1].content.slice(0, 80)}
                          {conversation.messages[conversation.messages.length - 1].content.length > 80 ? '...' : ''}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {conversation.messages.length} messages
                        </span>
                      </div>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          exportConversation(conversation.id);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                        title="Export conversation"
                      >
                        <Archive className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Delete functionality would go here
                        }}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors duration-200"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {conversations.length === 0 && (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">No conversations yet</p>
            <p className="text-gray-500 text-xs mt-1">Start chatting to see your conversations here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationSidebar;