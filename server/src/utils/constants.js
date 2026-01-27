/**
 * Application-wide constants
 */

// HTTP Status Codes
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
};

// User Roles
const USER_ROLES = {
    ADMIN: "admin",
    CUSTOMER: "customer",
    VENDOR: "vendor",
    MANAGER: "manager",
};

// Order Status
const ORDER_STATUS = {
    PENDING: "pending",
    PROCESSING: "processing",
    CONFIRMED: "confirmed",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
    REFUNDED: "refunded",
};

// Payment Status
const PAYMENT_STATUS = {
    PENDING: "pending",
    COMPLETED: "completed",
    FAILED: "failed",
    REFUNDED: "refunded",
};

// Payment Methods
const PAYMENT_METHODS = {
    CASH_ON_DELIVERY: "cod",
    SSLCOMMERZ: "sslcommerz",
    BKASH: "bkash",
    NAGAD: "nagad",
};

// Inventory Status
const INVENTORY_STATUS = {
    IN_STOCK: "in_stock",
    LOW_STOCK: "low_stock",
    OUT_OF_STOCK: "out_of_stock",
};

// Product Status
const PRODUCT_STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    DRAFT: "draft",
};

// Regex Patterns
const REGEX_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_BD: /^(?:\+88)?01[3-9]\d{8}$/,
    MONGODB_ID: /^[0-9a-fA-F]{24}$/,
};

// Pagination
const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
};

// File Upload
const FILE_UPLOAD = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    ALLOWED_DOCUMENT_TYPES: ["application/pdf"],
};

module.exports = {
    HTTP_STATUS,
    USER_ROLES,
    ORDER_STATUS,
    PAYMENT_STATUS,
    PAYMENT_METHODS,
    INVENTORY_STATUS,
    PRODUCT_STATUS,
    REGEX_PATTERNS,
    PAGINATION,
    FILE_UPLOAD,
};
