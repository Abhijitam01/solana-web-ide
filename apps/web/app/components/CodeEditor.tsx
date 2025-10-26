'use client';

import { useState, useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Button } from '@repo/ui/button';
import { 
  X, 
  Save, 
  Play, 
  Rocket, 
  Settings,
  FileText,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';

interface EditorTab {
  id: string;
  name: string;
  content: string;
  language: string;
  isDirty: boolean;
  isActive: boolean;
}

interface CodeEditorProps {
  tabs: EditorTab[];
  activeTabId?: string;
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onContentChange: (tabId: string, content: string) => void;
  onSave: (tabId: string) => void;
  onCompile: () => void;
  onDeploy: () => void;
  theme?: 'dark' | 'light';
}

export default function CodeEditor({
  tabs,
  activeTabId,
  onTabChange,
  onTabClose,
  onContentChange,
  onSave,
  onCompile,
  onDeploy,
  theme = 'dark'
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  useEffect(() => {
    if (activeTab) {
      setBreadcrumbs(['Project', activeTab.name]);
    }
  }, [activeTab]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Configure editor options
    editor.updateOptions({
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: 'on',
      tabSize: 4,
      insertSpaces: true,
      renderWhitespace: 'selection',
      cursorBlinking: 'blink',
      cursorSmoothCaretAnimation: true,
      smoothScrolling: true,
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (activeTab) {
        onSave(activeTab.id);
      }
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB, () => {
      onCompile();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD, () => {
      onDeploy();
    });
  };

  const handleContentChange = (value: string | undefined) => {
    if (value !== undefined && activeTab) {
      onContentChange(activeTab.id, value);
    }
  };

  const getLanguageFromFileName = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'rs':
        return 'rust';
      case 'toml':
        return 'toml';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      case 'js':
        return 'javascript';
      case 'ts':
        return 'typescript';
      case 'py':
        return 'python';
      default:
        return 'plaintext';
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'rs':
        return '🦀';
      case 'toml':
        return '⚙️';
      case 'json':
        return '📄';
      case 'md':
        return '📝';
      default:
        return '📄';
    }
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Breadcrumb Navigation */}
      <div className="px-4 py-2 bg-gray-900 border-b border-gray-800">
        <nav className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center space-x-2">
              {index > 0 && <ChevronRight className="h-3 w-3 text-gray-500" />}
              <span className={index === breadcrumbs.length - 1 ? 'text-white' : 'text-gray-400'}>
                {crumb}
              </span>
            </div>
          ))}
        </nav>
      </div>

      {/* Tab Bar */}
      <div className="bg-gray-900 border-b border-gray-800 flex items-center overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center space-x-2 px-4 py-3 border-r border-gray-800 whitespace-nowrap cursor-pointer transition-colors ${
              tab.isActive
                ? 'bg-black text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="text-sm">{getFileIcon(tab.name)}</span>
            <span className="text-sm font-medium">{tab.name}</span>
            {tab.isDirty && (
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        
        {/* Add new tab button */}
        <button className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          <FileText className="h-4 w-4" />
        </button>
      </div>

      {/* Editor Toolbar */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => activeTab && onSave(activeTab.id)}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
            <span className="ml-2 text-xs text-gray-500">Ctrl+S</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onCompile}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Play className="h-4 w-4 mr-2" />
            Compile
            <span className="ml-2 text-xs text-gray-500">Ctrl+B</span>
          </Button>
          
          <Button
            size="sm"
            onClick={onDeploy}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Rocket className="h-4 w-4 mr-2" />
            Deploy
            <span className="ml-2 text-xs text-blue-200">Ctrl+D</span>
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">
            {activeTab ? `${activeTab.language.toUpperCase()}` : 'PLAINTEXT'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        {activeTab ? (
          <Editor
            height="100%"
            language={getLanguageFromFileName(activeTab.name)}
            value={activeTab.content}
            onChange={handleContentChange}
            onMount={handleEditorDidMount}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              tabSize: 4,
              insertSpaces: true,
              renderWhitespace: 'selection',
              cursorBlinking: 'blink',
              cursorSmoothCaretAnimation: true,
              smoothScrolling: true,
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: 'on',
              quickSuggestions: {
                other: true,
                comments: true,
                strings: true
              },
              parameterHints: {
                enabled: true
              },
              hover: {
                enabled: true
              },
              contextmenu: true,
              mouseWheelZoom: true,
              multiCursorModifier: 'ctrlCmd',
              formatOnPaste: true,
              formatOnType: true,
              bracketPairColorization: {
                enabled: true
              },
              guides: {
                bracketPairs: true,
                indentation: true
              }
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No file open</h3>
              <p className="text-gray-500 text-sm">
                Open a file from the explorer to start coding
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-2 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          {activeTab && (
            <>
              <span>Ln 1, Col 1</span>
              <span>•</span>
              <span>{activeTab.language.toUpperCase()}</span>
              <span>•</span>
              <span>UTF-8</span>
              {activeTab.isDirty && (
                <>
                  <span>•</span>
                  <span className="text-yellow-400">Modified</span>
                </>
              )}
            </>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <span>Ready</span>
          <span>•</span>
          <span>AI Assistant</span>
        </div>
      </div>
    </div>
  );
}
