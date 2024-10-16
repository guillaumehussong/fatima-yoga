import React, { Fragment, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  Container,
  Divider,
  Grid, IconButton,
  Link as MuiLink, ListItemIcon, ListItemText, Menu, MenuItem,
  Skeleton,
  Stack,
  Toolbar,
  useMediaQuery, useTheme,
} from '@mui/material';
import { AlignVerticalTop, Menu as MenuIcon, Person } from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { OptionalLink } from '../../OptionalLink';
import { te } from 'date-fns/locale';
import zIndex from '@mui/material/styles/zIndex';

interface MenuTitleProps {
  logo: React.ReactElement;
  title: string;
  titleUrl: string;
  onClick?: () => void;
}

const MenuTitle: React.FC<MenuTitleProps> = ({ logo, title, titleUrl, onClick }) => {
  return (
    <Link href={titleUrl} passHref legacyBehavior>
      <MuiLink
        variant="h5"
        color="inherit"
        noWrap
        onClick={() => onClick && onClick()}
        sx={{ pr: 2, flexShrink: 0, textDecoration: 'none' }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {logo}
          <Box>
            {title}
          </Box>
        </Stack>
      </MuiLink>
    </Link>
  );
};

interface Section {
  title: string;
  url: string;
}

interface ProfileMenuItem {
  title: string;
  icon: JSX.Element;
  url?: string;
  onClick?: () => void;
}

interface ProfileMenuCategory {
  children: ProfileMenuItem[];
}

interface ProfileMenu {
  title: string;
  children: ProfileMenuCategory[];
}

interface MenuSectionsProps {
  sections: Section[];
  onClick?: () => void;
}

const MenuSections: React.FC<MenuSectionsProps> = ({ sections, onClick }) => {
  const router = useRouter();
  return (
    <>
      {sections.map(({ title, url }, i) => (
        <Link
          key={i}
          href={url}
          passHref legacyBehavior
        >
          <MuiLink
            color="inherit"
            noWrap
            variant="body2"
            onClick={() => onClick && onClick()}
            sx={{
              p: 1,
              flexShrink: 0,
              textDecoration: 'none',
              position: 'relative',
              '&:before': {
                content: '""',
                position: 'absolute',
                width: url === router.pathname ? '100%' : '0%',
                height: '2px',
                bottom: 0,
                left: url === router.pathname ? '0%' : '50%',
                backgroundColor: 'primary.main',
                transition: 'width 0.3s, left 0.3s',
              },
              '&:hover:before': {
                width: '100%',
                left: 0,
              },
            }}
          >
            {title}
          </MuiLink>
        </Link>
      ))}
    </>
  );
};

interface ProfileMenuButtonProps {
  profile?: ProfileMenu | null;
  signInUrl: string;
}

const ProfileMenuButton: React.FC<ProfileMenuButtonProps> = ({ profile, signInUrl }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isProfileOpen = !!anchorEl;
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const router = useRouter();

  return (
    <Grid container justifyContent="flex-end">
      {profile === undefined ? (
        <Skeleton variant="text" width={150} />
      ) : profile === null ? (
        <Link href={signInUrl} passHref legacyBehavior>
          <Button
            variant="outlined"
            size="small"
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >              
            Conexión
          </Button>
        </Link>
      ) : (
        <>
          <Button
            startIcon={<Person />}
            onClick={handleOpen}
          >
            {profile.title}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={isProfileOpen}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {profile.children.map(({ children: categoryChildren }, i) =>
              [
                categoryChildren.map(({ title, icon, url, onClick }, j) => (
                  <OptionalLink key={j} href={url} passHref legacyBehavior>
                    <MenuItem onClick={() => {
                      onClick && onClick();
                      handleClose();
                    }} {...(url ? { component: 'a' } : {})}>
                      <ListItemIcon>
                        {icon}
                      </ListItemIcon>
                      <ListItemText>
                        {title}
                      </ListItemText>
                    </MenuItem>
                  </OptionalLink>
                )),
                i < profile.children.length - 1 && (
                  <Divider />
                )
              ]
            )}
          </Menu>
        </>
      )}
    </Grid>
  );
}

interface HeaderProps {
  logo: React.ReactElement;
  title: string;
  url: string;
  sections: Section[];
  profile?: ProfileMenu | null;
  signInUrl: string;
}

function Header({logo, title, url: titleUrl, sections, profile, signInUrl}: HeaderProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [isMenuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (isDesktop) {
      setMenuOpen(false);
    }
  }, [setMenuOpen, isDesktop]);
  
  const router = useRouter();
  const isHomepage = router.pathname === '/'; // Vérifie si l'utilisateur est sur la page d'accueil

  const toolbarSx = {
    px: '0 !important',
    zIndex: 10,
    mb: 2,
    pd: 2,
    height: isHomepage ? '100vh' : '10vh', // Utilise 15vh si ce n'est pas la page d'accueil
    position: 'relative',
    alignItems: 'flex-start',  // Aligne les éléments en haut verticalement
    flexDirection: { xs: 'column', md: 'row' },
    justifyContent: 'flex-start', // Assure que les éléments sont alignés au début de la barre d'outils
    paddingTop: '20px' // Ajoute un espace en haut
  };

  return (
    <>
      <Toolbar sx={{ ...toolbarSx, display: { xs: 'none', md: 'flex' } }}>
        <MenuTitle logo={logo} title={title} titleUrl={titleUrl} />
        <Box sx={{ flexGrow: 1 }} />
        <Grid container alignItems="center" justifyContent="flex-end" spacing={2}>
          <Grid item>
            <MenuSections sections={sections} />
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <ProfileMenuButton profile={profile} signInUrl={signInUrl} />
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
      <Toolbar sx={{ ...toolbarSx, display: { xs: 'flex', md: 'none' } }}>
        <IconButton onClick={() => setMenuOpen(!isMenuOpen)} sx={{ position: 'absolute', left: 0, top: { xs: 8, sm: 12 } }}><MenuIcon /></IconButton>
        <Box alignItems="center" sx={{ mt: { xs: 1.4, sm: 2 }, mb: -10 }}>
          <MenuTitle logo={logo} title={title} titleUrl={titleUrl} onClick={() => setMenuOpen(false)} />
        </Box>
        <Collapse in={isMenuOpen}>
          <Box sx={{ mt: 7 }} />
          <Stack direction="column" alignItems="center">
            <MenuSections sections={sections} onClick={() => setMenuOpen(false)} />
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <ProfileMenuButton profile={profile} signInUrl={signInUrl} />
            </Box>
            <Box sx={{ height: 8 }} />
          </Stack>
        </Collapse>
      </Toolbar>
    </>
  );
}

