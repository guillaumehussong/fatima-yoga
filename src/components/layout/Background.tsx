import React from 'react';
import { Box } from '@mui/material';

interface BackgroundProps {
  imageUrl: string;
}

const Background: React.FC<BackgroundProps> = ({ imageUrl }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 1, // Ensure the background is behind other content
      }}
    />
  );
};

export default Background;