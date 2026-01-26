import React from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, alpha, Chip } from '@mui/material';
import { BarChart, Assessment, ArrowForward } from '@mui/icons-material';

interface NextActionsProps {
  onViewResult: () => void;
  onReassess: () => void;
}

const actionCards = [
  {
    key: 'result',
    title: '結果をもっと詳しく',
    description: 'グラフと解説で、自分の傾向をじっくり確認できます。',
    icon: BarChart,
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    buttonText: '結果を見る',
    variant: 'contained' as const,
    disabled: false,
    badge: null,
  },
  {
    key: 'reassess',
    title: 'もう一度診断する',
    description: '最近ちょっと変わったかも？と思ったら、再診断してみてください。',
    icon: Assessment,
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    buttonText: '再診断',
    variant: 'outlined' as const,
    disabled: false,
    badge: null,
  },
];

export const NextActions: React.FC<NextActionsProps> = ({
  onViewResult,
  onReassess,
}) => {
  const handlers: Record<string, () => void> = {
    result: onViewResult,
    reassess: onReassess,
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box
          sx={{
            width: 4,
            height: 24,
            borderRadius: 2,
            background: 'linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%)',
          }}
        />
        <Typography variant="h6" fontWeight="bold">
          次のステップ
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {actionCards.map((card) => {
          const Icon = card.icon;
          return (
            <Grid item xs={12} md={4} key={card.key}>
              <Card
                sx={{
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: card.disabled ? 0.7 : 1,
                  '&:hover': {
                    transform: card.disabled ? 'none' : 'translateY(-4px)',
                    boxShadow: card.disabled ? undefined : '0 20px 40px rgba(0,0,0,0.1)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: card.gradient,
                  },
                }}
              >
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2.5,
                        background: card.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 8px 20px ${alpha(card.gradient.includes('#6366f1') ? '#6366f1' : card.gradient.includes('#06b6d4') ? '#06b6d4' : '#f59e0b', 0.3)}`,
                      }}
                    >
                      <Icon sx={{ color: '#fff', fontSize: 24 }} />
                    </Box>
                    {card.badge && (
                      <Chip
                        label={card.badge}
                        size="small"
                        sx={{
                          backgroundColor: alpha('#64748b', 0.1),
                          color: 'text.secondary',
                          fontSize: '0.7rem',
                          height: 24,
                        }}
                      />
                    )}
                  </Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3, flex: 1, lineHeight: 1.7 }}
                  >
                    {card.description}
                  </Typography>
                  <Button
                    variant={card.variant}
                    onClick={handlers[card.key]}
                    disabled={card.disabled}
                    endIcon={!card.disabled && <ArrowForward sx={{ fontSize: 18 }} />}
                    sx={{
                      alignSelf: 'flex-start',
                      ...(card.variant === 'contained' && {
                        background: card.gradient,
                        '&:hover': {
                          background: card.gradient,
                          filter: 'brightness(1.1)',
                        },
                      }),
                    }}
                  >
                    {card.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
