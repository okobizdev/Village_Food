const { UnauthorizedError, ForbiddenError } = require("../../utils/errors.js");
const { verifyAccessToken } = require("../../utils/jwt.js");
const { RoleSchema } = require("../../models/index.js");

/**
 * JWT Authentication Middleware
 * @param {Array<string>|null} requiredRoles - Optional array of required roles
 * @param {Object} permission - Optional permission object with module and action
 * @returns {Function} Express middleware function
 */
const jwtAuth = (requiredRoles = null, permission = null) => {
  return async (req, res, next) => {
    try {
      // Extract token from Authorization header
      const bearer = req.headers.authorization || req.headers.Authorization;

      if (!bearer || !bearer.startsWith("Bearer ")) {
        throw new UnauthorizedError("Authentication token not found");
      }

      const token = bearer.split("Bearer ")[1].trim();

      // Verify token
      const payload = await verifyAccessToken(token);
      if (!payload) {
        throw new UnauthorizedError("Invalid or expired token");
      }

      // Check role-based permissions
      const userRoleRef = payload.userInfo?.user_info_encrypted?.roleRef;
      const userRole = payload.userInfo?.user_info_encrypted?.role;

      // If specific permissions are required
      if (permission && permission.module && permission.action) {
        const rolePermissions = await RoleSchema.findById(userRoleRef).lean();

        if (!rolePermissions?.permissions?.[permission.module]?.[permission.action]) {
          throw new ForbiddenError("Insufficient permissions for this action");
        }
      }

      // If specific roles are required
      if (requiredRoles && Array.isArray(requiredRoles) && requiredRoles.length > 0) {
        const normalizedRoles = requiredRoles.map(role => role.toLowerCase());
        const normalizedUserRole = userRole?.toLowerCase();

        if (!normalizedUserRole || !normalizedRoles.includes(normalizedUserRole)) {
          throw new ForbiddenError(`Access restricted to ${requiredRoles.join(", ")} roles only`);
        }
      }

      // Attach user info to request
      req.user = { ...payload.userInfo };
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = jwtAuth;

