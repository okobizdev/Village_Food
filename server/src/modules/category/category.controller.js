const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const CategoryService = require("./category.service.js");

class CategoryController {
  constructor() {
    this.createCategory = withTransaction(async (req, res, next, session) => {
      try {
        const payload = {
          name: req.body.name,
          slug: req.body.slug,
          status: req.body.status,
          image: req?.body?.image,
          imagePublicId: req?.body?.imagePublicId,
          vectorImage: req?.body?.vectorImage,
          vectorImagePublicId: req?.body?.vectorImagePublicId,
        };

        const categoryResult = await CategoryService.createCategory(
          payload,
          session
        );

        const resDoc = responseHandler(
          201,
          "Category Created successfully",
          categoryResult
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

    this.getAllCategory = catchError(async (req, res) => {
      const categoryResult = await CategoryService.getAllCategory();
      const resDoc = responseHandler(200, "Get All Categorys", categoryResult);
      res.status(resDoc.statusCode).json(resDoc);
    });

    this.getCategoryWithPagination = catchError(async (req, res) => {
      let payload = {
        page: req.query.page,
        limit: req.query.limit,
        order: req.query.order,
      };
      const category = await CategoryService.getCategoryWithPagination(payload);
      const resDoc = responseHandler(200, "Categorys get successfully", category);
      res.status(resDoc.statusCode).json(resDoc);
    });

    this.getSingleCategory = catchError(async (req, res) => {
      const id = req.params.id;
      const categoryResult = await CategoryService.getSingleCategory(id);
      const resDoc = responseHandler(
        201,
        "Single Category successfully",
        categoryResult
      );
      res.status(resDoc.statusCode).json(resDoc);
    });

    this.getSingleCategoryWithSlug = catchError(async (req, res) => {
      const slug = req.params.slug;
      const categoryResult = await CategoryService.getSingleCategoryWithSlug(
        slug
      );
      const resDoc = responseHandler(
        201,
        "Single Category successfully",
        categoryResult
      );
      res.status(resDoc.statusCode).json(resDoc);
    });

    this.updateCategory = catchError(async (req, res) => {
      try {
        const id = req.params.id;
        const payloadFiles = {
          files: req?.files,
        };
        const payload = {
          name: req.body.name,
          slug: req.body.slug,
          orderBy: req.body.orderBy ? Number(req.body.orderBy) : null,
          landingPageStatus: req.body.landingPageStatus === "true" || req.body.landingPageStatus === true,
          status: req.body.status === "true" || req.body.status === true,
          image: req.body.image,
          imagePublicId: req.body.imagePublicId,
          vectorImage: req.body.vectorImage,
          vectorImagePublicId: req.body.vectorImagePublicId,
        };

        await CategoryService.updateCategory(
          id,
          payloadFiles,
          payload
        );
        const resDoc = responseHandler(201, "Category Update successfully");
        res.status(resDoc.statusCode).json(resDoc);
      } catch (error) {
        if (error.code === 11000) {
          return res
            .status(400)
            .json({ message: "Product title already exists." });
        }
        throw error;
      }
    });

    this.updateCategoryStatus = catchError(async (req, res) => {
      const id = req.params.id;
      const { status } = req.body;

      if (status === undefined) {
        throw new Error("Status is required");
      }


      console.log(status, "ok");


      await CategoryService.updateCategoryStatus(
        id,
        status
      );
      const resDoc = responseHandler(200, "Category Status Update successfully");
      res.status(resDoc.statusCode).json(resDoc);
    });

    this.deleteCategory = catchError(async (req, res) => {
      const id = req.params.id;
      await CategoryService.deleteCategory(id);
      const resDoc = responseHandler(200, "Category Deleted successfully");
      res.status(resDoc.statusCode).json(resDoc);
    });

    this.getNavBar = catchError(async (req, res) => {
      const navBarResult = await CategoryService.getNavBar();
      const resDoc = responseHandler(
        201,
        "Single Navbar successfully",
        navBarResult
      );
      res.status(resDoc.statusCode).json(resDoc);
    });
  }
}

module.exports = new CategoryController();
