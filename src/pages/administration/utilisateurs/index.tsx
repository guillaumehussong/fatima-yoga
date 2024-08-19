import React from 'react';
import { BackofficeContent } from '../../../components/layout/admin/BackofficeContent';
import { Merge, Notes, People, Person } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { UserGrid } from '../../../components/grid/grids/UserGrid';
import { useBackofficeWritePermission } from '../../../components/hooks/usePermission';

export default function AdminAdmins() {
  const hasWritePermission = useBackofficeWritePermission();
  return (
    <BackofficeContent
      title="Usuarios"
      icon={<People />}
      actions={hasWritePermission ? [
        { name: 'Fusionar usuarios', icon: <Merge/>, url: '/administration/utilisateurs/fusion' },
      ] : []}
      quickActions={hasWritePermission ? [
        { icon: <Person />, name: 'Nuevo usuario', url: '/administration/utilisateurs/creation' }
      ] : []}
    >
      <Typography paragraph>
        Lista de cuentas de usuario. Cada vez que un usuario inicia sesión con un nuevo servicio, se crea automáticamente una nueva cuenta. Además, tienes la posibilidad de crear cuentas de usuario manualmente.
        Ten en cuenta que para las cuentas que creas tú mismo, no se asocia ningún servicio, por lo que nadie podrá iniciar sesión en ellas.
      </Typography>
      <UserGrid disabledUsers={false} />
    </BackofficeContent>
  );
}