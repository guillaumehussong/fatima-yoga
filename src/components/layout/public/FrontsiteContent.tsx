import React from 'react';
import { Typography, Box } from '@mui/material';
import { HeadMeta } from '../HeadMeta';
import Background from '../Background'; // Assurez-vous d'importer correctement le composant

interface FrontsiteContentProps {
  title: string;
  hideTitleMeta?: boolean;
  hideTitle?: boolean;
  description?: string;
  children: React.ReactNode;
}

export const FrontsiteContent: React.FC<FrontsiteContentProps> = ({ title, hideTitleMeta, hideTitle, description, children }) => {
  const subtitle = `Fátima Domíguez Yoga Hésingue`;
  return (
    <>
      <HeadMeta title={hideTitleMeta ? subtitle : `${title} · ${subtitle}`} description={description} />
      <Box sx={{ position: 'relative' }}>
        {title && !hideTitle && (
          <Typography variant="h4">{title}</Typography>
        )}
        {children}
      </Box>
    </>
  );
};