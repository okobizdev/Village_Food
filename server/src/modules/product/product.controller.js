const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const ProductService = require("./product.service.js");
const { ensureNullIfUndefined } = require("../../utils/helpers.js");

class ProductController {
  
  createProduct = withTransaction(async (req, res, next, session) => {
    try {
      const payloadFiles = {
        files: req.files,
      };

      const payload = {
        name: req.body.name,
        description: req.body.description,

        mrpPrice: req.body.mrpPrice,

        discountType: ensureNullIfUndefined(req.body.discountType),
        discount: req.body.discount,
        videoUrl: req.body.videoUrl,
        freeShipping: req.body.freeShipping,
        brandRef: ensureNullIfUndefined(req.body.brandRef),
        categoryRef: ensureNullIfUndefined(req.body.categoryRef),
        subCategoryRef: ensureNullIfUndefined(req.body.subCategoryRef),
        childCategoryRef: ensureNullIfUndefined(req.body.childCategoryRef),
        inventoryType: req.body.inventoryType,
        inventory: req?.body?.inventory,
        inventoryArray: req?.body?.inventoryArray
          ? JSON.parse(req?.body?.inventoryArray)
          : [],
        slug: req.body.slug,
        barcode: req.body.barcode,
        // Cloudinary image URLs
        thumbnailImage: req.body.thumbnailImage,
        optionalImages: req.body,
      };

      const productResult = await ProductService.createProduct(
        payloadFiles,
        payload,
        session
      );
      const resDoc = responseHandler(
        201,
        "Product Created successfully",
        productResult
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

  getBestSellerProducts = catchError(async (req, res) => {
    const products = await ProductService.getProductsByStatus("bestSeller");
    const resDoc = responseHandler(200, "Best Seller Products", products);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getBestDealProducts = catchError(async (req, res) => {
    const products = await ProductService.getProductsByStatus("bestDeal");
    const resDoc = responseHandler(200, "Best Deal Products", products);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getPopularProducts = catchError(async (req, res) => {
    const products = await ProductService.getProductsByStatus("popular");
    const resDoc = responseHandler(200, "Popular Products", products);
    res.status(resDoc.statusCode).json(resDoc);
  });


  getAllProduct = catchError(async (req, res) => {
    const payload = {
      warehouseRef: req.query.warehouseRef,
    };
    const productResult = await ProductService.getAllProduct(payload);
    const resDoc = responseHandler(200, "Get All Products", productResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllProductForHomePage = catchError(async (req, res) => {
    const payload = {
      limit: req.query.limit,
      viewType: req.query.viewType,
    };
    const productResult = await ProductService.getAllProductForHomePage(
      payload
    );
    const data = {
      result: productResult?.product,
      category: productResult?.subCategory,
    };
    const resDoc = responseHandler(200, "Get All Products", data);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getRelatedProduct = catchError(async (req, res) => {
    const payload = {
      id: req.params.id,
    };
    const productResult = await ProductService.getRelatedProduct(payload);
    const resDoc = responseHandler(200, "Get All Products", productResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSearchProduct = catchError(async (req, res) => {
    const payload = {
      search: req.query.search,
    };
    const productResult = await ProductService.getSearchProduct(payload);
    const resDoc = responseHandler(200, "Get All Products", productResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getProductWithPagination = catchError(async (req, res) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
      sortBy: req.query.sortBy, 
      minPrice: req.query.minPrice, 
      maxPrice: req.query.maxPrice,
      categoryId: req.query.categoryId,
      categorySlug: req.query.categorySlug,
      subCategoryId: req.query.subCategoryId,
      subCategorySlug: req.query.subCategorySlug,
      childCategoryId: req.query.childCategoryId,
      childCategorySlug: req.query.childCategorySlug,
      brandId: req.query.brandId,
      brandSlug: req.query.brandSlug,
      isNewArrival: req.query.isNewArrival,
      color: req.query.color,
      level: req.query.level,
      popular: req.query.popular,
      bestSell: req.query.bestSell,
      featured: req.query.featured,
    };

    // Fetch products and filter options
    const product = await ProductService.getProductWithPagination(payload);

    // Prepare the response
    const resDoc = responseHandler(200, "Products retrieved successfully", {
      ...product,
    });

    res.status(resDoc.statusCode).json(resDoc);
  });

  getProductWithPaginationForAdmin = catchError(async (req, res) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
      warehouseRef: req.query.warehouseRef,
    };

    // Fetch products and filter options
    const product = await ProductService.getProductWithPaginationForAdmin(
      payload
    );

    // Prepare the response
    const resDoc = responseHandler(200, "Products retrieved successfully", {
      ...product,
    });

    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleProduct = catchError(async (req, res) => {
    const slug = req.params.slug;

    const productResult = await ProductService.getSingleProduct(slug);

    const resDoc = responseHandler(
      201,
      "Single Product successfully",
      productResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateProduct = withTransaction(async (req, res, next, session) => {
    try {
      const id = req.params.id;

      const payloadFiles = {
        files: req?.files,
      };

      const payload = {
        name: req.body.name,
        description: req.body.description,

        mrpPrice: req.body.mrpPrice,

        discountType: ensureNullIfUndefined(req.body.discountType),
        discount: ensureNullIfUndefined(req.body.discount),
        videoUrl: req.body.videoUrl,
        freeShipping: req.body.freeShipping,
        brandRef: ensureNullIfUndefined(req.body.brandRef),
        categoryRef: ensureNullIfUndefined(req.body.categoryRef),
        subCategoryRef: ensureNullIfUndefined(req.body.subCategoryRef),
        childCategoryRef: ensureNullIfUndefined(req.body.childCategoryRef),
        inventoryType: req.body.inventoryType,
        inventory: req?.body?.inventory,
        inventoryArray: req?.body?.inventoryArray
          ? JSON.parse(req?.body?.inventoryArray)
          : [],
        slug: req.body.slug,
        barcode: req.body.barcode,
        // Cloudinary image URLs
        thumbnailImage: req.body.thumbnailImage,
        optionalImages: req.body,
      };


      await ProductService.updateProduct(id, payloadFiles, payload, session);
      const resDoc = responseHandler(201, "Product Update successfully");
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

  togglePriority = catchError(async (req, res) => {
    const { id } = req.params;
    const updatedProduct = await ProductService.togglePriority(id);

    res.status(200).json({
      success: true,
      message: "Product priority toggled successfully",
      data: updatedProduct,
    });
  });

  updateProductStatus = catchError(async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;

    await ProductService.updateProductStatus(id, status);
    const resDoc = responseHandler(201, "Product Status Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteProduct = withTransaction(async (req, res, next, session) => {
    const id = req.params.id;

    await ProductService.deleteProduct(id, session);
    const resDoc = responseHandler(200, "Product Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new ProductController();
