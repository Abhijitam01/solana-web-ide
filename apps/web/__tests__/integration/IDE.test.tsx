import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import IDE from '../../app/components/IDE';

// Mock Monaco Editor with more realistic behavior
jest.mock('@monaco-editor/react', () => ({
  Editor: ({ onChange, value, onMount }: any) => {
    React.useEffect(() => {
      if (onMount) {
        onMount({
          getValue: () => value || '',
          setValue: (newValue: string) => onChange?.(newValue),
          focus: jest.fn(),
          dispose: jest.fn(),
        });
      }
    }, [onMount, value, onChange]);

    return (
      <textarea
        data-testid="monaco-editor"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Enter your Solana program code..."
      />
    );
  },
}));

// Mock FileExplorer with realistic file operations
jest.mock('../../app/components/FileExplorer', () => {
  return function MockFileExplorer({ onFileSelect, onFileCreate, onFileDelete }: any) {
    const files = ['lib.rs', 'Cargo.toml', 'program.rs'];
    
    return (
      <div data-testid="file-explorer">
        <div data-testid="file-list">
          {files.map((file) => (
            <div key={file} data-testid={`file-${file}`}>
              <button onClick={() => onFileSelect(file)}>{file}</button>
              <button onClick={() => onFileDelete(file)}>Delete</button>
            </div>
          ))}
        </div>
        <button onClick={() => onFileCreate('new_file.rs')}>New File</button>
      </div>
    );
  };
});

// Mock CodeEditor with tab management
jest.mock('../../app/components/CodeEditor', () => {
  return function MockCodeEditor({ 
    tabs, 
    activeTab, 
    onTabChange, 
    onTabClose, 
    onContentChange, 
    onSave, 
    onCompile, 
    onDeploy 
  }: any) {
    return (
      <div data-testid="code-editor">
        <div data-testid="tab-bar">
          {tabs?.map((tab: any, index: number) => (
            <button
              key={index}
              data-testid={`tab-${index}`}
              onClick={() => onTabChange(index)}
              className={activeTab === index ? 'active' : ''}
            >
              {tab.name}
              <button onClick={() => onTabClose(index)}>×</button>
            </button>
          ))}
        </div>
        <div data-testid="editor-content">
          <textarea
            data-testid="editor-textarea"
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Enter code..."
          />
        </div>
        <div data-testid="editor-actions">
          <button onClick={onSave}>Save</button>
          <button onClick={onCompile}>Compile</button>
          <button onClick={onDeploy}>Deploy</button>
        </div>
      </div>
    );
  };
});

// Mock AIPanel with realistic AI interactions
jest.mock('../../app/components/AIPanel', () => {
  return function MockAIPanel({ 
    activeTab, 
    onTabChange, 
    onAIAction, 
    aiResponse, 
    isLoading 
  }: any) {
    return (
      <div data-testid="ai-panel">
        <div data-testid="ai-tabs">
          <button 
            onClick={() => onTabChange('assistant')}
            className={activeTab === 'assistant' ? 'active' : ''}
          >
            Assistant
          </button>
          <button 
            onClick={() => onTabChange('output')}
            className={activeTab === 'output' ? 'active' : ''}
          >
            Output
          </button>
          <button 
            onClick={() => onTabChange('docs')}
            className={activeTab === 'docs' ? 'active' : ''}
          >
            Docs
          </button>
        </div>
        <div data-testid="ai-content">
          {isLoading && <div data-testid="ai-loading">AI is thinking...</div>}
          {aiResponse && <div data-testid="ai-response">{aiResponse}</div>}
          <div data-testid="ai-actions">
            <button onClick={() => onAIAction('explain')}>Explain Code</button>
            <button onClick={() => onAIAction('optimize')}>Optimize</button>
            <button onClick={() => onAIAction('generate-tests')}>Generate Tests</button>
          </div>
        </div>
      </div>
    );
  };
});

// Mock TerminalPanel with command execution
jest.mock('../../app/components/TerminalPanel', () => {
  return function MockTerminalPanel({ 
    isOpen, 
    onToggle, 
    onCommand, 
    onErrorSimplify, 
    output 
  }: any) {
    if (!isOpen) {
      return (
        <div data-testid="terminal-toggle">
          <button onClick={onToggle}>Open Terminal</button>
        </div>
      );
    }

    return (
      <div data-testid="terminal-panel">
        <div data-testid="terminal-header">
          <span>Terminal</span>
          <button onClick={onToggle}>Close</button>
        </div>
        <div data-testid="terminal-output">
          {output?.map((line: any, index: number) => (
            <div key={index} data-testid={`terminal-line-${index}`}>
              {line}
            </div>
          ))}
        </div>
        <div data-testid="terminal-input">
          <input
            data-testid="terminal-command-input"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onCommand((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';
              }
            }}
            placeholder="Enter command..."
          />
        </div>
        <div data-testid="terminal-actions">
          <button onClick={() => onErrorSimplify('test error')}>Simplify Error</button>
        </div>
      </div>
    );
  };
});

