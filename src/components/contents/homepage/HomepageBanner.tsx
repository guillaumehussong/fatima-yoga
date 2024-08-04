import React, { useEffect, useState } from 'react';
import { Box, Grid, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { tr } from 'date-fns/locale';

interface HomepageBannerProps {
  imageUrl: string;
  items: string[];
  leftText: string;
}

export const HomepageBanner: React.FC<HomepageBannerProps> = ({ items, leftText }) => {

  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (visibleItems.length < items.length) {
      timer = setTimeout(() => {
        setVisibleItems((prev) => [...prev, prev.length]);
      }, 1000); // Change delay as needed
    }

    return () => clearTimeout(timer);
  }, [visibleItems, items.length]);
  
  return (
    <Paper
      sx={{
        position: 'relative',
        color: '#3E464C',
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top',
        backgroundColor: 'transparent',
        width: '100vw',
        height: '90vh', // Increase the height as needed
        left: '50%',
        right: '50%',
        zIndex: 100,
        p: 0,
        m: 0,
        transform: 'translateX(-50%)',
      }}
    >
      {/*<Grid container>
        {/* Bloc de texte à gauche 
        <Grid item xs={12} md={6} lg={4}>
          <Box
            sx={{
              position: 'relative',
              px: { xs: 3, md: 10 },
              py: { xs: 2, md: 4 },
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              textAlign: 'left',
              height: '100%',
              fontSize: '22px',
              maxWidth: '800px', // Définir une largeur maximale pour le texte
              whiteSpace: 'normal', // Permettre au texte de passer à la ligne
            }}
          >
            <Typography variant="h5" sx={{ color: 'black', fontSize: 18}}>
              {leftText}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} lg={14}>
          <Box
            sx={{
              position: 'relative',
              px: { xs: 3, md: 44 },
              py: { xs: 2, md: 40 },
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
              textAlign: 'right',
            }}
          >
            <List sx={{ display: 'flex', flexDirection: 'column', p: 3 }}>
              {items.map((item, index) => (
                <ListItem
                  key={index}
                  sx={{
                    width: 'auto',
                    color: 'black',
                    textAlign: 'right',
                    fontSize: '32px',
                    opacity: visibleItems.includes(index) ? 1 : 0,
                    transition: 'opacity 1s ease-in',
                  }}
                >
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
      </Grid>*/}
    </Paper>
  );
};