import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { AxisScores, UserData } from '@/types';
import { User } from 'firebase/auth';

export const saveUserData = async (user: User): Promise<void> => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userData: UserData = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      email: user.email,
      updatedAt: serverTimestamp(),
    };

    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      // 初回作成時のみ createdAt を設定
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
      });
    } else {
      // 既存ユーザーは updatedAt のみ更新
      await setDoc(userRef, userData, { merge: true });
    }
  } catch (error: any) {
    console.error('ユーザー情報保存エラー:', error);
    // ユーザー情報の保存エラーは警告のみ（ログインは続行可能）
    if (error.code === 'permission-denied') {
      console.warn('Firestore Security Rulesが正しく設定されていない可能性があります。');
    }
  }
};

export const saveAxisScores = async (
  uid: string,
  scores: AxisScores
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    const latestRef = doc(db, 'users', uid, 'axis_scores', 'latest');

    // ユーザー情報を更新（初回作成時）
    await setDoc(
      userRef,
      {
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    // スコアを保存
    await setDoc(latestRef, {
      ...scores,
      answeredAt: serverTimestamp(),
      version: 'axis_v1',
    });
  } catch (error: any) {
    console.error('Firestore保存エラー:', error);
    // より詳細なエラーメッセージを提供
    if (error.code === 'permission-denied') {
      throw new Error('権限がありません。Firestore Security Rulesを確認してください。');
    } else if (error.code === 'unavailable') {
      throw new Error('Firestoreサービスが利用できません。ネットワーク接続を確認してください。');
    } else {
      throw new Error(`保存に失敗しました: ${error.message || '不明なエラー'}`);
    }
  }
};

export const getLatestAxisScores = async (
  uid: string
): Promise<AxisScores | null> => {
  const latestRef = doc(db, 'users', uid, 'axis_scores', 'latest');
  const docSnap = await getDoc(latestRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    energy: data.energy,
    thinking: data.thinking,
    planning: data.planning,
    vision: data.vision,
  } as AxisScores;
};
