/**
 * Weather Routes
 * API endpoints for weather operations
 */

import express from 'express';
import * as weatherService from '../services/weatherService.js';

const router = express.Router();

/**
 * GET /api/weather
 * Get current weather by city name or coordinates
 * Query params: city OR (lat and lon)
 */
router.get('/weather', async (req, res, next) => {
  try {
    const { city, lat, lon, country } = req.query;

    if (!city && (!lat || !lon)) {
      return res.status(400).json({
        error: 'Missing required parameters. Provide either city or lat/lon coordinates.'
      });
    }

    let weatherData;
    if (city) {
      weatherData = await weatherService.getCurrentWeather(city, country);
    } else {
      weatherData = await weatherService.getWeatherByCoordinates(parseFloat(lat), parseFloat(lon));
    }

    res.json(weatherData);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/forecast
 * Get weather forecast for a city
 * Query params: city, cnt (optional, max 40)
 */
router.get('/forecast', async (req, res, next) => {
  try {
    const { city, cnt = 40 } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    const forecastData = await weatherService.getForecast(city, parseInt(cnt));
    res.json(forecastData);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/cache-stats
 * Get cache statistics
 */
router.get('/cache-stats', (req, res) => {
  const stats = weatherService.getCacheStats();
  res.json(stats);
});

/**
 * POST /api/cache-clear
 * Clear all cache
 */
router.post('/cache-clear', (req, res) => {
  weatherService.clearWeatherCache();
  res.json({ message: 'Cache cleared successfully' });
});

export default router;
