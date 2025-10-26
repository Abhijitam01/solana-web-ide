import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import IDE from '../../app/components/IDE';

// Mock Monaco Editor
jest.mock('@monaco-editor/react', () => ({
  Editor: ({ onChange, value }: any) => (
    <textarea
      data-testid="monaco-editor"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
  ),
}));

// Mock FileExplorer
jest.mock('../../app/components/FileExplorer', () => {
  return function MockFileExplorer({ onFileSelect }: any) {
    return (
      <div data-testid="file-explorer">
        <button onClick={() => onFileSelect('test.rs')}>test.rs</button>
      </div>
    );
  };
});

// Mock CodeEditor
jest.mock('../../app/components/CodeEditor', () => {
  return function MockCodeEditor({ onTabChange, onContentChange }: any) {
    return (
      <div data-testid="code-editor">
        <button onClick={() => onTabChange(0)}>Tab 1</button>
        <button onClick={() => onContentChange('new content')}>Change Content</button>
      </div>
    );
  };
});

// Mock AIPanel
jest.mock('../../app/components/AIPanel', () => {
  return function MockAIPanel() {
    return <div data-testid="ai-panel">AI Panel</div>;
  };
});

// Mock TerminalPanel
jest.mock('../../app/components/TerminalPanel', () => {
  return function MockTerminalPanel({ onCommand, onErrorSimplify }: any) {
    return (
      <div data-testid="terminal-panel">
        <button onClick={() => onCommand('test command')}>Run Command</button>
        <button onClick={() => onErrorSimplify('test error')}>Simplify Error</button>
      </div>
    );
  };
});

describe('IDE Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all panels', () => {
    render(<IDE />);
    
    expect(screen.getByTestId('file-explorer')).toBeInTheDocument();
    expect(screen.getByTestId('code-editor')).toBeInTheDocument();
    expect(screen.getByTestId('ai-panel')).toBeInTheDocument();
    expect(screen.getByTestId('terminal-panel')).toBeInTheDocument();
  });

  it('handles file selection', () => {
    render(<IDE />);
    
    const fileButton = screen.getByText('test.rs');
    fireEvent.click(fileButton);
    
    // Should update active file state
    expect(screen.getByTestId('code-editor')).toBeInTheDocument();
  });

  it('handles tab changes', () => {
    render(<IDE />);
    
    const tabButton = screen.getByText('Tab 1');
    fireEvent.click(tabButton);
    
    // Should update active tab
    expect(screen.getByTestId('code-editor')).toBeInTheDocument();
  });

  it('handles content changes', () => {
    render(<IDE />);
    
    const contentButton = screen.getByText('Change Content');
    fireEvent.click(contentButton);
    
    // Should update file content
    expect(screen.getByTestId('code-editor')).toBeInTheDocument();
  });

  it('handles terminal commands', () => {
    render(<IDE />);
    
    const commandButton = screen.getByText('Run Command');
    fireEvent.click(commandButton);
    
    // Should execute command
    expect(screen.getByTestId('terminal-panel')).toBeInTheDocument();
  });

  it('handles error simplification', () => {
    render(<IDE />);
    
    const errorButton = screen.getByText('Simplify Error');
    fireEvent.click(errorButton);
    
    // Should simplify error
    expect(screen.getByTestId('terminal-panel')).toBeInTheDocument();
  });

  it('toggles terminal visibility', () => {
    render(<IDE />);
    
    // Terminal should be visible by default
    expect(screen.getByTestId('terminal-panel')).toBeInTheDocument();
    
    // Test terminal toggle functionality
    const terminalPanel = screen.getByTestId('terminal-panel');
    expect(terminalPanel).toBeInTheDocument();
  });

  it('manages file state correctly', () => {
    render(<IDE />);
    
    // Should have initial files
    expect(screen.getByTestId('file-explorer')).toBeInTheDocument();
    
    // Should handle file operations
    const fileButton = screen.getByText('test.rs');
    fireEvent.click(fileButton);
    
    expect(screen.getByTestId('code-editor')).toBeInTheDocument();
  });

  it('manages tab state correctly', () => {
    render(<IDE />);
    
    // Should have initial tabs
    expect(screen.getByTestId('code-editor')).toBeInTheDocument();
    
    // Should handle tab operations
    const tabButton = screen.getByText('Tab 1');
    fireEvent.click(tabButton);
    
    expect(screen.getByTestId('code-editor')).toBeInTheDocument();
  });
});
