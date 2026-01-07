import { signInWithGoogle, signOut } from '../auth';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '../firebase';
import { User } from 'firebase/auth';

// Mock Firebase Auth
jest.mock('firebase/auth', () => {
  const mockSignInWithPopup = jest.fn();
  const mockSignOut = jest.fn();
  const mockGoogleAuthProviderInstance = {};
  
  return {
    GoogleAuthProvider: jest.fn().mockImplementation(() => mockGoogleAuthProviderInstance),
    signInWithPopup: mockSignInWithPopup,
    signOut: mockSignOut,
    __mockSignInWithPopup: mockSignInWithPopup,
    __mockSignOut: mockSignOut,
    __mockGoogleAuthProviderInstance: mockGoogleAuthProviderInstance,
  };
});

jest.mock('../firebase', () => ({
  auth: {},
}));

// Get mocked functions
const firebaseAuth = require('firebase/auth');
const mockSignInWithPopup = firebaseAuth.__mockSignInWithPopup;
const mockSignOut = firebaseAuth.__mockSignOut;
const mockGoogleAuthProviderInstance = firebaseAuth.__mockGoogleAuthProviderInstance;

describe('auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signInWithGoogle', () => {
    it('should sign in with Google and return user', async () => {
      const mockUser: Partial<User> = {
        uid: 'test-uid',
        displayName: 'Test User',
        email: 'test@example.com',
      };

      const mockResult = {
        user: mockUser,
      };

      mockSignInWithPopup.mockResolvedValue(mockResult);

      const result = await signInWithGoogle();

      // signInWithPopup should be called with auth and a GoogleAuthProvider instance
      expect(mockSignInWithPopup).toHaveBeenCalledWith(
        auth,
        expect.anything()
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw error when sign in fails', async () => {
      const error = new Error('Sign in failed');
      mockSignInWithPopup.mockRejectedValue(error);

      await expect(signInWithGoogle()).rejects.toThrow('Sign in failed');
    });
  });

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      mockSignOut.mockResolvedValue(undefined);

      await signOut();

      expect(mockSignOut).toHaveBeenCalledWith(auth);
    });

    it('should throw error when sign out fails', async () => {
      const error = new Error('Sign out failed');
      mockSignOut.mockRejectedValue(error);

      await expect(signOut()).rejects.toThrow('Sign out failed');
    });
  });
});
