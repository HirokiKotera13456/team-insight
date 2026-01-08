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
  Stack,
  Snackbar,
  Alert,
  Grid,
  alpha,
} from '@mui/material';
import { Google, CheckCircle, TrendingUp, Insights, ArrowForward, Security } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { signInWithGoogle } from '@/lib/auth';
import { saveUserData } from '@/lib/firestore';
import { LOGIN_COPY } from '@/data/copy';

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

  const featureIcons = [
    { icon: TrendingUp, gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' },
    { icon: Insights, gradient: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)' },
    { icon: CheckCircle, gradient: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: '#f8fafc',
      }}
    >
      {/* 背景装飾 */}
      <Box
        sx={{
          position: 'absolute',
          top: -200,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
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
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            py: { xs: 4, md: 8 },
          }}
        >
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
            {/* 左側：説明エリア */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: { xs: 4, md: 0 } }}>
                {/* ロゴ */}
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1.5,
                    mb: 4,
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Insights sx={{ color: '#fff', fontSize: 18 }} />
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {LOGIN_COPY.title}
                  </Typography>
                </Box>

                {/* メインコピー */}
                <Typography
                  variant="h3"
                  component="h1"
                  fontWeight="bold"
                  sx={{
                    mb: 2,
                    background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.3,
                  }}
                >
                  {LOGIN_COPY.subtitle}
                </Typography>

                {/* 特徴リスト */}
                <Stack spacing={2.5} sx={{ mt: 4 }}>
                  {LOGIN_COPY.features.map((feature, index) => {
                    const { icon: Icon, gradient } = featureIcons[index];
                    return (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 2.5,
                          p: 2.5,
                          borderRadius: 3,
                          backgroundColor: '#fff',
                          border: '1px solid',
                          borderColor: alpha('#6366f1', 0.1),
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateX(4px)',
                            boxShadow: `0 8px 24px ${alpha('#6366f1', 0.1)}`,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2.5,
                            background: gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: `0 8px 16px ${alpha(gradient.includes('#6366f1') ? '#6366f1' : gradient.includes('#8b5cf6') ? '#8b5cf6' : '#06b6d4', 0.3)}`,
                          }}
                        >
                          <Icon sx={{ color: '#fff', fontSize: 22 }} />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#1e293b' }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.7 }}>
                            {feature.description}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            </Grid>

            {/* 右側：ログインカード */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                  border: '1px solid',
                  borderColor: alpha('#6366f1', 0.1),
                  backgroundColor: '#fff',
                  position: 'relative',
                  overflow: 'hidden',
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
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                      variant="h5"
                      component="h2"
                      fontWeight="bold"
                      gutterBottom
                      sx={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {LOGIN_COPY.card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {LOGIN_COPY.card.description}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={signingIn ? <CircularProgress size={20} color="inherit" /> : <Google />}
                    endIcon={!signingIn && <ArrowForward />}
                    onClick={handleGoogleSignIn}
                    disabled={signingIn}
                    sx={{
                      py: 1.75,
                      mb: 3,
                      fontSize: '1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
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
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {signingIn ? 'ログイン中...' : LOGIN_COPY.card.button}
                  </Button>

                  <Box
                    sx={{
                      mt: 4,
                      pt: 3,
                      borderTop: '1px solid',
                      borderColor: alpha('#6366f1', 0.1),
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Security sx={{ fontSize: 16, color: '#64748b' }} />
                      <Typography variant="caption" fontWeight="600" color="text.secondary">
                        {LOGIN_COPY.privacy.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', textAlign: 'center', lineHeight: 1.6 }}
                    >
                      {LOGIN_COPY.privacy.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
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
