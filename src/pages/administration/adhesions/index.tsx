import { BackofficeContent } from '../../../components/layout/admin/BackofficeContent';
import { Groups, PersonAdd } from '@mui/icons-material';
import { Typography } from '@mui/material';
import React from 'react';
import { CouponGrid } from '../../../components/grid/grids/CouponGrid';
import { MembershipModelCards } from '../../../components/MembershipModelCards';
import { MembershipGrid } from '../../../components/grid/grids/MembershipGrid';

export default function AdminMemberships() {

  return (
    <BackofficeContent
      title="Membresías"
      icon={<Groups />}
      quickActions={[
        { icon: <PersonAdd />, name: 'Crear una o varias membresías', url: '/administration/adhesions/membres/creation' },
        { icon: <Groups />, name: 'Nuevo tipo de membresía', url: '/administration/adhesions/types/creation' },
      ]}
    >
      <Typography variant="h6" component="div" sx={{ mt: 2, mb: 1 }}>
        Tipos de membresías
      </Typography>
      <Typography paragraph>
        Las membresías se presentan ya sea en forma de contribuciones individuales o contribuciones familiares.
      </Typography>
      <MembershipModelCards />
  
      <Typography variant="h6" component="div" sx={{ mt: 2, mb: 1 }}>
        Membresías
      </Typography>
      <Typography paragraph>
        Las membresías son válidas por un año a partir del 1 de septiembre. A continuación, todas las membresías de la asociación.
      </Typography>
      <MembershipGrid />
    </BackofficeContent>
  );
}
