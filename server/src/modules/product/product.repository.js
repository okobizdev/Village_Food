// const { ProductSchema } = require("../../models/index.js");
const { default: mongoose } = require("mongoose");
const {
  ProductSchema,
  CategorySchema,
  OrderSchema,
  SubCategorySchema,
  ChildCategorySchema,
  SubChildCategorySchema,
  BrandSchema,
} = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class ProductRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createProduct(payload, session) {
    const newProduct = await this.#model.create([payload], { session });
    return newProduct;
  }

  async getProductsByStatus(status) {
    return await this.#model
      .find({ status },
        {
          name: 1,
          thumbnailImage: 1,
          price: 1,
          mrpPrice: 1,
          discount: 1,
          discountType: 1,
          discountAmount: 1,
          inventoryType: 1,
          productId: 1,
          inventoryRef: 1,
          slug: 1,
        }
      )
      .populate({
        path: "inventoryRef",
        select: "_id level",
      })
      .sort({ createdAt: -1 })
      .lean();
  }


  async updateProduct(id, payload) {
    const updatedProduct = await this.#model.findByIdAndUpdate(id, payload);
    if (!updatedProduct) {
      throw new Error("About Us not found");
    }
    return updatedProduct;
  }

  async getProductWithPagination(payload) {
    try {

      const {
        sortBy = "createdAt",
        minPrice,
        maxPrice,
        categoryId,
        categorySlug,
        subCategoryId,
        subCategorySlug,
        childCategoryId,
        childCategorySlug,
        brandId,
        brandSlug,
        isNewArrival,
        color,
        size,
        popular,
        bestSell,
        featured,
      } = payload;

      const filter = {};

      if (minPrice || maxPrice) {
        filter.price = {};

        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
      }

      // CATEGORY FILTER (PRIORITY BASED)
      if (childCategorySlug) {
        const child = await ChildCategorySchema.findOne({ slug: childCategorySlug });
        if (child) {
          filter.childCategoryRef = child._id;
        }
      }
      else if (subCategorySlug) {
        const sub = await SubCategorySchema.findOne({ slug: subCategorySlug });
        if (sub) {
          filter.subCategoryRef = sub._id;
        }
      }
      else if (categorySlug) {
        const cat = await CategorySchema.findOne({ slug: categorySlug });
        if (cat) {
          filter.categoryRef = cat._id;
        }
      }


      if (brandId) {
        filter.brandRef = new mongoose.Types.ObjectId(String(brandId));
      }

      if (brandSlug) {
        const brand = await BrandSchema.findOne({ slug: brandSlug });
        if (brand) {
          filter.brandRef = brand._id;
        } else {
          return { result: [], pagination: {}, filterOptions: {} };
        }
      }

      if (isNewArrival) {
        const daysAgo = 30; // Define how many days ago counts as "new"
        const newArrivalDate = new Date();
        newArrivalDate.setDate(newArrivalDate.getDate() - daysAgo);
        filter.createdAt = { $gte: newArrivalDate };
      }

      // Color filter
      if (color) {
        filter["inventoryRef.variants"] = {
          $elemMatch: { color: color }, // Matches any variant with the given color
        };
      }

      // Size filter
      if (size) {
        filter["inventoryRef.variants.sizeOptions"] = {
          $elemMatch: { size: size }, // Matches any variant with the given size
        };
      }

      // Sorting logic based on filters
      let sortCriteria = { [sortBy]: -1 };

      // Best-Selling Products (Sort by total orders)
      if (bestSell) {
        const bestSellingProducts = await OrderSchema.aggregate([
          { $unwind: "$products" },
          {
            $group: {
              _id: "$products.productRef",
              orderCount: { $sum: "$products.quantity" }, // Sum total quantity ordered
            },
          },
          { $sort: { orderCount: -1 } }, // Sort by highest orders
        ]);

        const productIds = bestSellingProducts.map((p) => p._id);
        filter._id = { $in: productIds }; // Filter product that are best sellers
        sortCriteria = { orderCount: -1 };
      }

      // Featured Products (Sort by highest discount)
      if (featured) {
        sortCriteria = { discountPercentage: -1 };
      }

      // Popular Products (Sort by highest orders + highest discount)
      if (popular) {
        const popularProducts = await OrderSchema.aggregate([
          { $unwind: "$products" },
          {
            $group: {
              _id: "$products.productRef",
              orderCount: { $sum: "$products.quantity" }, // Total sales count
            },
          },
          { $sort: { orderCount: -1 } },
        ]);

        const productIds = popularProducts.map((p) => p._id);
        filter._id = { $in: productIds };
        sortCriteria = { orderCount: -1, discountPercentage: -1 }; // Sort by highest orders + discount
      }

      const productsWithPagination = await pagination(
        payload,
        async (limit, offset) => {
          const product = await this.#model
            .find(filter, {
              name: 1,
              thumbnailImage: 1,
              price: 1,
              mrpPrice: 1,
              discount: 1,
              discountType: 1,
              discountAmount: 1,
              inventoryType: 1,
              productId: 1,
              inventoryRef: 1,
              slug: 1,
            })
            .populate({
              path: "inventoryRef",
              select: "_id level",
            })
            .sort(sortCriteria)
            .skip(offset)
            .limit(limit)
            .lean();

          const totalProducts = await this.#model.countDocuments(filter);
          return { doc: product, totalDoc: totalProducts };
        }
      );

      // Aggregation for filter options
      const filterAggregation = await this.#model.aggregate([
        {
          $group: {
            _id: null,
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
            sizes: { $push: "$inventoryRef.variants.sizeOptions" },
          },
        },
        { $project: { _id: 0, minPrice: 1, maxPrice: 1 } },
      ]);

      const filterOptions = filterAggregation[0] || {
        colors: [],
        sizes: [],
        minPrice: 0,
        maxPrice: 0,
      };

      // Flatten and get unique sizes
      const flattenedSizes = Array.isArray(filterOptions.sizes)
        ? filterOptions.sizes.flat()
        : [];

      const uniqueSizes = [...new Set(flattenedSizes)]; // Remove duplicates

      // Fetch categories with subcategories
      const categories = await this.getCategoriesWithSubcategoriesAndCounts();

      return {
        result: productsWithPagination.result,
        pagination: productsWithPagination.pagination,
        filterOptions: {
          categories,
          colors: filterOptions.colors,
          sizes: uniqueSizes,
          priceRange: {
            minPrice: filterOptions.minPrice,
            maxPrice: filterOptions.maxPrice,
          },
        },
      };
    } catch (error) {
      console.error("Error getting product with pagination:", error);
      throw error;
    }
  }

  async getProductWithPaginationForAdmin(payload) {
    try {
      const productsWithPagination = await pagination(
        payload,
        async (limit, offset) => {
          const product = await this.#model
            .find()
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)
            .populate([
              { path: "inventoryRef", select: "" },
              { path: "categoryRef", select: "" },
              { path: "subCategoryRef", select: "" },
              { path: "childCategoryRef", select: "" },
              { path: "brandRef", select: "" },
            ]);

          // Filter out product without matching inventory
          const totalProduct = await this.#model.countDocuments();

          return { doc: product, totalDoc: totalProduct };
        }
      );
      return productsWithPagination;
    } catch (error) {
      console.error("Error getting product with pagination:", error);
      throw error;
    }
  }

  async getCategoriesWithSubcategoriesAndCounts() {
    try {
      const categories = await CategorySchema.aggregate([
        // Lookup subcategories linked to the category
        {
          $lookup: {
            from: "subcategories",
            localField: "_id",
            foreignField: "categoryRef",
            as: "subCategoryDetails",
          },
        },
        {
          $unwind: {
            path: "$subCategoryDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        // Lookup child categories linked to the subcategory
        {
          $lookup: {
            from: "childcategories",
            localField: "subCategoryDetails._id",
            foreignField: "subCategoryRef",
            as: "childCategoryDetails",
          },
        },
        {
          $unwind: {
            path: "$childCategoryDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $addFields: {
            productCount: {
              $ifNull: [
                { $arrayElemAt: ["$productCounts.productCount", 0] },
                0,
              ],
            },
          },
        },

        // Group by child category
        {
          $group: {
            _id: {
              categoryId: "$_id",
              subCategoryId: "$subCategoryDetails._id",
              childCategoryId: "$childCategoryDetails._id",
            },
            categoryName: { $first: "$name" },
            categoryImage: { $first: "$image" },
            categoryColorCode: { $first: "$colorCode" },
            categorySlug: { $first: "$slug" },
            categoryStatus: { $first: "$status" },
            subCategoryName: { $first: "$subCategoryDetails.name" },
            subCategorySlug: { $first: "$subCategoryDetails.slug" },
            subCategoryStatus: { $first: "$subCategoryDetails.status" },
            childCategoryName: { $first: "$childCategoryDetails.name" },
            childCategorySlug: { $first: "$childCategoryDetails.slug" },
            childCategoryStatus: { $first: "$childCategoryDetails.status" },
            subChildCategories: {
              $push: {
                _id: "$subChildCategoryDetails._id",
                name: "$subChildCategoryDetails.name",
                slug: "$subChildCategoryDetails.slug",
                status: "$subChildCategoryDetails.status",
                productCount: "$productCount",
              },
            },
            childCategoryProductCount: { $sum: "$productCount" },
          },
        },

        // Group by subcategory
        {
          $group: {
            _id: {
              categoryId: "$_id.categoryId",
              subCategoryId: "$_id.subCategoryId",
            },
            categoryName: { $first: "$categoryName" },
            categoryImage: { $first: "$categoryImage" },
            categoryColorCode: { $first: "$categoryColorCode" },
            categorySlug: { $first: "$categorySlug" },
            categoryStatus: { $first: "$categoryStatus" },
            subCategoryName: { $first: "$subCategoryName" },
            subCategorySlug: { $first: "$subCategorySlug" },
            subCategoryStatus: { $first: "$subCategoryStatus" },
            childCategories: {
              $push: {
                _id: "$_id.childCategoryId",
                name: "$childCategoryName",
                slug: "$childCategorySlug",
                status: "$childCategoryStatus",
                subChildCategories: "$subChildCategories",
                childCategoryProductCount: "$childCategoryProductCount",
              },
            },
            subCategoryProductCount: { $sum: "$childCategoryProductCount" },
          },
        },

        // Group by category
        {
          $group: {
            _id: "$_id.categoryId",
            name: { $first: "$categoryName" },
            image: { $first: "$categoryImage" },
            colorCode: { $first: "$categoryColorCode" },
            slug: { $first: "$categorySlug" },
            status: { $first: "$categoryStatus" },
            subCategories: {
              $push: {
                _id: "$_id.subCategoryId",
                name: "$subCategoryName",
                slug: "$subCategorySlug",
                status: "$subCategoryStatus",
                childCategories: "$childCategories",
                subCategoryProductCount: "$subCategoryProductCount",
              },
            },
            categoryProductCount: { $sum: "$subCategoryProductCount" },
          },
        },

        {
          $sort: { name: 1 },
        },
      ]);

      return categories;
    } catch (error) {
      console.error(
        "Error getting categories with subcategories and counts:",
        error
      );
      throw error;
    }
  }
  async updateProductInventory(id, productRef, session) {
    const data = await this.#model.findByIdAndUpdate(
      productRef,
      { $pull: { inventoryRef: id } },
      { session }
    );
    return data;
  }
  async addProductInventory(id, productRef, session) {

    const data = await this.#model.findByIdAndUpdate(
      productRef,
      { $push: { inventoryRef: id } },
      { session }
    );
    return data;
  }
  async getAllProductForHomePage(payload) {
    const { limit = 10, subCategoryRef } = payload;

    const product = await this.#model
      .find({
        subCategoryRef: subCategoryRef,
      })
      .limit(limit)
      .populate("inventoryRef")
      .sort({ createdAt: -1 });
    return product;
  }

  async getRelatedProduct(payload) {
    const { id } = payload;
    const product = await this.#model.findById(id).populate("categoryRef");
    const relatedProducts = await this.#model
      .find({
        categoryRef: product.categoryRef._id,
        _id: { $ne: id },
      },
        {
          name: 1,
          slug: 1,
          thumbnailImage: 1,
          price: 1,
          mrpPrice: 1,
          discount: 1,
          discountType: 1,
          discountAmount: 1,
          inventoryType: 1,
          productId: 1,
          inventoryRef: 1,
        }
      )
      .populate({
        path: "inventoryRef",
        select: "_id level",
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return relatedProducts;
  }

  async getSearchProduct(payload) {
    const { search } = payload;


    let query = {};

    if (search && search.trim() !== "") {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }

    const product = await this.#model.find(query).sort({ createdAt: -1 });
    return product;
  }

  async updateProductStatus(id, payload) {
    return await this.#model.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true }
    );
  }

  async togglePriority(id) {
    const product = await this.#model.findById(id);
    if (!product) throw new Error("Product not found");

    const updatedProduct = await this.#model.findByIdAndUpdate(
      id,
      { priority: !product.priority },
      { new: true }
    );

    return updatedProduct;
  }
}

module.exports = new ProductRepository(ProductSchema);
