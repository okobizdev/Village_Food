const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const SubCategoryService = require("./sub.category.service.js");
const { ensureNullIfUndefined } = require("../../utils/helpers.js");

class SubCategoryController {
  createSubCategory = withTransaction(async (req, res, next, session) => {
    try {

      const payloadFiles = {
        files: req.files,
      };
      const payload = {
        name: req.body.name,
        status: req.body.status === true || req.body.status === "true",
        landingPageStatus:
          req.body.landingPageStatus === true ||
          req.body.landingPageStatus === "true",
        orderBy: ensureNullIfUndefined(req.body.orderBy)
          ? Number(req.body.orderBy)
          : null,
        slug: req.body.slug,
        categoryRef: req.body.categoryRef,
        viewType: ensureNullIfUndefined(req.body.viewType),
      };
      const subCategoryResult = await SubCategoryService.createSubCategory(
        payloadFiles,
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

  getAllSubCategory = catchError(async (req, res, next) => {
    const subCategoryResult = await SubCategoryService.getAllSubCategory();
    const resDoc = responseHandler(
      200,
      "Get All SubCategorys",
      subCategoryResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSubCategoryWithPagination = catchError(async (req, res, next) => {
    let payload = {
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

  getSingleSubCategory = catchError(async (req, res, next) => {
    const id = req.params.id;
    const subCategoryResult = await SubCategoryService.getSingleSubCategory(id);
    const resDoc = responseHandler(
      201,
      "Single SubCategory successfully",
      subCategoryResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleSubCategoryWithSlug = catchError(async (req, res, next) => {
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

  updateSubCategory = catchError(async (req, res, next, session) => {
    try {
      const id = req.params.id;
      const payloadFiles = {
        files: req?.files,
      };
      const payload = {
        name: req.body.name,
        status: req.body.status === true || req.body.status === "true",
        landingPageStatus:
          req.body.landingPageStatus === true ||
          req.body.landingPageStatus === "true",
        orderBy: ensureNullIfUndefined(req.body.orderBy)
          ? Number(req.body.orderBy)
          : null,
        slug: req.body.slug,
        categoryRef: req.body.categoryRef,
        viewType: ensureNullIfUndefined(req.body.viewType),
      };
      const subCategoryResult = await SubCategoryService.updateSubCategory(
        id,
        payloadFiles,
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

  updateSubCategoryStatus = catchError(async (req, res, next) => {
    const id = req.params.id;
    const status = req.query.status;
    const subCategoryResult = await SubCategoryService.updateSubCategoryStatus(
      id,
      status
    );
    const resDoc = responseHandler(
      201,
      "SubCategory Status Update successfully"
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteSubCategory = catchError(async (req, res, next) => {
    const id = req.params.id;
    const subCategoryResult = await SubCategoryService.deleteSubCategory(id);
    const resDoc = responseHandler(200, "SubCategory Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new SubCategoryController();
