import React from 'react';
import { Box, Grid, Typography, Link as MuiLink, CardContent, Card } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { HeadMeta } from '../components/layout/HeadMeta';
import Link from 'next/link';

const EmailSentPage: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <HeadMeta title="Conexión a Fátima Domíguez Yoga: correo enviado" />
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={9} md={6} lg={4} xl={3}>
          <Box sx={{ my: 3, mx: 2 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" component="div" textAlign="center" sx={{ mb: 2 }}>
                  Correo enviado
                </Typography>
                <Typography paragraph sx={{ mb: 0 }}>
                  Consulta tu bandeja de entrada, te hemos enviado un enlace para que te conectes al sitio.
                </Typography>
              </CardContent>
            </Card>
            <Box textAlign="center" sx={{ mt: 2 }}>
              <Link href="/" passHref legacyBehavior>
                <MuiLink>
                  Volver a la página de inicio
                </MuiLink>
              </Link>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default EmailSentPage;
