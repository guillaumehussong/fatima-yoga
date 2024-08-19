import React, { useState } from 'react';
import { BackofficeContent } from '../../../../components/layout/admin/BackofficeContent';
import {
  Assignment,
  Block,
  Edit,
  Person,
  Delete,
  ShoppingCart
} from '@mui/icons-material';
import { Prisma } from '@prisma/client';
import { displayUserName } from '../../../../common/display';
import { userFindTransformSchema } from '../../../../common/schemas/user';
import { useSchemaQuery } from '../../../../components/hooks/useSchemaQuery';
import { useRouter } from 'next/router';
import { CourseRegistrationEventGrid } from '../../../../components/grid/grids/CourseRegistrationEventGrid';
import { CourseRegistrationGrid } from '../../../../components/grid/grids/CourseRegistrationGrid';
import { Box, Card, CardContent, Chip, Grid, Stack, Tooltip, Typography } from '@mui/material';
import { getUserStatistics } from '../../../../common/user';
import { trpc } from '../../../../common/trpc';
import { useSnackbar } from 'notistack';
import { DisableUserDialog } from '../../../../components/dialogs/DisableUserDialog';
import { RenableUserDialog } from '../../../../components/dialogs/RenableUserDialog';
import { BackofficeContentLoading } from '../../../../components/layout/admin/BackofficeContentLoading';
import { DeleteUserDialog } from '../../../../components/dialogs/DeleteUserDialog';
import { BackofficeContentError } from '../../../../components/layout/admin/BackofficeContentError';
import { CouponGrid } from '../../../../components/grid/grids/CouponGrid';
import { MembershipGrid } from '../../../../components/grid/grids/MembershipGrid';
import { OrderGrid } from '../../../../components/grid/grids/OrderGrid';
import { UserInformationTableCard } from '../../../../components/UserInformationTableCard';
import { UnpaidItemsGrid } from '../../../../components/grid/grids/UnpaidItemsGrid';
import { useBackofficeWritePermission } from '../../../../components/hooks/usePermission';

interface GridItemStatisticProps {
  value: number;
  valueFormatter?: (value: number) => string;
  title: string;
  label: React.ReactNode;
  good?: boolean;
}

const GridItemStatistic: React.FC<GridItemStatisticProps> = ({ value, valueFormatter, title, label, good }) => (
  <Grid item xs={6} sm={3} textAlign="center">
    <Tooltip title={<Box textAlign="center">{label}</Box>}>
      <Box sx={{ cursor: 'help' }}>
        <Typography variant="h4" component="div" sx={{ mt: 1, mb: 1 }} color={value > 0 ? (good === undefined ? 'black' : good ? 'green' : 'red') : 'text.secondary'}>
          {valueFormatter ? valueFormatter(value) : value}
        </Typography>
        <Typography color="text.secondary">
          {title}
        </Typography>
      </Box>
    </Tooltip>
  </Grid>
);

interface AdminUserContentProps {
  user: Prisma.UserGetPayload<{ include: { courseRegistrations: { include: { course: true } }, accounts: true, managedByUser: true, managedUsers: true, transactions: true, memberships: true, orders: { select: { trialCourseRegistrations: { select: { courseRegistration: { select: { courseId: true } } } } } } } }>;
}