interface LinkIcon {
  url: string;
  icon: React.ReactElement;
}

interface FooterProps {
  sections: Section[];
  title: string;
  subtitle: string[];
  links: LinkIcon[];
}

function Footer({ sections, title, subtitle, links }: FooterProps) {
  return (
    <Box component="footer" sx={{ bgcolor: 'grey.200', py: 6, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item container xs={12} md={6} sx={{ textAlign: 'center' }}>
            {sections.map(({ title, url }, i) => (
              <Grid key={i} item xs={12}>
                <Link href={url} passHref legacyBehavior>
                  <MuiLink
                    color="inherit"
                    noWrap
                  >
                    {title}
                  </MuiLink>
                </Link>
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
            <strong>{title}</strong>
            <br /><br />
            {subtitle.map((sub, i) => (
              <Fragment key={i}>
                {sub}
                {i < subtitle.length - 1 && (
                  <br />
                )}
              </Fragment>
            ))}
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
              {links.map(({ url, icon }, i) => (
                <MuiLink key={i} href={url} target="_blank" rel="noopener noreferrer">
                  {icon}
                </MuiLink>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

interface FrontsiteContainerLayoutProps {
  logo: React.ReactElement;
  title: string;
  url: string;
  sections: Section[];
  profile?: ProfileMenu | null;
  signInUrl: string;
  footerSections: Section[];
  footerSubtitle: string[];
  footerLinks: LinkIcon[];
  children: React.ReactNode;
}

export const FrontsiteContainerLayout: React.FC<FrontsiteContainerLayoutProps> = ({
  logo,
  title,
  url,
  sections,
  profile,
  signInUrl,
  footerSections,
  footerSubtitle,
  footerLinks,
  children
}) => {
  const router = useRouter();
  const isHomepage = router.pathname === '/'; // Vérifie si l'utilisateur est sur la page d'accueil

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        ...(isHomepage && { // Applique ces styles seulement sur la page d'accueil
          minHeight: '100vh', 
          backgroundImage: `url("/images/bg1.jpg")`, 
          backgroundRepeat: 'no-repeat', 
          backgroundSize: 'contain', // Conserve les proportions et ajuste la taille pour être contenu dans le box
          backgroundPosition: 'top center', // Positionne l'image au centre
          width: '100%',
          height: 'auto',
        }),
      }}
    >    <CssBaseline />
      <Container maxWidth="lg">
        <Header logo={logo} title={title} url={url} sections={sections} profile={profile} signInUrl={signInUrl} />
        <Box component="main" sx={{ mb: 2 }}>
          {children}
        </Box>
      </Container>
      <Footer sections={footerSections} title={title} subtitle={footerSubtitle} links={footerLinks} />
    </Box>
  );
};
