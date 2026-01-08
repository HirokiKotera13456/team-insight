import React from 'react';
import { Card, CardContent, Typography, Button, Box, alpha } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { ArrowForward } from '@mui/icons-material';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    startIcon?: React.ReactNode;
  };
  sx?: SxProps<Theme>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  sx,
}) => {
  return (
    <Card
      sx={{
        textAlign: 'center',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(139, 92, 246, 0.03) 50%, rgba(217, 70, 239, 0.02) 100%)',
        border: '1px solid',
        borderColor: alpha('#6366f1', 0.1),
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '3px',
          background: 'linear-gradient(90deg, transparent 0%, #6366f1 20%, #8b5cf6 50%, #d946ef 80%, transparent 100%)',
          borderRadius: 2,
        },
        ...sx,
      }}
    >
      <CardContent sx={{ p: { xs: 4, md: 6 }, pt: { xs: 5, md: 7 } }}>
        {/* 背景装飾 */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* アイコン */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 3,
            position: 'relative',
          }}
        >
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)',
              '& svg': {
                fontSize: 48,
                color: '#fff',
              },
            }}
          >
            {icon}
          </Box>
        </Box>

        {/* タイトル */}
        <Typography
          variant="h5"
          gutterBottom
          fontWeight="bold"
          sx={{
            background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            position: 'relative',
          }}
        >
          {title}
        </Typography>

        {/* 説明 */}
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 4,
            maxWidth: 450,
            mx: 'auto',
            lineHeight: 1.8,
            position: 'relative',
          }}
        >
          {description}
        </Typography>

        {/* アクションボタン */}
        {action && (
          <Button
            variant="contained"
            size="large"
            startIcon={action.startIcon}
            endIcon={<ArrowForward />}
            onClick={action.onClick}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
              position: 'relative',
              '&:hover': {
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                filter: 'brightness(1.1)',
                boxShadow: '0 12px 32px rgba(99, 102, 241, 0.5)',
              },
            }}
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
