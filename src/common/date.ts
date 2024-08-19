import { intervalToDuration } from 'date-fns';

export const WeekdayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const locale = 'es-MX';
const timeZone = 'America/Mexico_City';

const timeFormatterHHhMM = new Intl.DateTimeFormat(locale, {
  hour: 'numeric',
  minute: 'numeric',
  timeZone,
});

export const colonTimeToParts = (time: string): [number, number] => {
  if (/[0-9]{2}:[0-9]{2}/.test(time)) {
    const parts = time.split(':').map(s => parseInt(s)) as [number, number]; // Necessary cast
    const [hours, minutes] = parts;
    if (0 <= hours && hours < 24 && 0 <= minutes && minutes < 60) {
      return parts;
    }
  }
  throw new Error(time); // Invalid time format
};

export const timePartsToTotalMinutes = (parts: [number, number]): number => parts[0] * 60 + parts[1];

export const formatColonTimeHHhMM = (time: string): string => colonTimeToParts(time).map(n => n.toString().padStart(2, '0')).join('h');
export const formatTimeHHhMM = (date: Date | string) => timeFormatterHHhMM.format(new Date(date)).replace(':', 'h');

const dateFormatter = new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  timeZone,
});

const timeFormatterHHhMMmSSs = new Intl.DateTimeFormat(locale, {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  timeZone,
});

export const formatDateDDsMMsYYYY = (date: Date | string): string => dateFormatter.format(new Date(date));

export const formatDateDDsMMsYYYYsHHhMMmSSs = (date: Date | string, article: boolean = false): string => {
  return (article ? 'El ' : '') + [dateFormatter, timeFormatterHHhMMmSSs].map(formatter => formatter.format(new Date(date))).join(' a las ');
};

const dateFormatterLong = new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone,
});

export const formatDateDDsmmYYYY = (date: Date | string): string => dateFormatterLong.format(new Date(date));

export const formatTimestampRelative = (date: Date | string) => {
  const duration = intervalToDuration({
    start: new Date(date),
    end: new Date(),
  })

  let suffix: string;
  if (duration.years) {
    suffix = `${duration.years} año${duration.years > 1 ? 's' : ''}`;
  } else if (duration.months) {
    suffix = `${duration.months} meses`;
  } else if (duration.days) {
    if (duration.days === 1) {
      return 'Ayer';
    } else if (duration.days === 2) {
      return 'Anteayer';
    } else {
      suffix = `${duration.days} día${duration.days > 1 ? 's' : ''}`;
    }
  } else if (duration.hours) {
    suffix = `${duration.hours} hora${duration.hours > 1 ? 's' : ''}`;
  } else if (duration.minutes) {
    suffix = `${duration.minutes} minuto${duration.minutes > 1 ? 's' : ''}`;
  } else {
    suffix = `unos instantes`;
  }
  return `Hace ${suffix}`;
}

export const formatDayRange = (start: Date | string, end: Date | string, capitalize = true): string => {
  //const dateString = dateLiteralFormatter.format(new Date(start));
  //return [capitalize ? capitalizeFirst(dateString) : dateString, 'de', formatTimeRange(start, end)].join(' ');
  return '';
};

export const formatWeekday = (date: Date | string, capitalize = true) => {
  const weekday = WeekdayNames[(new Date(date).getDay() - 1 + WeekdayNames.length) % WeekdayNames.length];
  return capitalize ? weekday : weekday.toLowerCase();
};
