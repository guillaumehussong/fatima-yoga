import React, { useMemo } from 'react';
import { FrontsiteContainerLayout } from './FrontsiteContainerLayout';
import { signOut, useSession } from 'next-auth/react';
import {
  AdminPanelSettings,
  Assignment,
  DateRange,
  EmailTwoTone,
  FacebookTwoTone, FlareTwoTone,
  Instagram, LinkedIn,
  Logout
} from '@mui/icons-material';
import { IconYoga } from '../../icons';
import { COMETE_URL, EMAIL_CONTACT, FACEBOOK_PAGE_URL, INSTAGRAM_URL, LINKEDIN_URL } from '../../../common/config';
import { useRouter } from 'next/router';
import { Permissions } from '../../../common/role';

interface FrontsiteContainerProps {
  children: React.ReactNode;
}

const commonSections = [
  { title: 'Inicio', url: '/' },
  { title: 'El Yoga', url: '/yoga' },
  //{ title: 'Las sesiones', url: '/sesiones' },
  { title: 'Inscripción', url: '/inscripcion' },
  { title: 'Acerca de', url: '/acerca-de' },
];

export const FrontsiteContainer: React.FC<FrontsiteContainerProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const profile = useMemo(() => {
    if (status === 'loading') {
      return undefined;
    } else if (session === null) {
      return null;
    } else {
      return {
        title: session.displayName ?? session.displayEmail ?? '?',
        children: [
          ...(Permissions.ReadBackoffice.includes(session.role) ? [{
            children: [
              { title: 'Administración', icon: <AdminPanelSettings />, url: '/administration' },
            ]
          }] : []),
          {
            children: [
              { title: 'Inscripción a sesiones', icon: <Assignment />, url: '/inscripcion' },
              { title: 'Consultar mis inscripciones', icon: <DateRange />, url: '/mis-inscripciones' },
            ]
          },
          {
            children: [
              { title: 'Cerrar sesión', icon: <Logout />, onClick: () => signOut({ redirect: true, callbackUrl: '/' }) },
            ],
          },
        ],
      };
    }
  }, [session, status]);

  return (
    <FrontsiteContainerLayout
      logo={<IconYoga />}
      title="Fátima Domínguez Yoga"
      url="/"
      sections={commonSections}
      profile={profile}
      signInUrl={`/connexion?r=${encodeURIComponent(router.asPath)}`}
      footerSections={[
        ...commonSections,
        { title: 'Reglamento interno', url: '/reglamento-interno' },
        { title: 'Política de privacidad', url: '/privacidad' },
      ]}
      footerSubtitle={['Fátima Mariá Domínguez', 'Profesora de Yoga en El Salvador']}
      footerLinks={[
        {
          url: FACEBOOK_PAGE_URL,
          icon: <FacebookTwoTone fontSize="large" />,
        },
        {
          url: INSTAGRAM_URL,
          icon: <Instagram fontSize="large" />,
        },
        {
          url: LINKEDIN_URL,
          icon: <LinkedIn fontSize="large" />,
        },
        {
          url: COMETE_URL,
          icon: <FlareTwoTone fontSize="large" />,
        },
        {
          url: `mailto:${EMAIL_CONTACT}`,
          icon: <EmailTwoTone fontSize="large" />,
        },
      ]}
    >
      {children}
    </FrontsiteContainerLayout>
  );
};
