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
} from '@mui/material';
import { Google, CheckCircle, TrendingUp, Insights } from '@mui/icons-material';
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

  const iconMap = {
    trendingUp: <TrendingUp />,
    insights: <Insights />,
    checkCircle: <CheckCircle />,
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            py: { xs: 4, md: 8 },
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ color: 'white', mb: { xs: 4, md: 0 } }}>
                <Typography
                  variant="h2"
                  component="h1"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    mb: 2,
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {LOGIN_COPY.title}
                </Typography>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    mb: 2,
                    opacity: 0.95,
                    fontWeight: 500,
                  }}
                >
                  {LOGIN_COPY.subtitle}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    lineHeight: 1.8,
                  }}
                >
                  {LOGIN_COPY.description}
                </Typography>
                <Stack spacing={2}>
                  {LOGIN_COPY.features.map((feature, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Box
                        sx={{
                          color: 'white',
                          '& svg': {
                            fontSize: 28,
                          },
                        }}
                      >
                        {iconMap[feature.icon as keyof typeof iconMap]}
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" component="h3" fontWeight="600" gutterBottom>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.7 }}>
                          {feature.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                }}
              >
                <CardContent sx={{ p: { xs: 4, md: 5 } }}>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                      {LOGIN_COPY.card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {LOGIN_COPY.card.description}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={signingIn ? <CircularProgress size={20} color="inherit" /> : <Google />}
                    onClick={handleGoogleSignIn}
                    disabled={signingIn}
                    sx={{
                      py: 1.75,
                      mb: 3,
                      fontSize: '1rem',
                      fontWeight: 600,
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      '&:hover': {
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {signingIn ? 'ログイン中...' : LOGIN_COPY.card.button}
                  </Button>

                  <Box
                    sx={{
                      mt: 4,
                      pt: 3,
                      borderTop: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                      <Box component="span" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                        {LOGIN_COPY.privacy.title}
                      </Box>
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
