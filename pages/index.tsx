import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Backdrop, CircularProgress } from '@mui/material';

const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // ルートパスにアクセスした場合はログイン画面にリダイレクト
    router.push('/login');
  }, [router]);

  return (
    <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Home;
