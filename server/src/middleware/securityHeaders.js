/**
 * Security headers middleware
 * Adds various security headers to protect against common vulnerabilities
 */

const securityHeaders = (req, res, next) => {
    // Prevent clickjacking attacks
    res.setHeader("X-Frame-Options", "DENY");

    // Prevent MIME type sniffing
    res.setHeader("X-Content-Type-Options", "nosniff");

    // Enable XSS protection
    res.setHeader("X-XSS-Protection", "1; mode=block");

    // Referrer policy
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

    // Permissions policy (formerly Feature-Policy)
    res.setHeader(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=()"
    );

    // Strict-Transport-Security (HSTS) - only in production with HTTPS
    if (process.env.NODE_ENV === "production") {
        res.setHeader(
            "Strict-Transport-Security",
            "max-age=31536000; includeSubDomains"
        );
    }

    next();
};

module.exports = securityHeaders;
