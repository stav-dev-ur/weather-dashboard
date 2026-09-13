/**
 * Weather API Configuration
 * Centralized API client setup and configuration
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const weatherApiKey = process.env.WEATHER_API_KEY;
const weatherApiUrl = process.env.WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5';

if (!weatherApiKey) {
  throw new Error('WEATHER_API_KEY environment variable is not set');
}

/**
 * Create axios instance for weather API calls
 */
const weatherApiClient = axios.create({
  baseURL: weatherApiUrl,
  timeout: 10000,
  params: {
    appid: weatherApiKey,
    units: 'metric'
  }
});

/**
 * Request interceptor for logging
 */
weatherApiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request Error:', error.message);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
weatherApiClient.interceptors.response.use(
  (response) => {
    console.log(`[API] Response: ${response.status} ${response.statusText}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`[API] Error: ${error.response.status} - ${error.response.statusText}`);
    } else if (error.request) {
      console.error('[API] No Response:', error.message);
    } else {
      console.error('[API] Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default weatherApiClient;
