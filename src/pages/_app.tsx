import '@fontsource/nunito/300.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/500.css';
import '@fontsource/nunito/700.css';
import '../components/style/index.css';
import { createTheme, ThemeProvider, Typography } from '@mui/material';
import { SessionProvider } from 'next-auth/react';
import { MDXProvider } from '@mdx-js/react';
import { grey } from '@mui/material/colors';
import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AppProps } from 'next/app';
import { Router } from 'next/router';
import { GuardedBackofficeContainer } from '../components/layout/admin/GuardedBackofficeContainer';
import { frFR } from '@mui/x-data-grid';
import { frFR as pickersfrFR } from '@mui/x-date-pickers';
import { frFR as corefrFR } from '@mui/material/locale';
import { esES } from '@mui/x-data-grid';
import { esES as pickersesES } from '@mui/x-date-pickers';
import { esES as coreesES } from '@mui/material/locale';
import { FrontsiteContainer } from '../components/layout/public/FrontsiteContainer';
import { SnackbarProvider } from 'notistack';
import { InternalLink } from '../components/contents/common/InternalLink';
import { zodFrenchErrorMap } from '../common/zodFrenchErrorMap';
import { z } from 'zod';
import { fr } from 'date-fns/locale';
import { trpc } from '../common/trpc';
import { MDXComponents } from 'mdx/types';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AuthGuard } from '../components/AuthGuard';
import { Permissions } from '../common/role';

function Paragraph({ children }: JSX.IntrinsicElements['p']) {
  return (
    <Typography paragraph align="justify">{children}</Typography>
  );
}

const components: MDXComponents = {
  p: Paragraph,
  a: ({ children, href }) => <InternalLink children={children} href={href ?? '#'} />,
};

const theme = createTheme({
    typography: {
      fontFamily: 'Nunito',
    },
    palette: {
      primary: {
        main: '#5F6F52',
      },
      secondary: {
        main: '#374921',
      },
      info: {
        main: '#BAC0A5',
      },
      background: {
        default: "#fcfcfc",
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: grey[800],
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            border: '1px solid #e0e0e0'
          },
        },
      },
    },
  },
  esES,
  pickersesES,
  coreesES);

z.setErrorMap(zodFrenchErrorMap);

interface LayoutProviderProps {
  router: Router;
  children: React.ReactNode;
}

const LayoutProvider = ({ router, children }: LayoutProviderProps): JSX.Element => {
  if (router.pathname === '/connexion' || router.pathname === '/redirection' || router.pathname === '/verificacion') {
    return (
      <>
        {children}
      </>
    );
  } else if (router.pathname.startsWith('/administration')) {
    if (router.pathname.startsWith('/administration/pdf/')) {
      return (
        <AuthGuard allowedRoles={Permissions.ReadBackoffice}>
          {children}
        </AuthGuard>
      );
    } else {
      return (
        <GuardedBackofficeContainer>
          {children}
        </GuardedBackofficeContainer>
      );
    }
  } else {
    return (
      <FrontsiteContainer>
        {children}
      </FrontsiteContainer>
    );
  }
};

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <ThemeProvider theme={theme}>
        <MDXProvider components={components}>
          <SessionProvider>
            <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
              <LayoutProvider router={router}>
                <Component {...pageProps} />
              </LayoutProvider>
            </SnackbarProvider>
          </SessionProvider>
        </MDXProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default trpc.withTRPC(MyApp);
