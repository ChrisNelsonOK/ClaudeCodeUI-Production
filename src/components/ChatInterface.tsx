import React from 'react';
import { Bot, User, Copy, ThumbsUp, ThumbsDown, RotateCcw, Download, Trash2, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useChat } from '../hooks/useChat';
import { useApp } from '../context/AppContext';
import LoadingSpinner from './LoadingSpinner';

const ChatInterface: React.FC = () => {
  const { 
    currentConversation, 
    isStreaming, 
    deleteMessage, 
    regenerateMessage, 
    exportConversation,
    stopGeneration 
  } = useChat();
  const { addNotification } = useApp();

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      addNotification({
        type: 'success',
        title: 'Copied!',
        message: 'Message copied to clipboard',
        duration: 2000
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Copy Failed',
        message: 'Unable to copy to clipboard',
        duration: 3000
      });
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!currentConversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to Claude Code</h2>
          <p className="text-gray-400">Start a new conversation to begin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Conversation Header */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
          <h1 className="text-xl font-bold text-white">{currentConversation.title}</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => exportConversation(currentConversation.id)}
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
              title="Export Conversation"
            >
              <Download className="w-4 h-4" />
            </button>
            {isStreaming && (
              <button
                onClick={stopGeneration}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                title="Stop Generation"
              >
                <Square className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {currentConversation.messages.map((message) => (
          <div
            key={message.id}
            className={`flex space-x-4 ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.type === 'assistant' && (
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            
            <div className={`max-w-3xl ${message.type === 'user' ? 'order-1' : ''}`}>
              <div
                className={`p-4 rounded-2xl ${
                  message.isError ? 'border border-red-500/50 bg-red-500/10' :
                  message.type === 'user'
                    ? 'bg-blue-500 text-white ml-12'
                    : 'bg-gray-800/50 backdrop-blur-xl border border-gray-700/50'
                }`}
              >
                <div className="prose prose-invert max-w-none">
                  {message.type === 'assistant' ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={atomDark}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className="bg-gray-700 px-1 py-0.5 rounded text-sm" {...props}>
                              {children}
                            </code>
                          );
                        },
                        h4: ({ children }) => (
                          <h4 className="text-blue-400 font-semibold mt-4 mb-2">{children}</h4>
                        ),
                        p: ({ children }) => (
                          <p className="text-gray-200 mb-2">{children}</p>
                        ),
                        li: ({ children }) => (
                          <li className="text-gray-300 ml-4">{children}</li>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-current">{message.content}</p>
                  )}
                  
                  {message.isStreaming && (
                    <div className="flex items-center space-x-2 mt-2">
                      <LoadingSpinner size="sm" />
                      <span className="text-xs text-gray-400">Claude is typing...</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-2 px-1">
                <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                
                {message.type === 'assistant' && (
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => copyToClipboard(message.content)}
                      className="p-1 text-gray-500 hover:text-blue-400 transition-colors duration-200"
                      title="Copy message"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-green-400 transition-colors duration-200">
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-red-400 transition-colors duration-200">
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => regenerateMessage(currentConversation.id, message.id)}
                      className="p-1 text-gray-500 hover:text-purple-400 transition-colors duration-200"
                      title="Regenerate response"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteMessage(currentConversation.id, message.id)}
                      className="p-1 text-gray-500 hover:text-red-400 transition-colors duration-200"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {message.type === 'user' && (
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {currentConversation.messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">This conversation is empty. Send a message to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;