const AdminUserContent: React.FunctionComponent<AdminUserContentProps> = ({ user }: AdminUserContentProps) => {
  const hasWritePermission = useBackofficeWritePermission();
  const title = `Usuario ${displayUserName(user)}`;
  const statistics = getUserStatistics(user);
  const trpcClient = trpc.useContext();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: mutateDisable, isLoading: isDisablingLoading } = trpc.user.disabled.useMutation({
    onSuccess: async (_, { disabled }) => {
      await Promise.all((
        [trpcClient.user.find, trpcClient.user.findAll]
      ).map(procedure => procedure.invalidate()));
      enqueueSnackbar(disabled ? `El usuario ha sido desactivado` : `El usuario ha sido reactivado`, { variant: 'success' });
    },
    onError: (_, { disabled }) => {
      enqueueSnackbar(`Ocurrió un error durante la ${disabled ? 'desactivación' : 'reactivación'} del usuario`, { variant: 'error' });
    },
  });
  const [isDisableDialogOpen, setDisableDialogOpen] = useState(false);
  const { mutate: mutateDelete, isLoading: isDeleteLoading } = trpc.user.delete.useMutation({
    onSuccess: async () => {
      await Promise.all((
        [trpcClient.user.find, trpcClient.user.findAll]
      ).map(procedure => procedure.invalidate()));
      enqueueSnackbar(`El usuario ha sido eliminado`, { variant: 'success' });
      return router.push('/administration/utilisateurs');
    },
    onError: () => {
      enqueueSnackbar(`Ocurrió un error durante la eliminación del usuario; es posible que el usuario no se pueda eliminar`, { variant: 'error' });
    },
  });
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  return (
    <BackofficeContent
      titleRaw={title}
      title={
        <Stack direction="row" gap={2}>
          <span>
            {title}
          </span>
          {user.disabled && (
            <Chip label="Desactivado" color="error" variant="outlined" />
          )}
        </Stack>
      }
      icon={<Person />}
      actions={hasWritePermission ? [
        { name: 'Modificar', icon: <Edit />, url: { pathname: '/administration/utilisateurs/[id]/edition', query: { id: user.id, redirect: router.asPath } } },
        { name: user.disabled ? 'Reactivar la cuenta' : 'Desactivar la cuenta', icon: <Block />, onClick: () => setDisableDialogOpen(true), disabled: isDisablingLoading },
        { name: 'Eliminar', icon: <Delete />, onClick: () => setDeleteDialogOpen(true), disabled: isDeleteLoading },
      ] : []}
      quickActions={hasWritePermission ? [
        { name: 'Inscribir a sesiones', icon: <Assignment />, url: { pathname: `/administration/inscripciones/creation`, query: { userId: user.id, redirect: router.asPath } } },
        { name: 'Crear un pago', icon: <ShoppingCart />, url: { pathname: `/administration/paiements/creation`, query: { userId: user.id, redirect: router.asPath } } },
      ] : []}
    >
      <DisableUserDialog user={user} open={isDisableDialogOpen && !user.disabled} setOpen={setDisableDialogOpen} onConfirm={() => mutateDisable({ id: user.id, disabled: true })} />
      <RenableUserDialog user={user} open={isDisableDialogOpen && user.disabled} setOpen={setDisableDialogOpen} onConfirm={() => mutateDisable({ id: user.id, disabled: false })} />
      <DeleteUserDialog user={user} open={isDeleteDialogOpen} setOpen={setDeleteDialogOpen} onConfirm={() => mutateDelete({ id: user.id })} />
      <Typography variant="h6" component="div" sx={{ mt: 2, mb: 1 }}>
        Información del usuario
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <UserInformationTableCard user={user} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card variant="outlined">
            <CardContent sx={{ pb: 0 }}>
              <Typography variant="h6" component="div">
                Estadísticas
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                <GridItemStatistic
                  value={statistics.coursesPast}
                  title="Sesiones pasadas"
                  label="Número total de sesiones no canceladas pasadas para las que el usuario estaba inscrito. Las ausencias se contabilizan. Una sesión se considera pasada una vez que se alcanza la fecha de finalización."
                />
                <GridItemStatistic
                  value={statistics.coursesFuture}
                  title="Sesiones futuras"
                  label="Número total de sesiones no canceladas futuras para las que el usuario está inscrito. Una sesión se considera futura siempre que no se haya alcanzado la fecha de finalización."
                  good
                />
                <GridItemStatistic
                  value={statistics.courseUnregistrations}
                  title="Sesiones canceladas"
                  label="Número total de sesiones en las que el usuario se había inscrito al menos una vez, pero finalmente se dio de baja. Las sesiones canceladas están excluidas."
                  good={false}
                />
                <GridItemStatistic
                  value={statistics.courseAbsences}
                  title="Ausencias"
                  label="Número total de ausencias. Una cancelación de inscripción no se contabiliza como una ausencia. Las sesiones canceladas también están excluidas."
                  good={false}
                />
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Typography variant="h6" component="div" sx={{ mt: 2, mb: 1 }}>
        Participaciones
      </Typography>
      <CourseRegistrationGrid userId={user.id} />
      <Typography variant="h6" component="div" sx={{ mt: 2, mb: 1 }}>
        Historial de inscripciones
      </Typography>
      <CourseRegistrationEventGrid userId={user.id} />
      <Typography variant="h6" component="div" sx={{ mt: 2, mb: 1 }}>
        Ausencias
      </Typography>
      <CourseRegistrationGrid userId={user.id} attended={false} />
      <Typography variant="h6" component="div" sx={{ mt: 2, mb: 1 }}>
        Contabilidad
      </Typography>
      <Stack direction="column" gap={2}>
        <OrderGrid userId={user.id} />
        <MembershipGrid collapsible collapsedSummary="Membresías del usuario" userId={user.id} />
        <CouponGrid collapsible collapsedSummary="Tarjetas poseídas por este usuario" userId={user.id} />
        <UnpaidItemsGrid collapsible collapsedSummary="Artículos impagos" userId={user.id} />
      </Stack>
    </BackofficeContent>
  );
};

export default function AdminUser() {
  const router = useRouter();
  const { id } = router.query;
  const result = useSchemaQuery(trpc.user.find, { id }, userFindTransformSchema);

  return result && result.data ? (
    <AdminUserContent user={result.data as any} />
  ) : result?.isLoading ? <BackofficeContentLoading /> : <BackofficeContentError error={result?.error} />;
}
