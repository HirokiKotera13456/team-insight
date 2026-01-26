import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  CircularProgress,
  Backdrop,
  Snackbar,
  Alert,
  alpha,
} from '@mui/material';
import { Google, Insights } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { signInWithGoogle } from '@/lib/auth';
import { saveUserData } from '@/lib/firestore';

const Login: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.push('/app');
    }
  }, [user, loading, router]);

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

  if (loading) {
    return (
      <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (user) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      }}
    >
      {/* 背景装飾 */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {/* タイトル: team-insight with ロゴ */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 0,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 24px ${alpha('#6366f1', 0.3)}`,
              }}
            >
              <Insights sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              team-insight
            </Typography>
          </Box>

          <Card
            sx={{
              borderRadius: 0,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
              border: '1px solid',
              borderColor: alpha('#6366f1', 0.1),
              backgroundColor: '#fff',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              width: '100%',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
              },
            }}
          >
            <CardContent sx={{ p: { xs: 4, md: 5 }, pt: { xs: 5, md: 6 } }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                {/* タイトル: ログイン */}
                <Typography
                  variant="h4"
                  component="h2"
                  fontWeight="bold"
                  sx={{
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  ログイン
                </Typography>

              {/* Googleログインボタン */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={signingIn ? <CircularProgress size={20} color="inherit" /> : <Google />}
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                sx={{
                  py: 1.75,
                  mt: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 0,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    boxShadow: '0 12px 32px rgba(99, 102, 241, 0.5)',
                    transform: 'translateY(-2px)',
                    filter: 'brightness(1.05)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    opacity: 0.7,
                  },
                }}
              >
                {signingIn ? 'ログイン中...' : 'Googleでログイン'}
              </Button>
            </Box>
          </CardContent>
        </Card>
        </Box>
      </Container>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
