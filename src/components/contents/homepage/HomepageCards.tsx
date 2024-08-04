import React, { useState } from 'react';
import { Card, CardContent, Grid, Typography, Box } from '@mui/material';
import { useInView } from 'react-intersection-observer';

interface HomepageCardProps {
  title: string;
  icon: React.ReactElement;
  description: string;
}

const HomepageCard: React.FC<HomepageCardProps> = ({ title, icon, description }) => {
  const { ref, inView } = useInView({
    threshold: 0.1, // Déclenche l'animation quand 10% de la carte est visible
  });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Grid 
      item 
      xs={12} 
      md={4} 
      display="flex" 
      alignItems="stretch"
      sx={{ 
        mb: 2,
        mt: 2,
        padding: 2,
        transform: inView ? 'translateY(0)' : 'translateY(100px)',
        opacity: inView ? 1 : 0,
        transition: 'all 1s ease-in-out',
      }}
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card 
        sx={{ 
          textAlign: 'center', 
          width: '100%', 
          borderRadius: 10, 
          color: '#ffffff',
          backgroundColor: (theme) => theme.palette.secondary.light,
          boxShadow: '5px 5px 8px rgba(0, 0, 0, 0.5)',
          transform: isHovered ? 'scale(1.10)' : 'scale(1)',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <CardContent sx={{ borderColor: '#000' }}>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="h5" component="div" sx={{ mt: 1 }}>
            {icon}
          </Typography>
          <Typography variant="body1" component="div">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

interface HomepageCardsProps {
  children: React.ReactNode;
}

const HomepageCards: React.FC<HomepageCardsProps> & { Card: typeof HomepageCard } = ({ children }) => {
  return (
    <Grid 
      container 
      spacing={5} 
      sx={{
        mb: 2,
        padding: 2,
      }}
    >
      {children}
    </Grid>
  );
};

HomepageCards.Card = HomepageCard;

export { HomepageCards };