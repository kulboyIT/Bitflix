import { getFullDate } from 'utils';
import { TMDB_API_KEY, YTS_API_URL } from 'constants';

const TMDB_API_URL = 'https://api.themoviedb.org/3';

export const getTitles = async (
  {
    page = 1, queryTerm = 0, genres = '', sortBy = 'popularity.desc', language = 'en-US', releaseDate = getFullDate(),
  },
) => {
  try {
    const res = await fetch(`${TMDB_API_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=${sortBy}&release_date.lte=${releaseDate}&with_genres=${genres}&include_adult=false&include_video=true&page=${page}&language=${language}`);
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export const getTitleByIMDBId = async (id) => {
  try {
    const res = await fetch(`${YTS_API_URL}/list_movies.json?query_term=${id}`);
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export const getTitleData = async (id, language = 'en-US') => {
  try {
    const res = await fetch(`${TMDB_API_URL}/movie/${id}?api_key=${TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=${language}`);
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error(err);
  }
};
