import { BackofficeContent } from '../../../components/layout/admin/BackofficeContent';
import { CardGiftcard, AddCard } from '@mui/icons-material';
import { Typography } from '@mui/material';
import React from 'react';
import { CouponModelCards } from '../../../components/CouponModelCards';
import { CouponGrid } from '../../../components/grid/grids/CouponGrid';

export default function AdminCoupons() {

  return (
    <BackofficeContent
      title="Tarjetas"
      icon={<CardGiftcard />}
      quickActions={[
        { icon: <AddCard />, name: 'Generar una tarjeta', url: '/administration/cartes/emises/creation' },
        { icon: <CardGiftcard />, name: 'Nuevo tipo de tarjeta', url: '/administration/cartes/types/creation' },
      ]}
    >
      <Typography variant="h6" component="div" sx={{ mt: 2, mb: 1 }}>
        Tipos de tarjetas
      </Typography>
      <Typography paragraph>
        Estos tipos corresponden a las tarjetas que (en el futuro) se podrán comprar en la tienda.
        Al igual que los modelos de sesiones, puedes modificar y/o eliminar tipos de tarjetas sin afectar las tarjetas que ya se han generado.
      </Typography>
      <CouponModelCards />

      <Typography variant="h6" component="div" sx={{ mt: 2, mb: 1 }}>
        Tarjetas emitidas
      </Typography>
      <Typography paragraph>
        Una tarjeta emitida se puede utilizar como medio de pago en la tienda.
        Puede ser desactivada por un administrador.
      </Typography>
      <CouponGrid />
    </BackofficeContent>
  );
}