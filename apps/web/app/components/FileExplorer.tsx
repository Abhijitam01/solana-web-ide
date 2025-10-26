'use client';

import { useState } from 'react';
import { Button } from '@repo/ui/button';
import { 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  Folder, 
  FolderOpen,
  Plus, 
  MoreHorizontal,
  Trash2,
  Edit3,
  Copy,
  Download
} from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  isOpen?: boolean;
}

interface FileExplorerProps {
  files: FileNode[];
  activeFile?: string;
  onFileSelect: (fileId: string) => void;
  onFileCreate: (parentId: string, name: string, type: 'file' | 'folder') => void;
  onFileDelete: (fileId: string) => void;
  onFileRename: (fileId: string, newName: string) => void;
  onFileContentChange: (fileId: string, content: string) => void;
}

export default function FileExplorer({
  files,
  activeFile,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  onFileContentChange
}: FileExplorerProps) {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    fileId: string;
  } | null>(null);
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState('');

  const getFileIcon = (file: FileNode) => {
    if (file.type === 'folder') {
      return file.isOpen ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />;
    }
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'rs':
        return <span className="text-orange-400">🦀</span>;
      case 'toml':
        return <span className="text-blue-400">⚙️</span>;
      case 'json':
        return <span className="text-yellow-400">📄</span>;
      case 'md':
        return <span className="text-green-400">📝</span>;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleContextMenu = (e: React.MouseEvent, fileId: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      fileId
    });
  };

  const handleFileClick = (file: FileNode) => {
    if (file.type === 'folder') {
      // Toggle folder open/closed
      onFileContentChange(file.id, JSON.stringify({ ...file, isOpen: !file.isOpen }));
    } else {
      onFileSelect(file.id);
    }
  };

  const handleRename = (fileId: string) => {
    setRenamingFile(fileId);
    setNewFileName(files.find(f => f.id === fileId)?.name || '');
    setContextMenu(null);
  };

  const handleRenameSubmit = () => {
    if (renamingFile && newFileName.trim()) {
      onFileRename(renamingFile, newFileName.trim());
      setRenamingFile(null);
      setNewFileName('');
    }
  };

  const handleRenameCancel = () => {
    setRenamingFile(null);
    setNewFileName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      handleRenameCancel();
    }
  };

  const renderFileNode = (file: FileNode, depth = 0) => {
    const isActive = activeFile === file.id;
    const isRenaming = renamingFile === file.id;

    return (
      <div key={file.id}>
        <div
          className={`flex items-center space-x-2 px-2 py-1 cursor-pointer rounded hover:bg-gray-800 transition-colors ${
            isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => handleFileClick(file)}
          onContextMenu={(e) => handleContextMenu(e, file.id)}
        >
          {file.type === 'folder' && (
            <button
              className="p-0.5 hover:bg-gray-700 rounded"
              onClick={(e) => {
                e.stopPropagation();
                handleFileClick(file);
              }}
            >
              {file.isOpen ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
          
          {file.type === 'file' && <div className="w-4" />}
          
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {getFileIcon(file)}
            {isRenaming ? (
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onBlur={handleRenameSubmit}
                onKeyDown={handleKeyDown}
                className="bg-gray-700 text-white text-sm px-1 py-0.5 rounded flex-1 min-w-0"
                autoFocus
              />
            ) : (
              <span className="text-sm truncate">{file.name}</span>
            )}
          </div>
        </div>

        {file.type === 'folder' && file.isOpen && file.children && (
          <div>
            {file.children.map(child => renderFileNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 border-r border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Explorer</h2>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFileCreate('root', 'new_file.rs', 'file')}
              className="text-gray-400 hover:text-white hover:bg-gray-800 p-1"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFileCreate('root', 'new_folder', 'folder')}
              className="text-gray-400 hover:text-white hover:bg-gray-800 p-1"
            >
              <Folder className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search files..."
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-auto">
        <div className="p-2">
          {files.map(file => renderFileNode(file))}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 z-50"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          <button
            className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center space-x-2"
            onClick={() => {
              onFileCreate(contextMenu.fileId, 'new_file.rs', 'file');
              setContextMenu(null);
            }}
          >
            <Plus className="h-4 w-4" />
            <span>New File</span>
          </button>
          <button
            className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center space-x-2"
            onClick={() => {
              onFileCreate(contextMenu.fileId, 'new_folder', 'folder');
              setContextMenu(null);
            }}
          >
            <Folder className="h-4 w-4" />
            <span>New Folder</span>
          </button>
          <div className="border-t border-gray-700 my-1" />
          <button
            className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center space-x-2"
            onClick={() => handleRename(contextMenu.fileId)}
          >
            <Edit3 className="h-4 w-4" />
            <span>Rename</span>
          </button>
          <button
            className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center space-x-2"
            onClick={() => {
              // Copy file logic
              setContextMenu(null);
            }}
          >
            <Copy className="h-4 w-4" />
            <span>Copy</span>
          </button>
          <button
            className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center space-x-2"
            onClick={() => {
              // Download file logic
              setContextMenu(null);
            }}
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
          <div className="border-t border-gray-700 my-1" />
          <button
            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 flex items-center space-x-2"
            onClick={() => {
              onFileDelete(contextMenu.fileId);
              setContextMenu(null);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      )}

      {/* Click outside to close context menu */}
      {contextMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
