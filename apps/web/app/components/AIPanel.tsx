'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { 
  Bot, 
  Send, 
  Copy, 
  Check, 
  X, 
  Lightbulb,
  Shield,
  Settings,
  FileText,
  BookOpen,
  Play,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isCode?: boolean;
  language?: string;
}

interface AIPanelProps {
  selectedCode?: string;
  onApplyCode?: (code: string) => void;
  onExplainCode?: (code: string) => void;
  onOptimizeCode?: (code: string) => void;
  onGenerateTests?: (code: string) => void;
  onSecurityReview?: (code: string) => void;
}

export default function AIPanel({
  selectedCode,
  onApplyCode,
  onExplainCode,
  onOptimizeCode,
  onGenerateTests,
  onSecurityReview
}: AIPanelProps) {
  const [activeTab, setActiveTab] = useState<'assistant' | 'output' | 'docs'>('assistant');
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI coding assistant. I can help you with Solana development, explain code, optimize performance, review security, and much more. What would you like to work on?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I understand you're asking about: "${inputValue}". Here's my response with some helpful information about Solana development...`,
        timestamp: new Date(),
        isCode: inputValue.toLowerCase().includes('code') || inputValue.toLowerCase().includes('example'),
        language: 'rust'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleQuickAction = async (action: string) => {
    if (!selectedCode) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: 'Please select some code first to use this feature.',
        timestamp: new Date()
      }]);
      return;
    }

    const actionMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: `${action} this code: ${selectedCode}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, actionMessage]);
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Here's the ${action.toLowerCase()} for your code:`,
        timestamp: new Date(),
        isCode: true,
        language: 'rust'
      };

      setMessages(prev => [...prev, response]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message: AIMessage) => {
    const isUser = message.type === 'user';
    
    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
          <div className={`flex items-start space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser ? 'bg-blue-600' : 'bg-gray-700'
            }`}>
              {isUser ? (
                <span className="text-white text-sm font-bold">U</span>
              ) : (
                <Bot className="h-4 w-4 text-white" />
              )}
            </div>
            
            <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-3 rounded-lg ${
                isUser 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-100'
              }`}>
                {message.isCode ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{message.language}</span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleCopyMessage(message.id, message.content)}
                          className="p-1 hover:bg-gray-700 rounded transition-colors"
                        >
                          {copiedMessageId === message.id ? (
                            <Check className="h-3 w-3 text-green-400" />
                          ) : (
                            <Copy className="h-3 w-3 text-gray-400" />
                          )}
                        </button>
                        {onApplyCode && (
                          <button
                            onClick={() => onApplyCode(message.content)}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                          >
                            <Check className="h-3 w-3 text-blue-400" />
                          </button>
                        )}
                      </div>
                    </div>
                    <pre className="text-sm overflow-x-auto">
                      <code>{message.content}</code>
                    </pre>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
              <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 border-l border-gray-800">
      {/* Tab Header */}
      <div className="bg-black border-b border-gray-800 flex">
        <button
          onClick={() => setActiveTab('assistant')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 transition-colors ${
            activeTab === 'assistant'
              ? 'bg-gray-900 text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Bot className="h-4 w-4" />
          <span className="text-sm font-medium">AI Assistant</span>
        </button>
        <button
          onClick={() => setActiveTab('output')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 transition-colors ${
            activeTab === 'output'
              ? 'bg-gray-900 text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Play className="h-4 w-4" />
          <span className="text-sm font-medium">Output</span>
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 transition-colors ${
            activeTab === 'docs'
              ? 'bg-gray-900 text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span className="text-sm font-medium">Docs</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'assistant' && (
          <>
            {/* Quick Actions */}
            {selectedCode && (
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickAction('Explain')}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 text-xs"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Explain
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickAction('Optimize')}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 text-xs"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Optimize
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickAction('Generate tests for')}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 text-xs"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Tests
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickAction('Review security of')}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 text-xs"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Security
                  </Button>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-auto p-4">
              {messages.map(renderMessage)}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex space-x-2">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about Solana development..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  rows={2}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'output' && (
          <div className="flex-1 p-4">
            <div className="space-y-4">
              {/* Compilation Status */}
              <Card className="bg-gray-800 border-gray-700 p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <h3 className="text-sm font-semibold text-white">Compilation</h3>
                </div>
                <p className="text-sm text-gray-300">Last compiled successfully</p>
                <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
              </Card>

              {/* Test Results */}
              <Card className="bg-gray-800 border-gray-700 p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Play className="h-5 w-5 text-blue-400" />
                  <h3 className="text-sm font-semibold text-white">Tests</h3>
                </div>
                <p className="text-sm text-gray-300">3 tests passed, 0 failed</p>
                <p className="text-xs text-gray-500 mt-1">1.2s execution time</p>
              </Card>

              {/* Deployment Status */}
              <Card className="bg-gray-800 border-gray-700 p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="h-5 w-5 text-yellow-400" />
                  <h3 className="text-sm font-semibold text-white">Deployment</h3>
                </div>
                <p className="text-sm text-gray-300">Ready to deploy</p>
                <p className="text-xs text-gray-500 mt-1">Not deployed yet</p>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="flex-1 p-4">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white mb-3">Contextual Help</h3>
              
              <Card className="bg-gray-800 border-gray-700 p-4">
                <h4 className="text-sm font-medium text-white mb-2">Anchor Framework</h4>
                <p className="text-xs text-gray-300 mb-2">
                  Learn about the Anchor framework for Solana development
                </p>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs">
                  View Docs
                </Button>
              </Card>

              <Card className="bg-gray-800 border-gray-700 p-4">
                <h4 className="text-sm font-medium text-white mb-2">Solana Accounts</h4>
                <p className="text-xs text-gray-300 mb-2">
                  Understanding the account model in Solana
                </p>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs">
                  View Docs
                </Button>
              </Card>

              <Card className="bg-gray-800 border-gray-700 p-4">
                <h4 className="text-sm font-medium text-white mb-2">Best Practices</h4>
                <p className="text-xs text-gray-300 mb-2">
                  Security and performance guidelines
                </p>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs">
                  View Docs
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
