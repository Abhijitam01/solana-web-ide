'use client';

import { useState, useEffect } from 'react';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { 
  X, 
  FileText, 
  Folder, 
  Plus, 
  Search, 
  Bot, 
  Code, 
  Database,
  Zap,
  BookOpen,
  Star,
  Users
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  onClose: () => void;
  currentView?: 'learn' | 'tutorials' | 'code' | 'community';
  onViewChange?: (view: 'learn' | 'tutorials' | 'code' | 'community') => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  features: string[];
}

export default function Sidebar({ onClose, currentView, onViewChange }: SidebarProps) {
  const [activeTab, setActiveTab] = useState('files');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch templates from API
    fetch('/api/templates')
      .then(res => res.json())
      .then(data => setTemplates(data.templates || []))
      .catch(console.error);
  }, []);

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'files', label: 'Files', icon: Folder },
    { id: 'templates', label: 'Templates', icon: Code },
    { id: 'ai', label: 'AI Assistant', icon: Bot },
    { id: 'docs', label: 'Documentation', icon: BookOpen },
  ];

  const navigationItems = [
    { id: 'learn', label: 'Learn', icon: BookOpen, description: 'Learning dashboard and progress' },
    { id: 'tutorials', label: 'Tutorials', icon: Star, description: 'Interactive tutorials and courses' },
    { id: 'code', label: 'Code', icon: Code, description: 'IDE and development tools' },
    { id: 'community', label: 'Community', icon: Users, description: 'Study groups and mentors' },
  ];

  return (
    <div className="w-80 bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Navigation</h2>
          <p className="text-xs text-white/60">Quick access to tools</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="p-2 text-white/70 hover:text-white hover:bg-white/10">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="p-6 border-b border-white/10">
        <h3 className="text-sm font-semibold mb-4 text-white/80">Main Sections</h3>
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange?.(item.id as 'learn' | 'tutorials' | 'code' | 'community')}
                className={cn(
                  "w-full flex items-center space-x-3 p-4 rounded-xl text-left transition-all duration-300",
                  currentView === item.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "hover:bg-gray-800 text-gray-300 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-xs font-medium transition-all duration-300",
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'files' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-white">Project Files</h3>
              <Button variant="ghost" size="sm" className="p-2 text-white/70 hover:text-white hover:bg-white/10">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                <FileText className="h-4 w-4 text-white/60" />
                <span className="text-sm text-white/80">lib.rs</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                <FileText className="h-4 w-4 text-white/60" />
                <span className="text-sm text-white/80">Cargo.toml</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                <FileText className="h-4 w-4 text-white/60" />
                <span className="text-sm text-white/80">Anchor.toml</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Search className="h-4 w-4 text-white/60" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="space-y-4">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-sm font-semibold text-white">{template.name}</h4>
                    <Star className="h-4 w-4 text-white/60" />
                  </div>
                  <p className="text-xs text-white/70 mb-3">{template.description}</p>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xs px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-lg border border-purple-500/30">
                      {template.category}
                    </span>
                    <span className="text-xs px-2 py-1 bg-white/10 text-white/70 rounded-lg">
                      {template.difficulty}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {template.features.map((feature) => (
                      <span key={feature} className="text-xs px-2 py-1 bg-white/10 text-white/60 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="p-6">
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">AI Assistant</h3>
                <p className="text-sm text-white/70">
                  Get help with Solana development
                </p>
              </div>

              <div className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30">
                  <Zap className="h-4 w-4 mr-3" />
                  Generate Contract
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30">
                  <Code className="h-4 w-4 mr-3" />
                  Explain Code
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30">
                  <Database className="h-4 w-4 mr-3" />
                  Fix Errors
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="p-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a href="#" className="block p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="text-sm font-medium text-white">Anchor Documentation</div>
                  <div className="text-xs text-white/60">Official Anchor framework docs</div>
                </a>
                <a href="#" className="block p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="text-sm font-medium text-white">Solana Program Library</div>
                  <div className="text-xs text-white/60">Community program examples</div>
                </a>
                <a href="#" className="block p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="text-sm font-medium text-white">Program Examples</div>
                  <div className="text-xs text-white/60">Real-world implementations</div>
                </a>
                <a href="#" className="block p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="text-sm font-medium text-white">Best Practices</div>
                  <div className="text-xs text-white/60">Security and optimization tips</div>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
