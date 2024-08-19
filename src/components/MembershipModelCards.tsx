import React from 'react';
import {
  IconButton,
  Stack, Tooltip,
  Typography
} from '@mui/material';
import { trpc } from '../common/trpc';
import { MembershipModel } from '@prisma/client';
import { Groups, PersonAdd } from '@mui/icons-material';
import { ModelCards } from './ModelCards';
import { useRouter } from 'next/router';
import { MembershipTypeNames } from '../common/membership';

export const MembershipModelCards: React.FC = () => {
  const router = useRouter();
  const trpcClient = trpc.useContext();

  return (
    <ModelCards
      procedureFindAll={trpc.membershipModel.findAll}
      procedureDelete={trpc.membershipModel.delete}
      deleteInvalidate={[trpcClient.membershipModel.find, trpcClient.membershipModel.findAll]}
      urlEditFor={({ id }) => `/administration/adhesions/types/${id}/edition`}
      urlCreate="/administration/adhesions/types/creation"
      createLabel="Nuevo tipo"
      skeletonCardHeight={130}
      renderCardContent={({ id, price }: MembershipModel) => (
        <>
          <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
            <Groups />
            <Typography variant="h5" component="div">
              Membresía
              {' '}
              {MembershipTypeNames[id].toLowerCase()}
            </Typography>
          </Stack>
          <Typography color="text.secondary">
            <strong>{price} $</strong> por membresía de <strong>1 año</strong>
          </Typography>
        </>
      )}
      renderAdditionalActions={({ id }: MembershipModel, disabled) => (
        <Tooltip title="Registrar una membresía">
          <IconButton size="small" disabled={disabled} onClick={() => router.push({ pathname: '/administration/adhesions/membres/creation', query: { membershipModelId: id } })}><PersonAdd /></IconButton>
        </Tooltip>
      )}
    />
  );
};
