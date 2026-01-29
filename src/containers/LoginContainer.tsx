import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { signInWithGoogle } from '@/lib/auth';
import { saveUserData } from '@/lib/firestore';
import { LoginPresentation } from '@/components/presentation/LoginPresentation';

export const LoginContainer: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!loading && user) {
      router.push('/app');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setSigningIn(true);
      setError(null);
      const user = await signInWithGoogle();
      await saveUserData(user);
      router.push('/app');
    } catch (err) {
      console.error('ログインエラー:', err);
      setError('ログインに失敗しました。もう一度お試しください。');
    } finally {
      setSigningIn(false);
    }
  };

  const handleGuestLogin = () => {
    router.push('/app');
  };

  const handleCloseError = () => {
    setError(null);
  };

  if (user) {
    return null;
  }

  return (
    <LoginPresentation
      loading={loading}
      signingIn={signingIn}
      error={error}
      mousePosition={mousePosition}
      onGoogleSignIn={handleGoogleSignIn}
      onGuestLogin={handleGuestLogin}
      onCloseError={handleCloseError}
    />
  );
};
