import React from 'react';
import { Box, Typography, Button, Stack, Card, CardContent } from '@mui/material';
import { BarChart, CompareArrows, Assessment } from '@mui/icons-material';

interface NextActionsProps {
  onViewResult: () => void;
  onCompare: () => void;
  onReassess: () => void;
}

export const NextActions: React.FC<NextActionsProps> = ({
  onViewResult,
  onCompare,
  onReassess,
}) => {
  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        次にできること
      </Typography>
      <Stack spacing={3}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <BarChart sx={{ color: 'primary.main', mt: 0.5 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  詳しい結果を見る
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  レーダーチャートと文章解説で、より詳しく自分の傾向を理解できます。
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<BarChart />}
                  onClick={onViewResult}
                >
                  結果を見る
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <CompareArrows sx={{ color: 'text.secondary', mt: 0.5 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  他の人と比較する
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  チームや他ユーザーとの違いを見ることで、相互理解を深められます。
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<CompareArrows />}
                  onClick={onCompare}
                  disabled
                >
                  準備中
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Assessment sx={{ color: 'text.secondary', mt: 0.5 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  再診断する
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  最近変わったと感じる場合や、改めて自分の傾向を確認したい場合に。
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Assessment />}
                  onClick={onReassess}
                >
                  再診断
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};
