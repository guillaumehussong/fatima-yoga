import { FrontsiteContent } from '../components/layout/public/FrontsiteContent';
import Link from 'next/link';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  Link as MuiLink, Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { FrontsiteCourseGrid } from '../components/grid/grids/FrontsiteCourseGrid';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { CalendarLinkButton } from '../components/CalendarLinkButton';
import { Session } from 'next-auth';
import { PickersDay, StaticDatePicker } from '@mui/x-date-pickers';
import { PickersDayProps } from '@mui/x-date-pickers/PickersDay/PickersDay';
import { trpc } from '../common/trpc';
import { isSameDay } from 'date-fns';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { useSnackbar } from 'notistack';
import { Save } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchemaBase } from '../common/schemas/user';
import { FrontsiteCouponGrid } from '../components/grid/grids/FrontsiteCouponGrid';
import { FrontsiteMembershipGrid } from '../components/grid/grids/FrontsiteMembershipGrid';

interface CalendarWidgetProps {
  userId: number;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ userId }) => {
  const { data, isLoading } = trpc.self.findAllRegisteredCourses.useQuery({ userId, future: null, userCanceled: false });
  const renderDay = (pickersDayProps: PickersDayProps<Date>): React.ReactElement => {
    const { day } = pickersDayProps;
    const isSelected = data && data.some(({ course: { dateStart } }: any) => isSameDay(new Date(dateStart), day));
    const isDisabled = !isSameDay(day, new Date()) && day.getTime() < new Date().getTime();
    return (
      <PickersDay
        key={day.toString()}
        {...pickersDayProps}
        selected={isSelected}
        disabled={isDisabled}
        sx={{ bgcolor: isSelected && isDisabled ? '#9ec3e9 !important' : undefined }}
      />
    );
  };
  const [minDate, maxDate] = useMemo(() => {
    if (data && data.length > 0) {
      const times = data.map(({ course: { dateStart } }: any) => new Date(dateStart).getTime());
      return [new Date(Math.min(...times)), new Date(Math.max(...times))];
    } else {
      return [undefined, undefined];
    }
  }, [data]);
  return (
    <Grid container justifyContent="center" sx={{ mt: 2, mb: 3 }}>
      <Grid item>
        <Card variant="outlined">
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            views={['day']}
            value={null}
            readOnly
            loading={isLoading}
            onChange={() => {}}
            minDate={minDate}
            maxDate={maxDate}
            slots={{
              //textfield: TextField,
              day: renderDay,
            }}
            showDaysOutsideCurrentMonth
          />
        </Card>
      </Grid>
    </Grid>
  )
};

interface UserDataFormProps {
  userId: number;
}

