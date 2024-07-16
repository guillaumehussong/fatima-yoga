import React from 'react';
import { BackofficeContent } from '../../../components/layout/admin/BackofficeContent';
import { Assignment } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { CourseRegistrationEventGrid } from '../../../components/grid/grids/CourseRegistrationEventGrid';
import { CourseRegistrationGrid } from '../../../components/grid/grids/CourseRegistrationGrid';

export default function AdminCourseRegistrations() {
  return (
    <BackofficeContent
      title="Inscripciones"
      icon={<Assignment />}
      quickActions={[
        { icon: <Assignment />, name: 'Inscrire des utilisateurs à des séances', url: '/administration/inscripciones/creation' }
      ]}
    >
      <Typography variant="h6" component="div" sx={{ mt: 2 }}>
        Derniers mouvements
      </Typography>
      <Typography paragraph>
        Dernières inscripciones ou désinscripciones à des séances programmées.
      </Typography>
      <CourseRegistrationEventGrid />

      <Typography variant="h6" component="div" sx={{ mt: 2 }}>
        Inscripciones actives
      </Typography>
      <Typography paragraph>
        Liste des inscripciones actives à des séances programmées (passées ou futures).
        Vous pouvez vous rendre sur la page d'une séance ou d'un utilisateur afin de filtrer ces données.
        La colonne adhésion indique si l'utilisateur possède un statut d'adhérent le jour de la séance.
      </Typography>
      <CourseRegistrationGrid />
    </BackofficeContent>
  );
}
