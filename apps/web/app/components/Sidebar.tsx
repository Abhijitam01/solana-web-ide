'use client';

import { useState } from 'react';
import {
  X,
  FileText,
  Folder,
  Plus,
  ChevronRight,
  ChevronDown,
  Terminal,
  GitBranch,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  onClose: () => void;
  currentView?: 'learn' | 'tutorials' | 'code' | 'community';
  onViewChange?: (view: 'learn' | 'tutorials' | 'code' | 'community') => void;
}

export default function Sidebar({ onClose, currentView, onViewChange }: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['src', 'programs']);

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev =>
      prev.includes(folderName)
        ? prev.filter(f => f !== folderName)
        : [...prev, folderName]
    );
  };

  const fileStructure = [
    {
      name: 'src',
      type: 'folder',
      children: [
        { name: 'lib.rs', type: 'file', language: 'rust' },
        { name: 'main.rs', type: 'file', language: 'rust' },
        { name: 'utils.rs', type: 'file', language: 'rust' }
      ]
    },
    {
      name: 'programs',
      type: 'folder',
      children: [
        { name: 'hello-world', type: 'folder', children: [
          { name: 'lib.rs', type: 'file', language: 'rust' },
          { name: 'Cargo.toml', type: 'file', language: 'toml' }
        ]},
        { name: 'token-program', type: 'folder', children: [
          { name: 'lib.rs', type: 'file', language: 'rust' },
          { name: 'state.rs', type: 'file', language: 'rust' }
        ]}
      ]
    },
    { name: 'Cargo.toml', type: 'file', language: 'toml' },
    { name: 'Cargo.lock', type: 'file', language: 'toml' },
    { name: 'README.md', type: 'file', language: 'markdown' }
  ];

  return (
    <div className="w-64 bg-card flex flex-col h-full border-r border-border/50 shadow-sm">
      {/* Sidebar Header */}
      <div className="h-12 border-b border-border/50 flex items-center justify-between px-4 backdrop-blur-sm bg-card/50">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Explorer</span>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-1.5 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 active:scale-95" aria-label="Add file">
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 active:scale-95" aria-label="More options">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* File Explorer */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <div className="p-3">
          {fileStructure.map((item, index) => (
            <FileItem
              key={index}
              item={item}
              level={0}
              expandedFolders={expandedFolders}
              onToggleFolder={toggleFolder}
            />
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-border/50 p-3 backdrop-blur-sm bg-card/50">
        <div className="flex items-center justify-between">
          <button className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 group">
            <Terminal className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Terminal</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 group">
            <GitBranch className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Git</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// FileItem component for recursive file structure
interface FileItemProps {
  item: any;
  level: number;
  expandedFolders: string[];
  onToggleFolder: (folderName: string) => void;
}

function FileItem({ item, level, expandedFolders, onToggleFolder }: FileItemProps) {
  const isExpanded = expandedFolders.includes(item.name);
  const isFolder = item.type === 'folder';

  return (
    <div>
      <div
        className={cn(
          "flex items-center space-x-2 py-1.5 px-2 rounded-md cursor-pointer hover:bg-accent transition-all duration-200 group relative",
          level > 0 && "ml-4"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => isFolder && onToggleFolder(item.name)}
      >
        {isFolder && (
          <div className={cn("transition-transform duration-200 text-muted-foreground", isExpanded && "rotate-90")}>
            <ChevronRight className="w-4 h-4" />
          </div>
        )}
        {!isFolder && <div className="w-4" />}

        <div className="flex-shrink-0">
          {isFolder ? (
            <Folder className={cn("w-4 h-4 transition-colors", isExpanded ? "text-primary" : "text-blue-400")} />
          ) : (
            <FileText className={cn("w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors")} />
          )}
        </div>

        <span className="text-sm text-foreground/80 group-hover:text-foreground font-medium transition-colors truncate">
          {item.name}
        </span>
        
        {/* Hover indicator */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      {isFolder && isExpanded && item.children && (
        <div className="animate-fade-in">
          {item.children.map((child: any, index: number) => (
            <FileItem
              key={index}
              item={child}
              level={level + 1}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}