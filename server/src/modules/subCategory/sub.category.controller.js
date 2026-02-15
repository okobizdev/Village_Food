const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const SubCategoryService = require("./sub.category.service.js");

class SubCategoryController {
  constructor() {
    this.createSubCategory = withTransaction(async (req, res, next, session) => {
      try {
        const payload = {
          name: req.body.name,
          status: req.body.status === true || req.body.status === "true",
          slug: req.body.slug,
          categoryRef: req.body.categoryRef,
        };
        const subCategoryResult = await SubCategoryService.createSubCategory(
          payload,
          session
        );
        const resDoc = responseHandler(
          201,
          "SubCategory Created successfully",
          subCategoryResult
        );
        res.status(resDoc.statusCode).json(resDoc);
      } catch (error) {
        if (error.code === 11000) {
          return res
            .status(400)
            .json({ message: "Product title already exists." });
        }
        next(error);
      }
    });

    this.getAllSubCategory = catchError(async (req, res, _next) => {
      const subCategoryResult = await SubCategoryService.getAllSubCategory();
      const resDoc = responseHandler(
        200,
        "Get All SubCategorys",
        subCategoryResult
      );
      res.status(resDoc.statusCode).json(resDoc);
    });

    this.getSubCategoryWithPagination = catchError(async (req, res, _next) => {
      const payload = {
        page: req.query.page,
        limit: req.query.limit,
        order: req.query.order,
      };
      const subCategory = await SubCategoryService.getSubCategoryWithPagination(
        payload
      );
      const resDoc = responseHandler(
        200,
        "SubCategorys get successfully",
        subCategory
      );
      res.status(resDoc.statusCode).json(resDoc);
    });

    this.getSingleSubCategory = catchError(async (req, res, _next) => {
      const id = req.params.id;
      const subCategoryResult = await SubCategoryService.getSingleSubCategory(id);
      const resDoc = responseHandler(
        201,
        "Single SubCategory successfully",
        subCategoryResult
      );
      res.status(resDoc.statusCode).json(resDoc);
    });

    this.getSingleSubCategoryWithSlug = catchError(async (req, res, _next) => {
      const slug = req.params.slug;
      const subCategoryResult =
        await SubCategoryService.getSingleSubCategoryWithSlug(slug);
      const resDoc = responseHandler(
        201,
        "Single SubCategory successfully",
        subCategoryResult
      );
      res.status(resDoc.statusCode).json(resDoc);
    });

    this.updateSubCategory = catchError(async (req, res, _next, session) => {
      try {
        const id = req.params.id;
        const payload = {
          name: req.body.name,
          status: req.body.status === true || req.body.status === "true",
          slug: req.body.slug,
          categoryRef: req.body.categoryRef,
        };
        await SubCategoryService.updateSubCategory(
          id,
          payload,
          session
        );
        const resDoc = responseHandler(201, "SubCategory Update successfully");
        res.status(resDoc.statusCode).json(resDoc);
      } catch (error) {
        if (error.code === 11000) {
          return res
            .status(400)
            .json({ message: "Product title already exists." });
        }
      }
    });

    this.deleteSubCategory = catchError(async (req, res, _next) => {
      const id = req.params.id;
      await SubCategoryService.deleteSubCategory(id);
      const resDoc = responseHandler(200, "SubCategory Deleted successfully");
      res.status(resDoc.statusCode).json(resDoc);
    });
  }
}

module.exports = new SubCategoryController();
