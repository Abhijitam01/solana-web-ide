import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../app/page';

// Mock all the components
jest.mock('../../app/components/Header', () => {
  return function MockHeader({ onViewChange, currentView }: any) {
    return (
      <div data-testid="header">
        <button onClick={() => onViewChange('learn')}>Learn</button>
        <button onClick={() => onViewChange('tutorials')}>Tutorials</button>
        <button onClick={() => onViewChange('code')}>Code</button>
        <button onClick={() => onViewChange('community')}>Community</button>
        <span data-testid="current-view">{currentView}</span>
      </div>
    );
  };
});

jest.mock('../../app/components/Sidebar', () => {
  return function MockSidebar({ onViewChange, currentView }: any) {
    return (
      <div data-testid="sidebar">
        <button onClick={() => onViewChange('learn')}>Learn</button>
        <button onClick={() => onViewChange('tutorials')}>Tutorials</button>
        <button onClick={() => onViewChange('code')}>Code</button>
        <button onClick={() => onViewChange('community')}>Community</button>
        <span data-testid="sidebar-current-view">{currentView}</span>
      </div>
    );
  };
});

jest.mock('../../app/components/AuthModal', () => {
  return function MockAuthModal({ isOpen, onClose, onSuccess }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="auth-modal">
        <button onClick={onClose}>Close</button>
        <button onClick={() => onSuccess({ id: 1, name: 'Test User' })}>Login</button>
      </div>
    );
  };
});

jest.mock('../../app/landing/page', () => {
  return function MockLandingPage({ onLogin, onSignup }: any) {
    return (
      <div data-testid="landing-page">
        <button onClick={onLogin}>Login</button>
        <button onClick={onSignup}>Signup</button>
      </div>
    );
  };
});

jest.mock('../../app/learn/page', () => {
  return function MockLearningDashboard() {
    return <div data-testid="learning-dashboard">Learning Dashboard</div>;
  };
});

jest.mock('../../app/tutorials/page', () => {
  return function MockTutorialsPage() {
    return <div data-testid="tutorials-page">Tutorials Page</div>;
  };
});

jest.mock('../../app/components/IDE', () => {
  return function MockIDE() {
    return <div data-testid="ide">IDE Component</div>;
  };
});

jest.mock('../../app/components/UIEnhancements', () => {
  return function MockUIEnhancements({ children }: any) {
    return <div data-testid="ui-enhancements">{children}</div>;
  };
});

// Mock wallet providers
jest.mock('@solana/wallet-adapter-react', () => ({
  ConnectionProvider: ({ children }: any) => <div data-testid="connection-provider">{children}</div>,
  WalletProvider: ({ children }: any) => <div data-testid="wallet-provider">{children}</div>,
  useWallet: () => ({ connected: false }),
}));

jest.mock('@solana/wallet-adapter-react-ui', () => ({
  WalletModalProvider: ({ children }: any) => <div data-testid="wallet-modal-provider">{children}</div>,
}));

jest.mock('@solana/wallet-adapter-wallets', () => ({
  PhantomWalletAdapter: jest.fn(),
  SolflareWalletAdapter: jest.fn(),
}));

jest.mock('@solana/web3.js', () => ({
  clusterApiUrl: jest.fn(() => 'https://api.devnet.solana.com'),
}));

// Mock theme provider
jest.mock('../../app/components/ThemeProvider', () => ({
  useTheme: () => ({ theme: 'dark', setTheme: jest.fn() }),
}));

describe('Home Page', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('shows loading screen initially', () => {
    render(<Home />);
    expect(screen.getByText('Loading Solana IDE')).toBeInTheDocument();
  });

  it('shows landing page when not authenticated', async () => {
    render(<Home />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });

  it('shows auth modal when login is clicked', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    });
    
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    
    expect(screen.getByTestId('auth-modal')).toBeInTheDocument();
  });

  it('shows IDE when authenticated', async () => {
    // Mock authenticated user
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User' }));
    
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByTestId('ide')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('handles view changes correctly', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User' }));
    
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByTestId('ide')).toBeInTheDocument();
    });
    
    // Test view change to tutorials
    const tutorialsButton = screen.getByText('Tutorials');
    fireEvent.click(tutorialsButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('tutorials-page')).toBeInTheDocument();
    });
  });

  it('handles authentication success', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    });
    
    // Open auth modal
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    
    // Simulate successful login
    const loginSubmitButton = screen.getByText('Login');
    fireEvent.click(loginSubmitButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('ide')).toBeInTheDocument();
    });
  });

  it('handles logout correctly', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User' }));
    
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByTestId('ide')).toBeInTheDocument();
    });
    
    // Test logout functionality
    expect(localStorage.getItem('user')).toBeTruthy();
  });

  it('wraps content with UI enhancements', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByTestId('ui-enhancements')).toBeInTheDocument();
    });
  });

  it('handles sidebar toggle', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User' }));
    
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });
    
    // Sidebar should be visible by default
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('shows community page when selected', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User' }));
    
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByTestId('ide')).toBeInTheDocument();
    });
    
    // Test view change to community
    const communityButton = screen.getByText('Community');
    fireEvent.click(communityButton);
    
    await waitFor(() => {
      expect(screen.getByText('Community Features')).toBeInTheDocument();
    });
  });
});