const UserDataForm: React.FC<UserDataFormProps> = ({ userId }) => {
  const trpcClient = trpc.useContext();
  const { data: initialData } = trpc.self.profile.useQuery({ userId });
  const { enqueueSnackbar } = useSnackbar();
  const reloadSession = () => {
    const event = new Event('visibilitychange');
    document.dispatchEvent(event);
  };
  const { mutate, isLoading: isUpdateLoading } = trpc.self.updateProfile.useMutation({
    onSuccess: async () => {
      await Promise.all((
        [trpcClient.self.managedUsers, trpcClient.self.profile]
      ).map(procedure => procedure.invalidate()));
      reloadSession();
      enqueueSnackbar('Tus datos han sido actualizados', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Ocurrió un error al actualizar tus datos', { variant: 'error' });
    },
  });

  const sizeInput = { xs: 12, md: 4, lg: 5 };
  const sizeButton = { xs: 12, md: 4, lg: 2 };
  return initialData ? (
    <FormContainer
      defaultValues={initialData}
      onSuccess={({ name, email }) => mutate({ id: userId, name: name ?? '', email: email ?? null })}
      resolver={zodResolver(userSchemaBase)}
    >
      <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
        <Grid item {...sizeInput}>
          <TextFieldElement name="name" label="Nombre completo" fullWidth disabled={isUpdateLoading} />
        </Grid>
        <Grid item {...sizeInput}>
          <TextFieldElement name="email" label="Dirección de correo electrónico" fullWidth disabled={isUpdateLoading} />
        </Grid>
        <Grid item {...sizeButton} alignItems="stretch">
          <Button type="submit" variant="outlined" startIcon={<Save />} fullWidth disabled={isUpdateLoading} sx={{ height: '100%' }}>
            Guardar
          </Button>
        </Grid>
      </Grid>
    </FormContainer>
  ) : (
    <Box textAlign="center" sx={{ my: 3 }}>
      <CircularProgress />
    </Box>
  );
};

interface UserTabPanelProps {
  userId: number;
  publicAccessToken: string;
}

const UserTabPanelContent: React.FC<UserTabPanelProps> = ({ userId, publicAccessToken }) => {

  return (
    <>
      <Typography variant="h5" component="div" sx={{ my: 2 }}>
        Sesiones
      </Typography>
      <Typography paragraph>
        Las sesiones futuras para las que estás inscrito(a).
        También encontrarás el historial de tus inscripciones y participaciones.
      </Typography>
      <Stack direction="column" spacing={2}>
        <FrontsiteCourseGrid userId={userId} future={true} userCanceled={false} />
        <FrontsiteCourseGrid userId={userId} future={false} userCanceled={false} collapsible collapsedSummary="Sesiones pasadas" />
        <FrontsiteCourseGrid userId={userId} future={null} userCanceled={true} collapsible collapsedSummary="Sesiones canceladas" />
      </Stack>
      <Typography variant="h5" component="div" sx={{ my: 2 }}>
        Tarjetas
      </Typography>
      <Typography paragraph>
        Si has comprado tarjetas de sesiones, su saldo se mostrará a continuación.
      </Typography>
      <FrontsiteCouponGrid userId={userId} />
      <Typography variant="h5" component="div" sx={{ my: 2 }}>
        Membresías
      </Typography>
      <Typography paragraph>
        Tus membresías a la asociación Fátima Domíguez Yoga como miembro están listadas a continuación.
      </Typography>
      <FrontsiteMembershipGrid userId={userId} />
      <Typography variant="h5" component="div" sx={{ my: 2 }}>
        Datos personales
      </Typography>
      Tu dirección de correo electrónico nos permite informarte en caso de cancelación de una sesión.
      <UserDataForm userId={userId} />
      Tus datos personales se tratan conforme a nuestra <Link href="/confidentialite" passHref legacyBehavior><MuiLink>política de privacidad</MuiLink></Link>,
      en particular, estos solo se utilizan con el fin de garantizar la inscripción y organización de las sesiones de Yoga.
      <Typography variant="h5" component="div" sx={{ my: 2 }}>
        Calendario personal
      </Typography>
      Encontrarás en este calendario todas tus sesiones pasadas y futuras.
      <CalendarWidget userId={userId} />
      <CalendarLinkButton publicAccessToken={publicAccessToken} />
    </>
  );
};

interface MesInscripcionesContentProps {
  session: Session;
}

const MesInscripcionesContent: React.FC<MesInscripcionesContentProps> = ({ session }) => {
  const [tab, setTab] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => setTab(newValue);

  const { data, isLoading } = trpc.self.managedUsers.useQuery();
  const managedUsersIncludingSelf = useMemo(() =>
    data ? [
      { id: session.userId, name: `${session.displayName ?? session.displayEmail} (tú)`, publicAccessToken: session.publicAccessToken },
      ...data.managedUsers,
    ] : undefined,
    [data, session]
  );

  return (
    <FrontsiteContent title="Mis inscripciones">
      Esta página muestra todas tus inscripciones a las sesiones de Yoga (así como las de tus familiares si es el caso).
      <br />
      Estas inscripciones se realizan a través de <Link href="/inscripcion" passHref legacyBehavior><MuiLink>este formulario</MuiLink></Link>.
      {data && data.managedByUser && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Tu cuenta está actualmente vinculada a la de <strong>{data.managedByUser.name}</strong>, lo que le permite gestionar tus inscripciones en tu lugar.
        </Alert>
      )}
      <Box>
        {data && managedUsersIncludingSelf ? (
          <>
            {managedUsersIncludingSelf.length !== 1 && (
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
                <Tabs value={tab} onChange={handleTabChange}>
                  {managedUsersIncludingSelf.map(user => (
                    <Tab key={user.id} label={user.name} />
                  ))}
                </Tabs>
              </Box>
            )}
            {managedUsersIncludingSelf.filter((_, i) => i === tab).map(user => (
              <UserTabPanelContent key={user.id} userId={user.id} publicAccessToken={user.publicAccessToken} />
            ))}
          </>
        ) : isLoading ? (
          <Box textAlign="center" sx={{ my: 4 }}>
            <CircularProgress />
          </Box>
        ) : null}
      </Box>
    </FrontsiteContent>
  )
};

const MesInscripcionesPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/connexion');
    }
  });

  if (status === 'loading') {
    return ( // TODO skeleton
      <Box display="flex" alignItems="center" justifyContent="center">
        <CircularProgress sx={{ mt: 10 }} />
      </Box>
    )
  } else if (session === null) {
    return null;
  } else {
    return (
      <MesInscripcionesContent session={session} />
    );
  }
};

export default MesInscripcionesPage;
