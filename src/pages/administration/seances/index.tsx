import React, { useCallback } from 'react';
import { GuardedBackofficeContainer } from '../../../components/layout/admin/GuardedBackofficeContainer';
import { BackofficeContent } from '../../../components/layout/admin/BackofficeContent';
import { DateRange, Event } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import { CourseModelCards } from '../../../components/CourseModelCards';
import { BasicSpeedDial } from '../../../components/BasicSpeedDial';
import { AsyncGrid } from '../../../components/grid';
import { trpc } from '../../../common/trpc';
import { GridColDef } from '@mui/x-data-grid';
import { CourseGrid } from '../../../components/grid/grids/CourseGrid';
import { useBackofficeWritePermission } from '../../../components/hooks/usePermission';

/*function AdminHomeLayout() {
  const { data: session } = useSession();

  return (
    <ContentLayout title="Fátima Domíguez Yoga" icon={BsKanban} breadcrumb={BREADCRUMB_OVERVIEW}>
      <h2 className="h5">Planning</h2>

      <CourseCards readonly />

      <h2 className="h5">Prochaines séances</h2>

      <DynamicPaginatedTable
        url="/api/courses"
        params={(page, limit, { sort }) => ({
          page,
          limit,
          include: ['registrations'],
          where: JSON.stringify({
            isCanceled: false,
            dateEnd: { $gt: new Date().toISOString() },
          }),
          orderBy: sort ? { [sort.column]: sort.order ? '$asc' : '$desc' } : undefined,
        })}
        columns={[
          detailsColumnFor(id => `/administration/seances/planning/${id}`),
          {
            title: 'Date',
            name: 'dateStart',
            sortable: true,
            initialSortValue: true,
            render: ({ dateStart: date }) => formatDateLiteral(date),
          },
          {
            title: 'Horaire',
            render: ({ dateStart, dateEnd }) => displayTimePeriod(dateStart, dateEnd),
          },
          {
            title: 'Tipo de sesión',
            name: 'type',
            sortable: true,
            render: ({ type }) => displayCourseType(type),
          },
          {
            title: 'Inscripciones / Places disponibles',
            name: 'registrations._count',
            sortable: true,
            render: ({ slots, registrations }) => {
              const registered = registrations.filter(({ isUserCanceled }) => !isUserCanceled).length;
              return (
                <>
                  <span className={registered > 0 ? 'text-success' : ''}>{registered}</span>
                  {' '}
                  /
                  {' '}
                  {slots}
                </>
              );
            },
            props: { className: 'text-center' },
          },
          {
            title: 'Notes',
            render: ({ notes }) => notes,
            props: { style: { whiteSpace: 'pre-wrap' } },
          },
        ]}
        renderEmpty={() => 'Aucune séance planifiée à venir.'}
      />

      <div className="text-end">
        <ButtonICSLink session={session} coach />
      </div>
    </ContentLayout>
  );
}*/

const AdminHomeContent: React.FC = () => {
  const hasWritePermission = useBackofficeWritePermission();

  return (
    <BackofficeContent
      title="Sesiones"
      icon={<DateRange />}
      quickActions={hasWritePermission ? [
        { icon: <DateRange />, name: 'Planificación de sesiones', url: '/administration/seances/planning/creation' },
        { icon: <Event />, name: 'Nuevo modelo de sesión', url: '/administration/seances/modeles/creation' },
      ] : []}
    >
      <Typography variant="h6" component="div">
        Modelos de sesiones
      </Typography>
      <Typography paragraph>
        Estos son los horarios semanales para la realización de las sesiones. Estos modelos se utilizan para planificar eficientemente un lote de sesiones (a continuación). 
        Es posible planificar sesiones en otras fechas y horarios distintos a los indicados por los modelos.
      </Typography>
      <CourseModelCards />

      <Typography variant="h6" component="div" sx={{ mt: 2 }}>
        Próximas sesiones
      </Typography>
      <Typography paragraph>
        Los usuarios solo pueden inscribirse en sesiones que han sido planificadas.
        Esta tabla contiene la lista de sesiones pasadas, presentes y futuras. El botón permite planificar
        nuevas sesiones. No es posible eliminar sesiones, sin embargo, es posible cancelarlas.
      </Typography>
      <CourseGrid future canceled={false} />

      <Typography variant="h6" component="div" sx={{ mt: 2 }}>
        Sesiones pasadas
      </Typography>
      <Typography paragraph>
        Las sesiones pasadas.
      </Typography>
      <CourseGrid future={false} canceled={false} />

      <Typography variant="h6" component="div" sx={{ mt: 2 }}>
        Sesiones canceladas
      </Typography>
      <Typography paragraph>
        Las sesiones que han sido canceladas.
      </Typography>
      <CourseGrid future={null} canceled />
    </BackofficeContent>
  );
};

export default function AdminHome() {
  return (
    <AdminHomeContent />
  );
}
