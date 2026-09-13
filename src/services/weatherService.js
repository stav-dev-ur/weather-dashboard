/**
 * Weather Service
 * Handles all weather API calls and data transformation
 */

import weatherApiClient from '../config/api.js';
import cache from '../utils/cache.js';

/**
 * Get current weather for a location
 * @param {string} city - City name or coordinates
 * @param {string} countryCode - ISO 3166 country code (optional)
 * @returns {Promise<Object>} Weather data
 */
export async function getCurrentWeather(city, countryCode = '') {
  try {
    const query = countryCode ? `${city},${countryCode}` : city;
    const cacheKey = cache.generateKey('weather:current', { q: query });
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const response = await weatherApiClient.get('/weather', {
      params: { q: query }
    });

    const data = transformWeatherData(response.data);
    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch current weather: ${error.message}`);
  }
}

/**
 * Get weather forecast for a location
 * @param {string} city - City name or coordinates
 * @param {number} cnt - Number of forecasts (max 40)
 * @returns {Promise<Object>} Forecast data
 */
export async function getForecast(city, cnt = 40) {
  try {
    const cacheKey = cache.generateKey('weather:forecast', { q: city, cnt });
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const response = await weatherApiClient.get('/forecast', {
      params: { q: city, cnt }
    });

    const data = transformForecastData(response.data);
    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch forecast: ${error.message}`);
  }
}

/**
 * Get weather by coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Weather data
 */
export async function getWeatherByCoordinates(lat, lon) {
  try {
    const cacheKey = cache.generateKey('weather:coordinates', { lat, lon });
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const response = await weatherApiClient.get('/weather', {
      params: { lat, lon }
    });

    const data = transformWeatherData(response.data);
    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch weather by coordinates: ${error.message}`);
  }
}

/**
 * Transform raw weather API data into a cleaner format
 */
function transformWeatherData(data) {
  return {
    id: data.id,
    name: data.name,
    country: data.sys.country,
    coordinates: {
      latitude: data.coord.lat,
      longitude: data.coord.lon
    },
    temperature: {
      current: data.main.temp,
      feelsLike: data.main.feels_like,
      min: data.main.temp_min,
      max: data.main.temp_max
    },
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    visibility: data.visibility,
    windSpeed: data.wind.speed,
    windDegree: data.wind.deg || null,
    windGust: data.wind.gust || null,
    clouds: data.clouds.all,
    description: data.weather[0].main,
    detailedDescription: data.weather[0].description,
    icon: data.weather[0].icon,
    sunrise: new Date(data.sys.sunrise * 1000).toISOString(),
    sunset: new Date(data.sys.sunset * 1000).toISOString(),
    timestamp: new Date(data.dt * 1000).toISOString(),
    rainVolume: data.rain?.['1h'] || 0,
    snowVolume: data.snow?.['1h'] || 0
  };
}

/**
 * Transform raw forecast API data
 */
function transformForecastData(data) {
  return {
    id: data.city.id,
    name: data.city.name,
    country: data.city.country,
    coordinates: {
      latitude: data.city.coord.lat,
      longitude: data.city.coord.lon
    },
    timezone: data.city.timezone,
    forecasts: data.list.map(forecast => ({
      timestamp: new Date(forecast.dt * 1000).toISOString(),
      temperature: {
        current: forecast.main.temp,
        feelsLike: forecast.main.feels_like,
        min: forecast.main.temp_min,
        max: forecast.main.temp_max
      },
      humidity: forecast.main.humidity,
      pressure: forecast.main.pressure,
      windSpeed: forecast.wind.speed,
      windDegree: forecast.wind.deg || null,
      description: forecast.weather[0].main,
      detailedDescription: forecast.weather[0].description,
      icon: forecast.weather[0].icon,
      cloudCoverage: forecast.clouds.all,
      rainVolume: forecast.rain?.['3h'] || 0,
      snowVolume: forecast.snow?.['3h'] || 0,
      visibility: forecast.visibility,
      probability: forecast.pop * 100
    }))
  };
}

/**
 * Clear weather cache
 */
export function clearWeatherCache() {
  cache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return cache.stats();
}
