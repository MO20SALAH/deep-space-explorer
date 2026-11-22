import axios from 'axios';

const NASA_API_BASE_URL = 'https://api.nasa.gov';
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';

export const nasaClient = axios.create({
  baseURL: NASA_API_BASE_URL,
  params: {
    api_key: NASA_API_KEY,
  },
});

/**
 * Fetch Astronomy Picture of the Day (APOD)
 */
export const getAstronomyPictureOfTheDay = async (date = null) => {
  const params = date ? { date } : {};
  const response = await nasaClient.get('/planetary/apod', { params });
  return response.data;
};

/**
 * Fetch Mars Rover Photos
 */
export const getMarsRoverPhotos = async (sol = 1000, camera = null) => {
  const params = { sol, ...(camera ? { camera } : {}) };
  const response = await nasaClient.get('/mars-photos/api/v1/rovers/curiosity/photos', { params });
  return response.data;
};
