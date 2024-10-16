import { CourseType } from '@prisma/client';
import { Link } from '@mui/material';
import { LocationComete, LocationHome } from '../src/common/config';
import React from 'react';
import { CourseDataExplicit } from '../src/components/contents/common/courses';

export const coursesExplicit: Record<CourseType, CourseDataExplicit> = {
  [CourseType.YOGA_ADULT]: {
    isRegistrationOnline: true,
    anchor: 'adulte',
    age: `Adultos`,
    level: `Todos los niveles`,
    group: `Máximo 20 personas`,
    duration: `1h`,
    price: `360 $ por 30 sesiones o 135 $ por 10 sesiones o 15 $ / sesión + cuota anual de la asociación 15 $ / persona o 20 $ / familia`,
    location: `En su oficina`,
    //location: <>En mi domicilio en <Link href={LocationHome.googleUrl} target="_blank" rel="noreferrer nofollow">8 rue des moissonneurs, 68220 Hésingue</Link>. También puedo ir a su casa si forman un pequeño grupo, no dude en contactarme para ello.</>,
    stuff: `Esterilla de yoga y una manta, use ropa cómoda. Puede pedir prestados en el lugar bloques, correas, elásticos, cojines, bolster, pelotas y balones.`,
    registration: `Inscripción en línea desde el sitio, o bien contácteme`,
  },
  [CourseType.YOGA_CHILD]: {
    anchor: 'enfant',
    age: `6 a 12 años`,
    level: `Iniciación`,
    group: `6-8 niños`,
    duration: `1h`,
    price: `90 $/ trimestre y cuota 15 $/año para la asociación Yoga-Sof`,
    location: <Link href={LocationComete.googleUrl} target="_blank" rel="noreferrer nofollow">La Comète Salle Orion 16 Rue du 20 Novembre, 68220 Hésingue</Link>,
    stuff: `Venga con ropa suelta y cómoda que no apriete en el abdomen; esterilla, accesorios y otros materiales proporcionados`,
    registration: `Información o inscripciones, contácteme para conocernos antes de la sesión de prueba`,
  },
  [CourseType.YOGA_ADULT_CHILD]: {
    notStarted: true, // Pas encore commencé
    anchor: 'parent-enfant',
    age: `3 a 6 años`,
    level: `Iniciación`,
    group: `5 dúos`,
    duration: `1h`,
    price: `22 $ dúos, 25 $ para 2 niños`,
    location: `Por definir`,
    stuff: `Venga con ropa suelta y cómoda que no apriete en el abdomen, traiga una esterilla de yoga y una manta.`,
    registration: `Información o inscripciones en lista de espera, contácteme por correo`,
  },
};
