/**
 * Standard API response handler
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Response message
 * @param {any} data - Response data
 * @param {string} url - Optional URL for created resources
 * @returns {object} Formatted response object
 */
const responseHandler = (statusCode, message, data = null, url = null) => {
  const response = {
    success: statusCode >= 200 && statusCode < 300,
    statusCode,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (url) {
    response.url = url;
  }

  return response;
};

module.exports = responseHandler;
