import {USER_STATUSES, StatsFilter, FilterType} from '../constants';
import {getFilmsByFilter} from './getFilmsByFilter';
import moment from 'moment';

export const getWatched = (films) => {
  return getFilmsByFilter(films, FilterType.HISTORY);
};

export const getTotalDuration = (watchedFilms) => {
  const totalTimeMins = watchedFilms.reduce((prev, {runtime}) => {
    return prev + runtime;
  }, 0);

  const duration = moment.duration(totalTimeMins, `minutes`);
  let hours = duration.hours();
  let mins = duration.minutes();

  if (mins > 0 && mins < 10) {
    mins = `0${mins}`;
  }

  return {hours, mins};
};

export const getWatchedByGenre = (watchedFilms) => {
  if (watchedFilms.length === 0) {
    return [];
  }

  const countGenres = watchedFilms.reduce((prev, {genres}) => {
    for (const genre of genres) {
      if (!prev[genre]) {
        prev[genre] = 0;
      }

      prev[genre]++;
    }
    return prev;
  }, {});

  const genresList = Object.entries(countGenres);

  genresList.sort((a, b) => {
    return b[1] - a[1];
  });

  return Object.fromEntries(genresList);
};

export const getWatchedByPeriod = (watchedFilms, periodName) => {
  if (periodName === StatsFilter.ALL_TIME) {
    return watchedFilms;
  }

  let date = new Date();

  switch (periodName) {
    case StatsFilter.YEAR:
      date.setFullYear(date.getFullYear() - 1);
      break;
    case StatsFilter.MONTH:
      date.setMonth(date.getMonth() - 1);
      break;
    case StatsFilter.WEEK:
      date.setDate(date.getDate() - 7);
      break;
    case StatsFilter.TODAY:
      date.setDate(date.getDate() - 1);
      break;
    default:
      return watchedFilms;
  }

  return watchedFilms.filter((item) => item.watchedDate > date);
};

export const getUserStatus = (watchedQuantity) => {
  const statusData = USER_STATUSES.find(({min}) => watchedQuantity >= min);
  return statusData ? statusData.name : ``;
};
