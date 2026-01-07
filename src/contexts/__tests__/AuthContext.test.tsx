import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));

jest.mock('@/lib/firebase', () => ({
  auth: {},
}));

describe('AuthContext', () => {
  let mockUnsubscribe: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUnsubscribe = jest.fn();
    (onAuthStateChanged as jest.Mock).mockReturnValue(mockUnsubscribe);
  });

  it('should provide initial loading state', () => {
    const TestComponent = () => {
      const { user, loading } = useAuth();
      return (
        <div>
          <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
          <div data-testid="user">{user ? 'user' : 'no-user'}</div>
        </div>
      );
    };

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByTestId('loading')).toHaveTextContent('loading');
    expect(getByTestId('user')).toHaveTextContent('no-user');
  });

  it('should update user when auth state changes', async () => {
    const mockUser: Partial<User> = {
      uid: 'test-uid',
      displayName: 'Test User',
      email: 'test@example.com',
    };

    let authStateCallback: ((user: User | null) => void) | undefined;

    (onAuthStateChanged as jest.Mock).mockImplementation((authInstance, callback) => {
      authStateCallback = callback;
      return mockUnsubscribe;
    });

    const TestComponent = () => {
      const { user, loading } = useAuth();
      return (
        <div>
          <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
          <div data-testid="user">{user ? user.uid : 'no-user'}</div>
        </div>
      );
    };

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Simulate auth state change
    act(() => {
      if (authStateCallback) {
        authStateCallback(mockUser as User);
      }
    });

    await waitFor(() => {
      expect(getByTestId('loading')).toHaveTextContent('not-loading');
      expect(getByTestId('user')).toHaveTextContent('test-uid');
    });
  });

  it('should set user to null when signed out', async () => {
    let authStateCallback: ((user: User | null) => void) | undefined;

    (onAuthStateChanged as jest.Mock).mockImplementation((authInstance, callback) => {
      authStateCallback = callback;
      return mockUnsubscribe;
    });

    const TestComponent = () => {
      const { user, loading } = useAuth();
      return (
        <div>
          <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
          <div data-testid="user">{user ? 'user' : 'no-user'}</div>
        </div>
      );
    };

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Simulate sign out
    act(() => {
      if (authStateCallback) {
        authStateCallback(null);
      }
    });

    await waitFor(() => {
      expect(getByTestId('loading')).toHaveTextContent('not-loading');
      expect(getByTestId('user')).toHaveTextContent('no-user');
    });
  });

  it('should unsubscribe on unmount', () => {
    const { unmount } = render(
      <AuthProvider>
        <div>Test</div>
      </AuthProvider>
    );

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('should call onAuthStateChanged with auth instance', () => {
    render(
      <AuthProvider>
        <div>Test</div>
      </AuthProvider>
    );

    expect(onAuthStateChanged).toHaveBeenCalledWith(auth, expect.any(Function));
  });
});
