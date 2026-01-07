import React from 'react';
import { useRouter } from 'next/router';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
  Chip,
  useTheme,
} from '@mui/material';
import { ArrowBack, AccountCircle } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';

interface FocusLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
}

export const FocusLayout: React.FC<FocusLayoutProps> = ({
  children,
  title = '診断',
  showBackButton = true,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
          {showBackButton && (
            <IconButton
              edge="start"
              onClick={() => router.push('/app')}
              sx={{ mr: 2 }}
              aria-label="戻る"
            >
              <ArrowBack />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            TeamInsight
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label="診断中"
              size="small"
              sx={{
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                color: 'primary.main',
                fontSize: '0.75rem',
              }}
            />
            <IconButton
              size="small"
              edge="end"
              sx={{
                border: '2px solid',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
            >
              <Avatar
                src={user?.photoURL || undefined}
                sx={{ width: 28, height: 28 }}
              >
                {user?.displayName?.[0] || <AccountCircle />}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 8,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            py: { xs: 3, md: 5 },
            px: { xs: 2, sm: 3, md: 4 },
            maxWidth: { xs: '100%', sm: '600px', md: '700px' },
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};
