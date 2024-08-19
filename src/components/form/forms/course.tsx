import React, { useEffect, useMemo, useState } from 'react';
import {
  DatePickerElement,
  FormContainer, SwitchElement,
  TextFieldElement,
  useFormContext,
} from 'react-hook-form-mui';
import { z } from 'zod';
import {
  courseModelGetTransformSchema,
} from '../../../common/schemas';
import {
  Alert,
  Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack, Typography
} from '@mui/material';
import { InputPrice, InputSlots, SelectCourseType, SelectWeekday, TimePickerElement } from '../fields';
import { AddBox, Delete, Event } from '@mui/icons-material';
import { CreateFormContent, UpdateFormContent } from '../form';
import { ParsedUrlQuery } from 'querystring';
import {
  courseCreateManySchema,
  courseFindTransformSchema,
  courseUpdateNotesSchema,
  courseUpdateSchema
} from '../../../common/schemas/course';
import { SelectCourseModel } from '../fields/SelectCourseModel';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDateDDsMMsYYYY } from '../../../common/date';
import { trpc } from '../../../common/trpc';
import { useRouter } from 'next/router';
import { grey } from '@mui/material/colors';

const AddCourseSubmitButton = ({ onSubmit }: { onSubmit: any }) => {
  const { handleSubmit } = useFormContext();
  return (
    <Button onClick={() => handleSubmit(onSubmit)()}>
      Ajouter ces séances
    </Button>
  );
};

const withNormalizedTime = (date: Date): Date => {
  const copy = new Date(date);
  copy.setHours(0);
  copy.setMinutes(0);
  copy.setSeconds(0);
  copy.setMilliseconds(0);
  return copy;
}

interface RangeSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (data: { dateStart: Date, dateEnd: Date }) => void;
}

const RangeSelectionDialog: React.FC<RangeSelectionDialogProps> = ({ open, onClose, onSelect }) => {
  const today = useMemo(() => withNormalizedTime(new Date()), []);
  const schema = useMemo(() => {
    return z.strictObject({
      dateStart: z.date().min(today, `La fecha no puede estar en el pasado`),
      dateEnd: z.date(),
    }).superRefine(({ dateStart, dateEnd }, ctx) => {
      if (!(dateStart <= dateEnd)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['dateStart'],
          message: `La fecha de inicio no puede ser posterior a la fecha de fin`,
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['dateEnd'],
          message: `La fecha de fin no puede ser anterior a la fecha de inicio`,
        });
      }
    });
  }, [today]);
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <FormContainer onSuccess={onSelect} resolver={zodResolver(schema)} defaultValues={{}}>
        <DialogTitle>
          Selección de fechas
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Elige un rango de fechas para agregar a la lista.
          </DialogContentText>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <DatePickerElement name="dateStart" minDate={today} label="Fecha de inicio" />
            </Grid>
            <Grid item xs={6}>
              <DatePickerElement name="dateEnd" minDate={today} label="Fecha de fin" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={onClose} sx={{ color: grey[600] }}>Cancelar</Button>
          <AddCourseSubmitButton onSubmit={onSelect} />
        </DialogActions>
      </FormContainer>
    </Dialog>
  );
};

