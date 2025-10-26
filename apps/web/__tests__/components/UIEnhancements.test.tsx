import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UIEnhancements, LoadingSpinner, ProgressBar, Toast, Modal, Tooltip } from '../../app/components/UIEnhancements';

// Mock window.addToast
const mockAddToast = jest.fn();
(global as any).window = {
  ...global.window,
  addToast: mockAddToast,
};

describe('UIEnhancements', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('LoadingSpinner', () => {
    it('renders with default size', () => {
      render(<LoadingSpinner />);
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('w-6', 'h-6');
    });

    it('renders with custom size', () => {
      render(<LoadingSpinner size="lg" />);
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toHaveClass('w-8', 'h-8');
    });

    it('applies custom className', () => {
      render(<LoadingSpinner className="custom-class" />);
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toHaveClass('custom-class');
    });
  });

  describe('ProgressBar', () => {
    it('renders with correct progress', () => {
      render(<ProgressBar progress={50} />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveStyle({ width: '50%' });
    });

    it('shows percentage when requested', () => {
      render(<ProgressBar progress={75} showPercentage />);
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('clamps progress to 0-100', () => {
      render(<ProgressBar progress={150} />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveStyle({ width: '100%' });
    });
  });

  describe('Toast', () => {
    const mockOnClose = jest.fn();
    const defaultProps = {
      id: 'test-toast',
      type: 'info' as const,
      title: 'Test Toast',
      message: 'Test message',
      onClose: mockOnClose,
    };

    it('renders toast with correct content', () => {
      render(<Toast {...defaultProps} />);
      expect(screen.getByText('Test Toast')).toBeInTheDocument();
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('renders different types with correct styling', () => {
      const { rerender } = render(<Toast {...defaultProps} type="success" />);
      expect(screen.getByText('✓')).toBeInTheDocument();

      rerender(<Toast {...defaultProps} type="error" />);
      expect(screen.getByText('✕')).toBeInTheDocument();

      rerender(<Toast {...defaultProps} type="warning" />);
      expect(screen.getByText('⚠')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
      render(<Toast {...defaultProps} />);
      const closeButton = screen.getByText('✕');
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledWith('test-toast');
    });

    it('auto-closes after duration', async () => {
      render(<Toast {...defaultProps} duration={100} />);
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledWith('test-toast');
      }, { timeout: 200 });
    });
  });

  describe('Modal', () => {
    const mockOnClose = jest.fn();
    const defaultProps = {
      isOpen: true,
      onClose: mockOnClose,
      title: 'Test Modal',
      children: <div>Modal content</div>,
    };

    it('renders modal when open', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
      render(<Modal {...defaultProps} isOpen={false} />);
      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
      render(<Modal {...defaultProps} />);
      const closeButton = screen.getByText('✕');
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('calls onClose when overlay is clicked', () => {
      render(<Modal {...defaultProps} />);
      const overlay = screen.getByRole('dialog').parentElement;
      fireEvent.click(overlay!);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('handles escape key', () => {
      render(<Modal {...defaultProps} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Tooltip', () => {
    it('shows tooltip on hover', async () => {
      render(
        <Tooltip content="Test tooltip">
          <button>Hover me</button>
        </Tooltip>
      );

      const button = screen.getByText('Hover me');
      fireEvent.mouseEnter(button);

      await waitFor(() => {
        expect(screen.getByText('Test tooltip')).toBeInTheDocument();
      });
    });

    it('hides tooltip on mouse leave', async () => {
      render(
        <Tooltip content="Test tooltip">
          <button>Hover me</button>
        </Tooltip>
      );

      const button = screen.getByText('Hover me');
      fireEvent.mouseEnter(button);
      fireEvent.mouseLeave(button);

      await waitFor(() => {
        expect(screen.queryByText('Test tooltip')).not.toBeInTheDocument();
      });
    });
  });

  describe('UIEnhancements Provider', () => {
    it('renders children', () => {
      render(
        <UIEnhancements>
          <div>Test content</div>
        </UIEnhancements>
      );
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('sets up global addToast function', () => {
      render(<UIEnhancements><div>Test</div></UIEnhancements>);
      expect((global as any).window.addToast).toBeDefined();
    });
  });
});
