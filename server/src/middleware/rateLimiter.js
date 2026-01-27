/**
 * Simple in-memory rate limiter middleware
 * For production, consider using Redis-based solution
 */

const rateLimitStore = new Map();

/**
 * Rate limiting middleware
 * @param {Object} options - Rate limit configuration
 * @param {number} options.windowMs - Time window in milliseconds (default: 15 minutes)
 * @param {number} options.max - Maximum requests per window (default: 100)
 * @returns {Function} Express middleware
 */
const rateLimiter = (options = {}) => {
    const {
        windowMs = 15 * 60 * 1000, // 15 minutes
        max = 10000, // 10000 requests per windowMs
        message = "Too many requests, please try again later",
    } = options;

    return (req, res, next) => {
        const identifier = req.ip || req.connection.remoteAddress;
        const now = Date.now();
        const windowStart = now - windowMs;

        // Get or create request log for this IP
        if (!rateLimitStore.has(identifier)) {
            rateLimitStore.set(identifier, []);
        }

        const requests = rateLimitStore.get(identifier);

        // Remove old requests outside the time window
        const recentRequests = requests.filter((timestamp) => timestamp > windowStart);

        // Check if limit exceeded
        if (recentRequests.length >= max) {
            return res.status(429).json({ 
                success: false,
                statusCode: 429,
                message,
            });
        }

        // Add current request
        recentRequests.push(now);
        rateLimitStore.set(identifier, recentRequests);

        // Clean up old entries periodically
        if (Math.random() < 0.01) { // 1% chance to clean up
            cleanupOldEntries(windowStart);
        }

        next();
    };
};

/**
 * Clean up old rate limit entries
 * @param {number} cutoffTime - Remove entries older than this timestamp
 */
function cleanupOldEntries(cutoffTime) {
    for (const [identifier, requests] of rateLimitStore.entries()) {
        const recentRequests = requests.filter((timestamp) => timestamp > cutoffTime);

        if (recentRequests.length === 0) {
            rateLimitStore.delete(identifier);
        } else {
            rateLimitStore.set(identifier, recentRequests);
        }
    }
}

module.exports = rateLimiter;
