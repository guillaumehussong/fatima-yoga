import { Box } from '@mui/material';
import Accueil from '../../contents/accueil.mdx';

const BackgroundBox = () => (
  <Box
    sx={{
      position: 'relative',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      zIndex: -1, // Ensure the background is behind other content
    }}
  />
);

const AccueilPage = () => (
  <>
    <Accueil />
  </>
);

export default AccueilPage;