/**
 * Error Handler Middleware
 * Centralized error handling for all API requests
 */

export function errorHandler(err, req, res, next) {
  console.error('[Error]', err);

  // Handle specific error types
  if (err.response?.status === 404) {
    return res.status(404).json({
      error: 'Location not found',
      message: err.message
    });
  }

  if (err.response?.status === 401) {
    return res.status(401).json({
      error: 'API Key Invalid',
      message: 'Please check your API key configuration'
    });
  }

  if (err.code === 'ECONNABORTED') {
    return res.status(504).json({
      error: 'Request Timeout',
      message: 'Weather API request timed out'
    });
  }

  // Default error response
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
}
