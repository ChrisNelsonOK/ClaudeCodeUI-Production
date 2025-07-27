import React, { useState } from 'react';
import ChatInterface from './ChatInterface';
import StatusBar from './StatusBar';
import { Send, Paperclip, Mic, Image, FileText, Plus, Square } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { useApp } from '../context/AppContext';

interface MainContentProps {
  onOpenFlyout: (type: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({ onOpenFlyout }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { sendMessage, createNewConversation, currentConversation, isStreaming, stopGeneration } = useChat();
  const { addNotification } = useApp();

  const handleSend = async () => {
    if (message.trim()) {
      await sendMessage(message.trim());
      setMessage('');
    }
  };

  const handleNewChat = () => {
    createNewConversation();
    addNotification({
      type: 'success',
      title: 'New Chat',
      message: 'Started a fresh conversation',
      duration: 2000
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <StatusBar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatInterface />
        
        {/* Input Area */}
        <div className="p-6 border-t border-gray-700/50 bg-gray-800/30 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            {/* Quick Actions Bar */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleNewChat}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-200 border border-blue-500/30"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">New Chat</span>
              </button>
              
              {currentConversation && (
                <div className="text-sm text-gray-400">
                  {currentConversation.messages.length} messages
                </div>
              )}
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-4 shadow-2xl">
              <div className="flex items-end space-x-4">
                {/* Attachment Buttons */}
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onOpenFlyout('vision')}
                    className="p-3 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-200"
                    title="Attach Image"
                  >
                    <Image className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => onOpenFlyout('documents')}
                    className="p-3 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-xl transition-all duration-200"
                    title="Attach Document"
                  >
                    <FileText className="w-5 h-5" />
                  </button>
                  <button className="p-3 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-xl transition-all duration-200">
                    <Paperclip className="w-5 h-5" />
                  </button>
                </div>

                {/* Message Input */}
                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={currentConversation ? "Continue the conversation..." : "Ask Claude anything to start a new chat..."}
                    className="w-full bg-transparent text-white placeholder-gray-400 resize-none border-none outline-none min-h-[60px] max-h-32 py-3 pr-12"
                    disabled={isStreaming}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (!isStreaming) {
                          handleSend();
                        }
                      }
                    }}
                  />
                  
                  {/* Character Counter */}
                  <div className="absolute bottom-1 right-1 text-xs text-gray-500">
                    {message.length}/4000
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    disabled={isStreaming}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      isRecording 
                        ? 'text-red-400 bg-red-500/10 animate-pulse' 
                        : `text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 ${isStreaming ? 'opacity-50 cursor-not-allowed' : ''}`
                    }`}
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                  
                  {isStreaming ? (
                    <button
                      onClick={stopGeneration}
                      className="p-3 rounded-xl transition-all duration-200 text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25"
                      title="Stop generation"
                    >
                      <Square className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSend}
                      disabled={!message.trim()}
                      className={`p-3 rounded-xl transition-all duration-200 ${
                        message.trim()
                          ? 'text-white bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/25'
                          : 'text-gray-500 bg-gray-700/50 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;