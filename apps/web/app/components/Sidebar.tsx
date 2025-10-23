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
  currentView?: 'learn' | 'code' | 'community';
  onViewChange?: (view: 'learn' | 'code' | 'community') => void;
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
    { id: 'learn', label: 'Learn', icon: BookOpen, description: 'Interactive tutorials and courses' },
    { id: 'code', label: 'Code', icon: Code, description: 'IDE and development tools' },
    { id: 'community', label: 'Community', icon: Users, description: 'Study groups and mentors' },
  ];

  return (
    <div className="w-80 bg-background border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold">Navigation</h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-medium mb-3">Main Sections</h3>
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange?.(item.id as 'learn' | 'code' | 'community')}
                className={cn(
                  "w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors",
                  currentView === item.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
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
      <div className="flex border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-xs font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-3 w-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'files' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Project Files</h3>
              <Button variant="ghost" size="sm" className="p-1">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>lib.rs</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Cargo.toml</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Anchor.toml</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm"
              />
            </div>

            <div className="space-y-3">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="p-3 cursor-pointer hover:bg-muted transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium">{template.name}</h4>
                    <Star className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                      {template.category}
                    </span>
                    <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                      {template.difficulty}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.features.map((feature) => (
                      <span key={feature} className="text-xs px-1 py-0.5 bg-secondary text-secondary-foreground rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="p-4">
            <div className="space-y-4">
              <div className="text-center">
                <Bot className="h-12 w-12 mx-auto text-primary mb-2" />
                <h3 className="text-sm font-medium mb-1">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">
                  Get help with Solana development
                </p>
              </div>

              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Contract
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Code className="h-4 w-4 mr-2" />
                  Explain Code
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Fix Errors
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="p-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium mb-2">Quick Links</h3>
              <a href="#" className="block text-xs text-muted-foreground hover:text-foreground">
                Anchor Documentation
              </a>
              <a href="#" className="block text-xs text-muted-foreground hover:text-foreground">
                Solana Program Library
              </a>
              <a href="#" className="block text-xs text-muted-foreground hover:text-foreground">
                Program Examples
              </a>
              <a href="#" className="block text-xs text-muted-foreground hover:text-foreground">
                Best Practices
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
