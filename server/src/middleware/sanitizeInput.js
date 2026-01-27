/**
 * Input sanitization middleware
 * Sanitizes request body, query, and params to prevent XSS and NoSQL injection
 */

/**
 * Recursively sanitize an object
 * @param {*} obj - Object to sanitize
 * @returns {*} Sanitized object
 */
function sanitizeValue(value) {
    if (value === null || value === undefined) {
        return value;
    }

    if (typeof value === "string") {
        // Remove potential XSS vectors
        return value
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
            .replace(/javascript:/gi, "")
            .replace(/on\w+\s*=/gi, "")
            .trim();
    }

    if (typeof value === "object") {
        // Prevent NoSQL injection by removing operators
        const sanitized = Array.isArray(value) ? [] : {};

        for (const key in value) {
            // Skip prototype pollution attempts
            if (key === "__proto__" || key === "constructor" || key === "prototype") {
                continue;
            }

            // Remove MongoDB operators in keys (except allowed ones in specific contexts)
            if (key.startsWith("$")) {
                continue;
            }

            sanitized[key] = sanitizeValue(value[key]);
        }

        return sanitized;
    }

    return value;
}

/**
 * Sanitize request middleware
 */
const sanitizeInput = (req, res, next) => {
    try {
        if (req.body) {
            req.body = sanitizeValue(req.body);
        }

        if (req.query) {
            req.query = sanitizeValue(req.query);
        }

        if (req.params) {
            req.params = sanitizeValue(req.params);
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = sanitizeInput;