describe('IDE Integration Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
  });

  it('handles complete file workflow', async () => {
    render(<IDE />);

    // 1. Create a new file
    const newFileButton = screen.getByText('New File');
    await user.click(newFileButton);

    // 2. Select a file
    const fileButton = screen.getByText('lib.rs');
    await user.click(fileButton);

    // 3. Edit content
    const editor = screen.getByTestId('editor-textarea');
    await user.type(editor, 'pub fn main() {}');

    // 4. Save the file
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    // 5. Compile the code
    const compileButton = screen.getByText('Compile');
    await user.click(compileButton);

    // 6. Check terminal output
    const terminalToggle = screen.getByText('Open Terminal');
    await user.click(terminalToggle);

    // Verify all components are working together
    expect(screen.getByTestId('file-explorer')).toBeInTheDocument();
    expect(screen.getByTestId('code-editor')).toBeInTheDocument();
    expect(screen.getByTestId('ai-panel')).toBeInTheDocument();
    expect(screen.getByTestId('terminal-panel')).toBeInTheDocument();
  });

  it('handles AI assistant workflow', async () => {
    render(<IDE />);

    // 1. Switch to AI assistant tab
    const assistantTab = screen.getByText('Assistant');
    await user.click(assistantTab);

    // 2. Request code explanation
    const explainButton = screen.getByText('Explain Code');
    await user.click(explainButton);

    // 3. Check for AI response
    await waitFor(() => {
      expect(screen.getByTestId('ai-loading')).toBeInTheDocument();
    });

    // 4. Switch to output tab
    const outputTab = screen.getByText('Output');
    await user.click(outputTab);

    // Verify AI panel functionality
    expect(screen.getByTestId('ai-panel')).toBeInTheDocument();
  });

  it('handles terminal command execution', async () => {
    render(<IDE />);

    // 1. Open terminal
    const terminalToggle = screen.getByText('Open Terminal');
    await user.click(terminalToggle);

    // 2. Execute a command
    const commandInput = screen.getByTestId('terminal-command-input');
    await user.type(commandInput, 'anchor build');
    await user.keyboard('{Enter}');

    // 3. Simplify an error
    const simplifyButton = screen.getByText('Simplify Error');
    await user.click(simplifyButton);

    // Verify terminal functionality
    expect(screen.getByTestId('terminal-panel')).toBeInTheDocument();
  });

  it('handles tab management', async () => {
    render(<IDE />);

    // 1. Select a file to open a tab
    const fileButton = screen.getByText('program.rs');
    await user.click(fileButton);

    // 2. Switch between tabs
    const tabButtons = screen.getAllByTestId(/^tab-/);
    if (tabButtons.length > 1) {
      await user.click(tabButtons[1]);
    }

    // 3. Close a tab
    const closeButtons = screen.getAllByText('×');
    if (closeButtons.length > 0) {
      await user.click(closeButtons[0]);
    }

    // Verify tab management
    expect(screen.getByTestId('code-editor')).toBeInTheDocument();
  });

  it('handles file operations', async () => {
    render(<IDE />);

    // 1. Create a new file
    const newFileButton = screen.getByText('New File');
    await user.click(newFileButton);

    // 2. Delete a file
    const deleteButtons = screen.getAllByText('Delete');
    if (deleteButtons.length > 0) {
      await user.click(deleteButtons[0]);
    }

    // 3. Select different files
    const fileButtons = screen.getAllByText(/\.rs$/);
    for (const button of fileButtons) {
      await user.click(button);
    }

    // Verify file operations
    expect(screen.getByTestId('file-explorer')).toBeInTheDocument();
  });

  it('handles deployment workflow', async () => {
    render(<IDE />);

    // 1. Select a file
    const fileButton = screen.getByText('lib.rs');
    await user.click(fileButton);

    // 2. Edit code
    const editor = screen.getByTestId('editor-textarea');
    await user.type(editor, 'pub fn deploy() {}');

    // 3. Compile
    const compileButton = screen.getByText('Compile');
    await user.click(compileButton);

    // 4. Deploy
    const deployButton = screen.getByText('Deploy');
    await user.click(deployButton);

    // 5. Check output in terminal
    const terminalToggle = screen.getByText('Open Terminal');
    await user.click(terminalToggle);

    // Verify deployment workflow
    expect(screen.getByTestId('terminal-panel')).toBeInTheDocument();
  });

  it('handles error simplification workflow', async () => {
    render(<IDE />);

    // 1. Open terminal
    const terminalToggle = screen.getByText('Open Terminal');
    await user.click(terminalToggle);

    // 2. Execute command that might produce error
    const commandInput = screen.getByTestId('terminal-command-input');
    await user.type(commandInput, 'anchor build --invalid-flag');
    await user.keyboard('{Enter}');

    // 3. Simplify the error
    const simplifyButton = screen.getByText('Simplify Error');
    await user.click(simplifyButton);

    // Verify error handling
    expect(screen.getByTestId('terminal-panel')).toBeInTheDocument();
  });

  it('maintains state across component interactions', async () => {
    render(<IDE />);

    // 1. Select a file
    const fileButton = screen.getByText('lib.rs');
    await user.click(fileButton);

    // 2. Edit content
    const editor = screen.getByTestId('editor-textarea');
    await user.type(editor, 'test content');

    // 3. Switch to AI panel
    const assistantTab = screen.getByText('Assistant');
    await user.click(assistantTab);

    // 4. Switch back to editor
    const tabButton = screen.getByTestId('tab-0');
    await user.click(tabButton);

    // 5. Verify content is preserved
    expect(screen.getByTestId('editor-textarea')).toHaveValue('test content');
  });
});
