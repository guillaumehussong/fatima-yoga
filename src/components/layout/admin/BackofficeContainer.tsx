import React from 'react';
import {
  AdminPanelSettings,
  Assignment, CardGiftcard,
  Dashboard,
  DateRange,
  Email,
  Euro, Groups,
  Home,
  Logout, Payments,
  People, Settings, SwapHoriz, Timeline,
} from '@mui/icons-material';
import { signOut, useSession } from 'next-auth/react';
import { Typography } from '@mui/material';
import { useRouter } from 'next/router';
import pkg from '../../../../package.json';
import { BackofficeContainerLayout } from './BackofficeContainerLayout';
import { displayUserName } from '../../../common/display';
// eslint-disable-next-line import/extensions
import { RoleNames } from '../../../common/role';

interface BackofficeContainerProps {
  children: React.ReactNode;
}

export const BackofficeContainer: React.FC<BackofficeContainerProps> = ({ children }) => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <BackofficeContainerLayout
      title="Fátima Domíguez Yoga"
      url="/administration"
      menu={[
        {
          children: [
            { title: 'Vista Previa', icon: <Dashboard />, url: '/administration' },
          ],
        },
        {
          title: 'Organización',
          children: [
            { title: 'Sesiones', icon: <DateRange />, url: '/administration/seances' },
            { title: 'Inscripciones', icon: <Assignment />, url: '/administration/inscripciones' },
            { title: 'Usuarios', icon: <People />, url: '/administration/utilisateurs' },
          ],
        },
        {
          title: 'Contabilidad',
          children: [
            { title: 'Pagos', icon: <Payments />, url: '/administration/paiements' },
            { title: 'Membresías', icon: <Groups />, url: '/administration/adhesions' },
            { title: 'Tarjetas', icon: <CardGiftcard />, url: '/administration/cartes' },
            { title: 'Transacciones', icon: <SwapHoriz />, url: '/administration/transactions' },
            { title: 'Estadísticas', icon: <Timeline />, url: '/administration/statistiques' },
          ],
        },
        {
          title: 'Administración',
          children: [
            { title: 'Roles', icon: <AdminPanelSettings />, url: '/administration/roles' },
            { title: 'Emails', icon: <Email />, url: '/administration/emails' },
            { title: 'Configuración', icon: <Settings />, url: '/administration/parametres' },
          ],
        },
        {
          children: [
            { title: 'Ver el sitio', icon: <Home />, url: '/' },
          ],
        },
      ]}
      profileMenu={{
        children: [
          { title: `${session!.displayName ?? session!.displayEmail ?? ''} (${RoleNames[session!.role]})`, icon: <People />, url: { pathname: '/administration/utilisateurs/[id]', query: { id: session?.userId } } },
          { title: 'Se déconnecter', icon: <Logout />, onClick: () => signOut({ redirect: true, callbackUrl: '/' }) },
        ],
      }}
      footer={(
        <Typography align="center">
          Version {pkg.version}
        </Typography>
      )}
    >
      {children}
    </BackofficeContainerLayout>
  );
};
