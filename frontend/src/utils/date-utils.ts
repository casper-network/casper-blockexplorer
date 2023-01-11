import format from 'date-fns/format';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo('en-US');

export const defaultDateFormat = 'MMM do yyyy, h:mm:ss a';

export const formatDate = (date: Date) => {
  const readableTimestamp = format(date, defaultDateFormat);
  return readableTimestamp;
};

export const formatTimeAgo = (date: Date) => {
  const age = timeAgo.format(date, 'round');
  return age;
};
