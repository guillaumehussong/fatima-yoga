import React from 'react';
import { Chip, Divider, Stack } from '@mui/material';
import { ArrowDownward, ExpandMore } from '@mui/icons-material';

interface HomepageDividerProps {
  children: string;
  arrows?: boolean;
}

export const HomepageDivider: React.FC<HomepageDividerProps> = ({ children, arrows }) => {
  const renderLabel = () => arrows ? (
    <Stack direction="row" spacing={1}>
      {children}
    </Stack>  
  ) : children; 

  return (
    <Divider textAlign="center" sx={{ mb: 2 }}>
      <Chip label={renderLabel()} />
    </Divider>
  );
};
