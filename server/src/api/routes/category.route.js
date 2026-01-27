const { Router } = require("express");
const controller = require("../../modules/category/category.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const CategoryRoute = Router();

// Uncomment the line below if JWT authentication is required
// CategoryRoute.use(jwtAuth());
CategoryRoute.get("/navbar", controller.getNavBar);
CategoryRoute.route("/")
  .post(upload.any(), controller.createCategory)
  .get(controller.getAllCategory);

CategoryRoute.get("/pagination", controller.getCategoryWithPagination);

CategoryRoute.get("/:slug", controller.getSingleCategoryWithSlug);

// Admin-only endpoints for status updates
CategoryRoute.patch("/status/:id", controller.updateCategoryStatus);
CategoryRoute.patch("/landing/:id", controller.updateLandingPageStatus);

// Full update and delete routes
CategoryRoute.route("/:id")
  .get(controller.getSingleCategory)
  .put(upload.any(), controller.updateCategory)
  .delete(controller.deleteCategory);

module.exports = CategoryRoute;
