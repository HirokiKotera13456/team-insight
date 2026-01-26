import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  BarChart as BarChartIcon,
  AccountCircle,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/auth';
import { SIDEBAR_WIDTH, APP_BAR_HEIGHT, BOTTOM_NAV_HEIGHT } from '@/constants/layout';

const drawerWidth = SIDEBAR_WIDTH;

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
    handleMenuClose();
  };

  const navigationItems = [
    { text: 'ダッシュボード', icon: <DashboardIcon />, path: '/app' },
    { text: '診断', icon: <AssessmentIcon />, path: '/app/assessment' },
    { text: '結果', icon: <BarChartIcon />, path: '/app/result' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        sx={{
          px: 3,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography
          variant="h6"
          component="div"
          fontWeight="bold"
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          WorkInsight
        </Typography>
      </Toolbar>
      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        {navigationItems.map((item) => {
          const isSelected = router.pathname === item.path || 
            (item.path === '/app' && router.pathname === '/app');
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => {
                  router.push(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isSelected ? 'primary.main' : 'text.secondary',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? 'primary.main' : 'text.primary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user?.displayName || user?.email}
            </Typography>
            <IconButton
              size="small"
              edge="end"
              aria-label="account menu"
              onClick={handleMenuOpen}
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
                sx={{ width: 32, height: 32 }}
              >
                {user?.displayName?.[0] || <AccountCircle />}
              </Avatar>
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              },
            }}
          >
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>ログアウト</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
              position: 'fixed',
              top: `${APP_BAR_HEIGHT}px`,
              height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
              overflow: 'auto',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // PC: Sidebar分のマージンを確保
          ml: { md: `${drawerWidth}px` },
          // モバイル: マージンなし
          mt: `${APP_BAR_HEIGHT}px`,
          mb: { xs: `${BOTTOM_NAV_HEIGHT}px`, md: 0 },
          minHeight: { md: `calc(100vh - ${APP_BAR_HEIGHT}px)` },
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: '900px', md: '1200px' },
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 3, md: 5 },
            mx: 'auto',
            flex: 1,
          }}
        >
          {children}
        </Box>
      </Box>

      {isMobile && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
          elevation={0}
        >
          <BottomNavigation
            value={navigationItems.findIndex(
              (item) => router.pathname === item.path || (item.path === '/app' && router.pathname === '/app')
            )}
            onChange={(_, newValue) => {
              router.push(navigationItems[newValue].path);
            }}
            sx={{
              '& .MuiBottomNavigationAction-root': {
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              },
            }}
          >
            {navigationItems.map((item) => (
              <BottomNavigationAction
                key={item.path}
                label={item.text}
                icon={item.icon}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
};
