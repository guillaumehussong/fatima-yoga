import React from 'react';
import { BackofficeContent } from '../../../components/layout/admin/BackofficeContent';
import { Payments, PictureAsPdf, ShoppingCart } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { OrderGrid } from '../../../components/grid/grids/OrderGrid';
import { UnpaidItemsGrid } from '../../../components/grid/grids/UnpaidItemsGrid';
import {
  CourseRegistrationForReplacementGrid
} from '../../../components/grid/grids/CourseRegistrationForReplacementGrid';
import { useBackofficeWritePermission } from '../../../components/hooks/usePermission';

export default function AdminPayments() {
  const hasWritePermission = useBackofficeWritePermission();
  return (
    <BackofficeContent
      title="Pagos"
      icon={<Payments />}
      quickActions={hasWritePermission ? [
        { icon: <ShoppingCart />, name: 'Registrar un pago', url: '/administration/paiements/creation' },
        { icon: <PictureAsPdf />, name: 'Generar una factura libre', url: '/administration/paiements/facture' },
      ] : []}
    >
      <Typography variant="h6" component="div" sx={{ mt: 2 }}>
        Últimos pagos registrados
      </Typography>
      <Typography paragraph>
        Los pagos asocian una transacción (efectivo o HelloAsso) con artículos (sesiones, membresías y tarjetas).
      </Typography>
      <OrderGrid />
      <Typography variant="h6" component="div" sx={{ mt: 2 }}>
        Artículos impagados
      </Typography>
      <Typography paragraph>
        Los artículos que aún no tienen un pago asociado se muestran a continuación.
      </Typography>
      <UnpaidItemsGrid />
      <Typography variant="h6" component="div" sx={{ mt: 2 }}>
        Inscripciones a recuperar
      </Typography>
      <Typography paragraph>
        Si los usuarios han pagado por inscripciones a sesiones que posteriormente fueron canceladas, estas últimas pueden ser utilizadas como reemplazo para otra inscripción.
      </Typography>
      <CourseRegistrationForReplacementGrid />
    </BackofficeContent>
  );
}