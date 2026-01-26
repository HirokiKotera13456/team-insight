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
  useMediaQuery,
} from '@mui/material';
import { ArrowBack, AccountCircle } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { APP_BAR_HEIGHT } from '@/constants/layout';

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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
        <Toolbar 
          sx={{ 
            px: { xs: 1, sm: 2, md: 3 },
            minHeight: { xs: '56px !important', md: `${APP_BAR_HEIGHT}px !important` },
            height: { xs: '56px', md: `${APP_BAR_HEIGHT}px` },
          }}
        >
          {showBackButton && (
            <IconButton
              edge="start"
              onClick={() => router.push('/app')}
              sx={{ mr: { xs: 1, sm: 2 } }}
              aria-label="戻る"
              size="small"
            >
              <ArrowBack />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1, md: 2 } }}>
            <Chip
              label="診断中"
              size="small"
              sx={{
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                color: 'primary.main',
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                height: { xs: 20, sm: 24 },
                display: { xs: 'none', sm: 'flex' },
                '& .MuiChip-label': {
                  px: { xs: 0.75, sm: 1 },
                },
              }}
            />
            <IconButton
              size="small"
              edge="end"
              sx={{
                border: '2px solid',
                borderColor: 'divider',
                p: { xs: 0.5, sm: 0.75 },
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
            >
              <Avatar
                src={user?.photoURL || undefined}
                sx={{ width: { xs: 24, sm: 28 }, height: { xs: 24, sm: 28 } }}
              >
                {user?.displayName?.[0] || <AccountCircle sx={{ fontSize: { xs: 18, sm: 20 } }} />}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: { xs: '56px', md: `${APP_BAR_HEIGHT}px` },
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            py: { xs: 2, sm: 3, md: 5 },
            px: { xs: 1.5, sm: 2, md: 4 },
            maxWidth: { xs: '100%', sm: '600px', md: '700px' },
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};
