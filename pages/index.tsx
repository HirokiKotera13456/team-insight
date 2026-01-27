import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { Box, CircularProgress, Backdrop } from '@mui/material';

const Home: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // ログインしている場合も、ログインしていない場合も/appにリダイレクト
      // /app側でProtectedRouteのallowGuestにより、ログインなしでもアクセス可能
      router.push('/app');
    }
  }, [user, loading, router]);

  return (
    <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Home;
