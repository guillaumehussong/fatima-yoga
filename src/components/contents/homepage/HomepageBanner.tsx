import React, { useEffect, useState } from 'react';
import { Box, Grid, List, ListItem, ListItemText, Paper } from '@mui/material';

interface HomepageBannerProps {
  imageUrl: string;
  items: string[];
}

export const HomepageBanner: React.FC<HomepageBannerProps> = ({ imageUrl, items }) => {

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
        backgroundImage: `url(${imageUrl})`,
        backgroundColor: '#3E464C',
        width: '100vw',
        height: '100vh', // Increase the height as needed
        left: '50%',
        right: '50%',
        p: 0,
        m: 0,
        transform: 'translateX(-50%)',
      }}
    >
      {/* Increase the priority of the background image */}
      {<img style={{ display: 'none' }} src={imageUrl} alt="Background" />}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,0)',
        }}
      />
      <Grid container>
        <Grid item xs={12}>
          <Box
            sx={{
              position: 'relative',
              px: { xs: 3, md: 70 },
              py: { xs: 2, md: 40 },
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <List sx={{ display: 'flex', flexDirection: 'column', p: 3 }}>
                {items.map((item, index) => (
                  <ListItem
                  key={index}
                  sx={{
                    width: 'auto',
                    color: 'black',
                    textAlign: 'center',
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
      </Grid>
    </Paper>
  );
};