const DatesSelectionList = () => {
  const { getValues, setValue, watch } = useFormContext();
  const [open, setOpen] = useState(false);
  const handleSelect = ({ dateStart, dateEnd }: { dateStart: Date, dateEnd: Date }) => {
    setOpen(false);
    const values = getValues();
    const weekday = values.weekday as number;
    const currentDates = values.dates as Date[];
    const computeDatesBetween = (): Date[] => {
      let date = dateStart;
      const acc: Date[] = [];
      while (date.getDay() != (weekday + 1) % 7) {
        date = new Date(date);
        date.setDate(date.getDate() + 1);
      }
      while (date <= dateEnd) {
        acc.push(date);
        date = new Date(date);
        date.setDate(date.getDate() + 7);
      }
      return acc;
    };
    const allDates = currentDates.concat(computeDatesBetween());
    const allTimes = Array.from(new Set(allDates.map(date => date.getTime())));
    allTimes.sort((a, b) => a < b ? -1 : 1);
    setValue('dates', allTimes.map(time => new Date(time)));
  };
  const watchDates = watch('dates');
  const handleRemoveDate = (date: Date) => {
    const dates = getValues().dates as Date[];
    setValue('dates', dates.filter(d => d !== date));
  };
  const watchWeekday = watch('weekday');
  useEffect(() => {
    setValue('dates', []);
  }, [watchWeekday]);
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Typography variant="h6" component="div">
            Sesiones planifiées
          </Typography>
          <RangeSelectionDialog open={open} onClose={() => setOpen(false)} onSelect={handleSelect} />
          <Button endIcon={<AddBox />} onClick={() => setOpen(true)} disabled={watchWeekday == null}>
            Ajouter
          </Button>
        </Stack>
      </CardContent>
      <List dense>
        {watchDates.map((date: Date) => (
          <ListItem
            key={date.getTime()}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleRemoveDate(date)}>
                <Delete />
              </IconButton>
            }
          >
            <ListItemText
              primary={formatDateDDsMMsYYYY(date)}
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

const courseFormDefaultValues: { dates: Date[], modelId?: number, visible: boolean } = {
  dates: [] satisfies Date[],
  visible: true,
};

const useProceduresToInvalidate = () => {
  const { course } = trpc.useContext();
  return [course.find, course.findUpdate, course.findUpdateNotes, course.findAll];
};

const commonFormProps = {
  icon: <Event />,
  urlCancel: `/administration/seances`,
};

const querySchema = z.object({
  modelId: z.preprocess(
    (a) => a ? parseInt(z.string().parse(a), 10) : undefined,
    z.number().int().min(0).optional()
  ),
});

const CourseCreateFormContent = () => {
  const router = useRouter();
  const { watch, setValue } = useFormContext();
  const modelId = useMemo(() => {
    const parsed = querySchema.safeParse(router.query);
    if (parsed.success) {
      const { modelId } = parsed.data;
      return modelId ?? null;
    } else {
      return null;
    }
  }, [router]);
  const { data } = trpc.courseModel.find.useQuery({ id: modelId ?? 0 }, { enabled: modelId != null });
  useEffect(() => {
    if (data) {
      setValue('model', data);
    }
  }, [data, setValue]);

  const watchCourseModel = watch('model');
  const isUsingModel = useMemo(() => watchCourseModel != null, [watchCourseModel]);
  useEffect(() => {
    if (watchCourseModel) {
      setValue('type', watchCourseModel.type);
      setValue('weekday', watchCourseModel.weekday);
      setValue('timeStart', watchCourseModel.timeStart);
      setValue('timeEnd', watchCourseModel.timeEnd);
      setValue('slots', watchCourseModel.slots);
      setValue('price', watchCourseModel.price);
    }
  }, [watchCourseModel, setValue]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Alert severity="info">
          Vous pouvez optionnellement choisir un modèle de séance pour pré-remplir certains champs.
        </Alert>
      </Grid>
      <Grid item xs={12}>
        <SelectCourseModel name="model" />
      </Grid>
      <Grid item xs={12}>
        <SelectCourseType name="type" disabled={isUsingModel} />
      </Grid>
      <Grid item xs={12}>
        <SelectWeekday name="weekday" disabled={isUsingModel} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TimePickerElement name="timeStart" label="Heure de début" disabled={isUsingModel} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TimePickerElement name="timeEnd" label="Heure de fin" disabled={isUsingModel} />
      </Grid>
      <Grid item xs={12}>
        <InputSlots name="slots" disabled={isUsingModel} />
      </Grid>
      <Grid item xs={12}>
        <InputPrice name="price" disabled={isUsingModel} />
      </Grid>
      <Grid item xs={12}>
        <SwitchElement name="visible" label="Visible"/>
      </Grid>
      <Grid item xs={12} container justifyContent="center">
        <Grid item xs={12} md={6} lg={4}>
          <DatesSelectionList />
        </Grid>
      </Grid>
    </Grid>
  );
};

export const CourseCreateForm = () => {
  return (
    <CreateFormContent
      {...commonFormProps}
      title="Planificación de sesiones"
      schema={courseCreateManySchema}
      mutationProcedure={trpc.course.createMany}
      successMessage={() => 'Las sesiones han sido planificadas'} // TODO show count
      defaultValues={courseFormDefaultValues}
      urlSuccessFor={() => `/administration/seances`}
      invalidate={useProceduresToInvalidate()}
    >
      <CourseCreateFormContent />
    </CreateFormContent>
  );
};

export const CourseUpdateForm = ({ queryData }: { queryData: ParsedUrlQuery }) => {
  return (
    <UpdateFormContent
      {...commonFormProps}
      title="Modificación de una sesión planificada"
      schema={courseUpdateSchema}
      mutationProcedure={trpc.course.update}
      queryProcedure={trpc.course.findUpdate}
      querySchema={courseModelGetTransformSchema}
      queryParams={queryData}
      successMessage={() => 'Las características de la sesión han sido actualizadas'}
      defaultValues={{}}
      urlSuccessFor={({ id }) => `/administration/seances/planning/${id}`}
      invalidate={useProceduresToInvalidate()}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Alert severity="warning">
            Atención, estás a punto de modificar las características de una sesión ya planificada.
            Si cambias el precio, los usuarios ya inscritos y que aún no han pagado deberán abonar el nuevo monto.
          </Alert>
        </Grid>
        <Grid item xs={12}>
          <InputSlots name="slots" />
        </Grid>
        <Grid item xs={12}>
          <InputPrice name="price" />
        </Grid>
        <Grid item xs={12}>
          <SwitchElement name="visible" label="Visible" />
        </Grid>
      </Grid>
    </UpdateFormContent>
  );
};

export const CourseUpdateNotesForm = ({ queryData }: { queryData: ParsedUrlQuery }) => {
  return (
    <UpdateFormContent
      {...commonFormProps}
      title="Modificación de las notas de una sesión"
      schema={courseUpdateNotesSchema}
      mutationProcedure={trpc.course.updateNotes}
      queryProcedure={trpc.course.findUpdateNotes}
      querySchema={courseFindTransformSchema}
      queryParams={queryData}
      successMessage={() => 'Las notas de la sesión han sido actualizadas'}
      defaultValues={{ notes: null }}
      urlSuccessFor={({ id }) => `/administration/seances/planning/${id}`}
      invalidate={useProceduresToInvalidate()}
    >
      <TextFieldElement name="notes" label="Notas (visibles solo para ti)" multiline rows={4} fullWidth />
    </UpdateFormContent>
  );
};
