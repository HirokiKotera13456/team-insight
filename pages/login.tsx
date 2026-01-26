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
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
      }}
    >
      {/* 背景装飾 - 複数のグラデーション円（マウス追従） */}
      <Box
        sx={{
          position: 'absolute',
          top: -200,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0.06) 40%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'pulse 8s ease-in-out infinite',
          transform: `translate(${(mousePosition.x - 50) * 0.3}px, ${(mousePosition.y - 50) * 0.3}px)`,
          transition: 'transform 0.3s ease-out',
          '@keyframes pulse': {
            '0%, 100%': {
              transform: 'scale(1)',
              opacity: 1,
            },
            '50%': {
              transform: 'scale(1.1)',
              opacity: 0.8,
            },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 40%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'pulse2 10s ease-in-out infinite',
          transform: `translate(${(mousePosition.x - 50) * -0.2}px, ${(mousePosition.y - 50) * -0.2}px)`,
          transition: 'transform 0.3s ease-out',
          '@keyframes pulse2': {
            '0%, 100%': {
              transform: 'scale(1)',
              opacity: 1,
            },
            '50%': {
              transform: 'scale(1.15)',
              opacity: 0.7,
            },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217, 70, 239, 0.04) 0%, transparent 60%)',
          pointerEvents: 'none',
          transform: `translate(calc(-50% + ${(mousePosition.x - 50) * 0.1}px), calc(-50% + ${(mousePosition.y - 50) * 0.1}px))`,
          transition: 'transform 0.3s ease-out',
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
              gap: 3,
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: 0,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 12px 32px ${alpha('#6366f1', 0.4)}, 0 4px 12px ${alpha('#8b5cf6', 0.3)}`,
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: `translate(${(mousePosition.x - 50) * 0.05}px, ${(mousePosition.y - 50) * 0.05}px) rotateX(${(mousePosition.y - 50) * 0.1}deg) rotateY(${(mousePosition.x - 50) * 0.1}deg)`,
                transformStyle: 'preserve-3d',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: -2,
                  borderRadius: 0,
                  padding: 2,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                },
                '&:hover': {
                  transform: `translate(${(mousePosition.x - 50) * 0.05}px, ${(mousePosition.y - 50) * 0.05}px) translateY(-4px) scale(1.05) rotateX(${(mousePosition.y - 50) * 0.15}deg) rotateY(${(mousePosition.x - 50) * 0.15}deg)`,
                  boxShadow: `0 16px 40px ${alpha('#6366f1', 0.5)}, 0 8px 16px ${alpha('#8b5cf6', 0.4)}`,
                  '&::before': {
                    opacity: 0.3,
                  },
                },
              }}
            >
              <Insights sx={{ color: '#fff', fontSize: 36 }} />
            </Box>
            <Box>
              <Typography
                variant="h2"
                component="h1"
                fontWeight="bold"
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}
              >
                team-insight
              </Typography>
            </Box>
          </Box>

          <Card
            sx={{
              borderRadius: 0,
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.15),
                0 0 0 1px ${alpha('#6366f1', 0.08)},
                inset 0 1px 0 ${alpha('#fff', 0.9)}
              `,
              border: '1px solid',
              borderColor: alpha('#6366f1', 0.15),
              backgroundColor: '#fff',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              width: '100%',
              transform: `perspective(1000px) rotateX(${(mousePosition.y - 50) * 0.02}deg) rotateY(${(mousePosition.x - 50) * 0.02}deg)`,
              transformStyle: 'preserve-3d',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '5px',
                background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 30%, #d946ef 60%, #8b5cf6 100%)',
                backgroundSize: '200% 100%',
                animation: 'gradientShift 3s ease infinite',
                '@keyframes gradientShift': {
                  '0%': {
                    backgroundPosition: '0% 50%',
                  },
                  '50%': {
                    backgroundPosition: '100% 50%',
                  },
                  '100%': {
                    backgroundPosition: '0% 50%',
                  },
                },
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(139, 92, 246, 0.02) 50%, rgba(217, 70, 239, 0.01) 100%)',
                pointerEvents: 'none',
              },
            }}
          >
            <CardContent sx={{ p: { xs: 5, md: 6 }, pt: { xs: 6, md: 7 }, position: 'relative', zIndex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {/* タイトル: ログイン */}
                <Box sx={{ textAlign: 'center', width: '100%' }}>
                  <Typography
                    variant="h4"
                    component="h2"
                    fontWeight="bold"
                    sx={{
                      mb: 0.5,
                      background: 'linear-gradient(135deg, #1e293b 0%, #475569 50%, #64748b 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    ログイン
                  </Typography>
                  <Box
                    sx={{
                      width: 60,
                      height: 3,
                      mx: 'auto',
                      background: 'linear-gradient(90deg, transparent 0%, #6366f1 50%, transparent 100%)',
                      borderRadius: 2,
                    }}
                  />
                </Box>

              {/* Googleログインボタン */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={signingIn ? <CircularProgress size={22} color="inherit" /> : <Google sx={{ fontSize: 22 }} />}
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                sx={{
                  py: 2,
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  borderRadius: 0,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
                  backgroundSize: '200% 100%',
                  boxShadow: `
                    0 12px 32px ${alpha('#6366f1', 0.4)},
                    0 4px 12px ${alpha('#8b5cf6', 0.3)},
                    inset 0 1px 0 ${alpha('#fff', 0.2)}
                  `,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    transition: 'left 0.5s',
                  },
                  '&:hover': {
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
                    backgroundPosition: '100% 0',
                    boxShadow: `
                      0 16px 40px ${alpha('#6366f1', 0.5)},
                      0 8px 16px ${alpha('#8b5cf6', 0.4)},
                      inset 0 1px 0 ${alpha('#fff', 0.3)}
                    `,
                    transform: 'translateY(-3px) scale(1.01)',
                    filter: 'brightness(1.08)',
                    '&::before': {
                      left: '100%',
                    },
                  },
                  '&:active': {
                    transform: 'translateY(-1px) scale(0.99)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
                    opacity: 0.7,
                    transform: 'none',
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
