const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const ChildCategoryService = require("./child.category.service.js");

class ChildCategoryController {
  createChildCategory = withTransaction(async (req, res, next, session) => {
    try {

      const payload = {
        name: req.body.name,
        status: req.body.status,
        slug: req.body.slug,
        subCategoryRef: req.body.subCategoryRef,
      };
      const childCategoryResult =
        await ChildCategoryService.createChildCategory(
          payload,
          session
        );
      const resDoc = responseHandler(
        201,
        "ChildCategory Created successfully",
        childCategoryResult
      );
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ message: "ChildCategory name already exists." });
      }
    }
  });

  getAllChildCategory = catchError(async (req, res, next) => {
    const childCategoryResult = await ChildCategoryService.getAllChildCategory(
    );
    const resDoc = responseHandler(
      200,
      "Get All ChildCategorys",
      childCategoryResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getChildCategoryWithPagination = catchError(async (req, res, next) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const childCategory =
      await ChildCategoryService.getChildCategoryWithPagination(payload);
    const resDoc = responseHandler(
      200,
      "ChildCategorys get successfully",
      childCategory
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleChildCategory = catchError(async (req, res, next) => {
    const id = req.params.id;
    const childCategoryResult =
      await ChildCategoryService.getSingleChildCategory(id);
    const resDoc = responseHandler(
      201,
      "Single ChildCategory successfully",
      childCategoryResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleChildCategoryWithSlug = catchError(async (req, res, next) => {
    const slug = req.params.slug;
    const childCategoryResult =
      await ChildCategoryService.getSingleChildCategoryWithSlug(slug);
    const resDoc = responseHandler(
      201,
      "Single ChildCategory successfully",
      childCategoryResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateChildCategory = withTransaction(async (req, res, next, session) => {
    try {
      const id = req.params.id;
      const payload = {
        name: req.body.name,
        status: req.body.status,
        subCategoryRef: req.body.subCategoryRef,
      };

      const childCategoryResult = await ChildCategoryService.updateChildCategory(
        id,
        payload,
        session
      );
      const resDoc = responseHandler(201, "ChildCategory Update successfully");
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ message: "ChildCategory name already exists." });
      }
      next(error);
    }
  });


  deleteChildCategory = catchError(async (req, res, next) => {
    const id = req.params.id;
    const childCategoryResult = await ChildCategoryService.deleteChildCategory(
      id
    );
    const resDoc = responseHandler(200, "ChildCategory Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new ChildCategoryController();
