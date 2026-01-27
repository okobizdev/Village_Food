const { BadRequestError } = require("../utils/errors.js");

/**
 * Validate request body against a schema
 * @param {object} schema - Validation schema object
 * @returns {Function} Express middleware
 */
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            const { error, value } = schema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true,
            });

            if (error) {
                const errors = error.details.map((detail) => ({
                    field: detail.path.join("."),
                    message: detail.message,
                }));

                throw new BadRequestError("Validation failed", { errors });
            }

            req.body = value;
            next();
        } catch (err) {
            next(err);
        }
    };
};

/**
 * Validate MongoDB ObjectId
 * @param {string} paramName - Parameter name to validate
 * @returns {Function} Express middleware
 */
const validateObjectId = (paramName = "id") => {
    return (req, res, next) => {
        const id = req.params[paramName];
        const objectIdRegex = /^[0-9a-fA-F]{24}$/;

        if (!objectIdRegex.test(id)) {
            return next(new BadRequestError(`Invalid ${paramName} format`));
        }

        next();
    };
};

/**
 * Validate required query parameters
 * @param {Array<string>} requiredParams - Array of required parameter names
 * @returns {Function} Express middleware
 */
const validateQueryParams = (requiredParams = []) => {
    return (req, res, next) => {
        const missingParams = requiredParams.filter(
            (param) => !req.query[param]
        );

        if (missingParams.length > 0) {
            return next(
                new BadRequestError(
                    `Missing required query parameters: ${missingParams.join(", ")}`
                )
            );
        }

        next();
    };
};

module.exports = {
    validateRequest,
    validateObjectId,
    validateQueryParams,
};
