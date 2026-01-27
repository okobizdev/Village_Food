require('dotenv').config();

// console.log('Environment Variables Debug:');
// console.log('SERVER_URL:', process.env.SERVER_URL);
// console.log('SSLCOMMERZ_STORE_ID:', process.env.SSLCOMMERZ_STORE_ID);
// console.log('SSLCOMMERZ_API_URL:', process.env.SSLCOMMERZ_API_URL);

module.exports = {
    SERVER_URL: process.env.SERVER_URL,
    SSLCOMMERZ_STORE_ID: process.env.SSLCOMMERZ_STORE_ID,
    SSLCOMMERZ_STORE_PASSWORD: process.env.SSLCOMMERZ_STORE_PASSWORD,
    SSLCOMMERZ_API_URL: process.env.SSLCOMMERZ_API_URL,
    SSLCOMMERZ_VALIDATION_API: process.env.SSLCOMMERZ_VALIDATION_API
};
