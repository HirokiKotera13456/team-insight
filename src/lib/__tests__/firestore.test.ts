import {
  saveUserData,
  saveAxisScores,
  getLatestAxisScores,
} from '../firestore';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { AxisScores, UserData } from '@/types';
import { User } from 'firebase/auth';

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  serverTimestamp: jest.fn(() => ({ _methodName: 'serverTimestamp' })),
}));

jest.mock('../firebase', () => ({
  db: {},
}));

describe('firestore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveUserData', () => {
    const mockUser: Partial<User> = {
      uid: 'test-uid',
      displayName: 'Test User',
      photoURL: 'https://example.com/photo.jpg',
      email: 'test@example.com',
    };

    const mockUserRef = {};
    const mockUserDoc = {
      exists: jest.fn(),
    };

    beforeEach(() => {
      (doc as jest.Mock).mockReturnValue(mockUserRef);
      (getDoc as jest.Mock).mockResolvedValue(mockUserDoc);
      (setDoc as jest.Mock).mockResolvedValue(undefined);
    });

    it('should create new user data with createdAt when user does not exist', async () => {
      mockUserDoc.exists.mockReturnValue(false);

      await saveUserData(mockUser as User);

      expect(doc).toHaveBeenCalledWith(db, 'users', 'test-uid');
      expect(getDoc).toHaveBeenCalledWith(mockUserRef);
      expect(setDoc).toHaveBeenCalledWith(
        mockUserRef,
        expect.objectContaining({
          displayName: 'Test User',
          photoURL: 'https://example.com/photo.jpg',
          email: 'test@example.com',
          updatedAt: expect.any(Object),
          createdAt: expect.any(Object),
        })
      );
    });

    it('should update existing user data without createdAt', async () => {
      mockUserDoc.exists.mockReturnValue(true);

      await saveUserData(mockUser as User);

      expect(setDoc).toHaveBeenCalledWith(
        mockUserRef,
        expect.objectContaining({
          displayName: 'Test User',
          photoURL: 'https://example.com/photo.jpg',
          email: 'test@example.com',
          updatedAt: expect.any(Object),
        }),
        { merge: true }
      );
      expect(setDoc).not.toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ createdAt: expect.anything() }),
        expect.anything()
      );
    });

    it('should handle permission-denied error gracefully', async () => {
      mockUserDoc.exists.mockReturnValue(false);
      const error = new Error('Permission denied');
      (error as any).code = 'permission-denied';
      (getDoc as jest.Mock).mockRejectedValue(error);

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await saveUserData(mockUser as User);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Firestore Security Rules')
      );

      consoleWarnSpy.mockRestore();
    });

    it('should handle other errors gracefully', async () => {
      mockUserDoc.exists.mockReturnValue(false);
      const error = new Error('Network error');
      (getDoc as jest.Mock).mockRejectedValue(error);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await saveUserData(mockUser as User);

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('saveAxisScores', () => {
    const uid = 'test-uid';
    const scores: AxisScores = {
      energy: 50,
      thinking: 60,
      planning: 40,
      vision: 70,
    };

    const mockUserRef = {};
    const mockLatestRef = {};

    beforeEach(() => {
      (doc as jest.Mock)
        .mockReturnValueOnce(mockUserRef)
        .mockReturnValueOnce(mockLatestRef);
      (setDoc as jest.Mock).mockResolvedValue(undefined);
    });

    it('should save axis scores successfully', async () => {
      await saveAxisScores(uid, scores);

      expect(doc).toHaveBeenCalledWith(db, 'users', uid);
      expect(doc).toHaveBeenCalledWith(db, 'users', uid, 'axis_scores', 'latest');
      expect(setDoc).toHaveBeenCalledWith(
        mockUserRef,
        { updatedAt: expect.any(Object) },
        { merge: true }
      );
      expect(setDoc).toHaveBeenCalledWith(
        mockLatestRef,
        {
          ...scores,
          answeredAt: expect.any(Object),
          version: 'axis_v1',
        }
      );
    });

    it('should throw error with permission-denied message', async () => {
      const error = new Error('Permission denied');
      (error as any).code = 'permission-denied';
      (setDoc as jest.Mock).mockRejectedValue(error);

      await expect(saveAxisScores(uid, scores)).rejects.toThrow(
        '権限がありません。Firestore Security Rulesを確認してください。'
      );
    });

    it('should throw error with unavailable message', async () => {
      const error = new Error('Service unavailable');
      (error as any).code = 'unavailable';
      (setDoc as jest.Mock).mockRejectedValue(error);

      await expect(saveAxisScores(uid, scores)).rejects.toThrow(
        'Firestoreサービスが利用できません。ネットワーク接続を確認してください。'
      );
    });

    it('should throw error with generic message for other errors', async () => {
      const error = new Error('Unknown error');
      (setDoc as jest.Mock).mockRejectedValue(error);

      await expect(saveAxisScores(uid, scores)).rejects.toThrow(
        '保存に失敗しました: Unknown error'
      );
    });
  });

  describe('getLatestAxisScores', () => {
    const uid = 'test-uid';
    const mockLatestRef = {};
    const mockDocSnap = {
      exists: jest.fn(),
      data: jest.fn(),
    };

    beforeEach(() => {
      (doc as jest.Mock).mockReturnValue(mockLatestRef);
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnap);
    });

    it('should return axis scores when document exists', async () => {
      const scores: AxisScores = {
        energy: 50,
        thinking: 60,
        planning: 40,
        vision: 70,
      };

      mockDocSnap.exists.mockReturnValue(true);
      mockDocSnap.data.mockReturnValue(scores);

      const result = await getLatestAxisScores(uid);

      expect(doc).toHaveBeenCalledWith(db, 'users', uid, 'axis_scores', 'latest');
      expect(getDoc).toHaveBeenCalledWith(mockLatestRef);
      expect(result).toEqual(scores);
    });

    it('should return null when document does not exist', async () => {
      mockDocSnap.exists.mockReturnValue(false);

      const result = await getLatestAxisScores(uid);

      expect(result).toBe(null);
    });

    it('should extract only axis score fields', async () => {
      const data = {
        energy: 50,
        thinking: 60,
        planning: 40,
        vision: 70,
        answeredAt: { seconds: 1234567890 },
        version: 'axis_v1',
        extraField: 'should be ignored',
      };

      mockDocSnap.exists.mockReturnValue(true);
      mockDocSnap.data.mockReturnValue(data);

      const result = await getLatestAxisScores(uid);

      expect(result).toEqual({
        energy: 50,
        thinking: 60,
        planning: 40,
        vision: 70,
      });
    });
  });
});
