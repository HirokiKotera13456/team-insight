import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

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
        ...sx,
      }}
    >
      <CardContent sx={{ p: 6 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 3,
            '& svg': {
              fontSize: 64,
              color: 'primary.main',
            },
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
          {description}
        </Typography>
        {action && (
          <Button
            variant="contained"
            size="large"
            startIcon={action.startIcon}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
