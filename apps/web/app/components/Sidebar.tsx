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
    <div className="w-64 bg-white dark:bg-gray-800 flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="h-10 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Explorer</span>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* File Explorer */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
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
      <div className="border-t border-gray-200 dark:border-gray-700 p-2">
        <div className="flex items-center justify-between">
          <button className="flex items-center space-x-2 px-2 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal</span>
          </button>
          <button className="flex items-center space-x-2 px-2 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
            <GitBranch className="w-3.5 h-3.5" />
            <span>Git</span>
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
          "flex items-center space-x-2 py-1 px-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
          level > 0 && "ml-4"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => isFolder && onToggleFolder(item.name)}
      >
        {isFolder && (
          <div className={cn("transition-transform duration-150", isExpanded && "rotate-90")}>
            <ChevronRight className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
          </div>
        )}
        {!isFolder && <div className="w-3.5" />}

        {isFolder ? (
          <Folder className="w-3.5 h-3.5 text-blue-500" />
        ) : (
          <FileText className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
        )}

        <span className="text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          {item.name}
        </span>
      </div>

      {isFolder && isExpanded && item.children && (
        <div>
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