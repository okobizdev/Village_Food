const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");
const productRepository = require("./product.repository.js");
const {
  removeUploadFile,
} = require("../../middleware/upload/removeUploadFile.js");
const inventoryRepository = require("../inventory/inventory.repository.js");
const { calculateDiscountAmount } = require("../../utils/calculation.js");
const ImgUploader = require("../../middleware/upload/ImgUploder.js");
const { default: mongoose } = require("mongoose");
const { ProductSchema } = require("../../models/index.js");
const { idGenerate } = require("../../utils/IdGenerator.js");
const { generateEAN13Barcode } = require("../../utils/barcodeGenerate.js");
const subCategoryRepository = require("../subCategory/sub.category.repository.js");
const categoryRepository = require("../category/category.repository.js");

class ProductService extends BaseService {
  #repository;
  #inventoryRepository;
  #categoryRepository;
  #subCategoryRepository;
  constructor(
    repository,
    inventoryRepository,
    categoryRepository,
    subCategoryRepository,
    serviceName
  ) {
    super(
      repository,
      inventoryRepository,
      categoryRepository,
      subCategoryRepository,
      serviceName
    );
    this.#repository = repository;
    this.#inventoryRepository = inventoryRepository;
    this.#categoryRepository = categoryRepository;
    this.#subCategoryRepository = subCategoryRepository;
  }

  async createProduct(payloadFiles, payload, session) {
    // console.log("Payload", payload);
    const { files } = payloadFiles;
    const {
      name,
      // description,
      barcode,
      mrpPrice,
      discountType,
      discount,
      inventoryType,
      inventory,
      inventoryArray,
      // videoUrl,
      // freeShipping,
      // brandRef,
      // categoryRef,
      // subCategoryRef,
    } = payload;

    if (!name) {
      throw new Error("Name is required");
    }
    let invenoryIds = [];
    let totalInventoryCount = 0;

    payload.inventoryType = inventoryType;
    // activeTabName == 'colorInventory' || activeTabName == "levelInventory" || activeTabName == "colorLevelInventory")
    if (inventoryType == "colorInventory") {
      let newInventoryId = "";
      for (const item of inventoryArray) {
        const color = item.colorCode || "#000000";
        const name = item.color || "Unknown";
        const quantity = parseInt(item.quantity) || 0;
        totalInventoryCount += quantity;
        const title = "INV-";
        if (newInventoryId === "") {
          newInventoryId = await idGenerate(
            "INV-",
            "inventoryID",
            this.#inventoryRepository
          );
        } else {
          let id = Number(newInventoryId.slice(title.length + 6)) + 1;
          let prefix = newInventoryId.slice(0, title.length + 6);
          newInventoryId = prefix + id;
        }
        const newInventory = {
          quantity: quantity,
          availableQuantity: quantity,
          inventoryType: inventoryType,
          color,
          name,
          barcode: item.barcode || generateEAN13Barcode(),
          inventoryID: newInventoryId,
        };
        const createNewInventory = await this.#inventoryRepository.create(
          newInventory,
          session
        );
        invenoryIds.push(createNewInventory[0]._id);
      }
    } else if (inventoryType == "levelInventory") {
      let newInventoryId = "";
      for (const item of inventoryArray) {
        const level = item.level || "Unknown";
        const quantity = Number(item.quantity) || 0;
        totalInventoryCount += quantity;
        const title = "INV-";
        if (newInventoryId === "") {
          newInventoryId = await idGenerate(
            title,
            "newInventoryId",
            this.#inventoryRepository
          );
        } else {
          let id = Number(newInventoryId.slice(title.length + 6)) + 1;
          let prefix = newInventoryId.slice(0, title.length + 6);
          newInventoryId = prefix + id;
        }
        const newInventory = {
          level: level,
          barcode: item.barcode || generateEAN13Barcode(),
          quantity: quantity,
          availableQuantity: quantity,
          inventoryType: inventoryType,
          // quantity: inventoryTotal,
          inventoryID: newInventoryId,
        };
        const createNewInventory = await this.#inventoryRepository.create(
          newInventory,
          session
        );
        invenoryIds.push(createNewInventory[0]._id);
      }
    } else if (inventoryType == "colorLevelInventory") {
      // console.log('inventory color level', inventoryArray[0]?.colorLevel)
      let newInventoryID = "";
      for (const item of inventoryArray) {
        // console.log('inventory color level', item)
        const level = item.level || "Unknown";
        const variants = item.colorLevel;
        const itemQuantity = variants.reduce(
          (total, variant) => total + Number(variant.quantity),
          0
        );
        totalInventoryCount += itemQuantity;
        const title = "INV-";
        for (const item of variants) {
          if (newInventoryID === "") {
            newInventoryID = await idGenerate(
              title,
              "inventoryID",
              this.#inventoryRepository
            );
          } else {
            let id = Number(newInventoryID.slice(title.length + 6)) + 1;
            let prefix = newInventoryID.slice(0, title.length + 6);
            newInventoryID = prefix + id;
          }
          const newInventory = {
            quantity: item.quantity,
            availableQuantity: item.quantity,
            color: item.colorCode || "#000000",
            name: item.color || "Unknown",
            level: level,
            barcode: item.barcode || generateEAN13Barcode(),
            inventoryID: newInventoryID,
          };
          // console.log("newInventory", newInventory);
          // console.log("newInventory", newInventory?.variants)
          const createNewInventory = await this.#inventoryRepository.create(
            newInventory,
            session
          );
          invenoryIds.push(createNewInventory[0]._id);
        }
      }
    } else {
      payload.inventoryType = "inventory";
      const newInventoryID = await idGenerate(
        "INV-",
        "inventoryID",
        this.#inventoryRepository
      );
      const newInventory = {
        quantity: inventory,
        barcode: barcode || generateEAN13Barcode(),
        availableQuantity: inventory,
        inventoryType: inventoryType,
        inventoryID: newInventoryID,
      };
      const createNewInventory = await this.#inventoryRepository.create(
        newInventory,
        session
      );
      invenoryIds.push(createNewInventory[0]._id);
      totalInventoryCount = parseInt(inventory) || 0;
    }
    payload.mainInventory = totalInventoryCount;
    payload.inventoryRef = invenoryIds;

    if ((discountType, discount)) {
      const { price, discountAmount } = calculateDiscountAmount(
        mrpPrice,
        discountType,
        discount
      );
      payload.price = price;
      payload.discountAmount = discountAmount;
    } else {
      payload.price = mrpPrice;
    }
    if (!files?.length) {
      throw new Error("Thumbnail Image is required");
    }
    const hasThumbnailImage = files.some(
      (file) => file.fieldname === "thumbnailImage"
    );

    if (!hasThumbnailImage) {
      throw new Error("Thumbnail Image is required");
    }
    let images = await ImgUploader(files);

    // images.images = Object.keys(images)
    //   .filter((key) => key.startsWith("images["))
    //   .map((key) => images[key]),

    for (const key in images) {
      payload[key] = images[key];
    }

    payload.productId = await idGenerate("PRO-", "productId", this.#repository);

    const productData = await this.#repository.createProduct(payload, session);

    if (productData) {
      for (const invenoryId of invenoryIds) {
        const data = await this.#inventoryRepository.updateById(
          invenoryId,
          { productRef: productData[0]._id },
          session
        );
      }
    }
    return productData;
  }

  async getAllProduct(payload) {
    const { warehouseRef } = payload;
    let query = {};
    if (warehouseRef) {
      query.warehouseRef = warehouseRef;
    }

    return await this.#repository.findAll(query, [
      "brandRef",
      "categoryRef",
      "subCategoryRef",
      "inventoryRef",
    ]);
  }
  async getAllProductForHomePage(payload) {
    const { limit, viewType } = payload;
    if (!viewType) throw new NotFoundError("viewType is required");
    // find the viewType in the SubCategory collection
    const subCategory = await this.#subCategoryRepository.findOne({
      viewType: viewType,
    });
    if (!subCategory) throw new NotFoundError("SubCategory not found");
    payload.subCategoryRef = subCategory?._id;
    const product = await this.#repository.getAllProductForHomePage(payload);
    return { product, subCategory };
  }
  async getRelatedProduct(payload) {
    const product = await this.#repository.getRelatedProduct(payload);
    return product;
  }

  async getSearchProduct(payload) {
    const product = await this.#repository.getSearchProduct(payload);
    return product;
  }

  async getProductWithPagination(payload) {
    const product = await this.#repository.getProductWithPagination(payload);
    return product;
  }

  async getProductWithPaginationForAdmin(payload) {
    const product = await this.#repository.getProductWithPaginationForAdmin(
      payload
    );
    return product;
  }

  async getSingleProduct(slug) {

    const productData = await this.#repository.findBySlug(slug, [
      "brandRef",
      "categoryRef",
      "subCategoryRef",
      "childCategoryRef",
      "subChildCategoryRef",
      "inventoryRef",
    ]);
    if (!productData) throw new NotFoundError("Product Not Find");
    return productData;
  }

  // async updateProduct(id, payloadFiles, payload, session) {
  //   try {
  //     console.log("update service hit=============", payload);
  //     const { files } = payloadFiles;
  //     console.log(files, "files from update product service++++++++++++++");
  //     const {
  //       // name,
  //       // description,
  //       mrpPrice,
  //       discountType,
  //       discount,
  //       // videoUrl,
  //       // freeShipping,
  //       // brandRef,
  //       // categoryRef,
  //       // subCategoryRef,
  //       warehouseRef,
  //     } = payload;
  //     const existingProduct = await this.#repository.findById(id);
  //     if (!existingProduct) throw new Error("Product not found");

  //     if ((discountType, discount)) {
  //       const { price, discountAmount } = calculateDiscountAmount(
  //         mrpPrice,
  //         discountType,
  //         discount
  //       );
  //       payload.price = price;
  //       payload.discountAmount = discountAmount;
  //     } else {
  //       payload.price = mrpPrice;
  //     }

  //     if (files?.length) {
  //       let images = await ImgUploader(files);
  //       images.images = Object.keys(images)
  //         .filter((key) => key.startsWith("images["))
  //         .map((key) => images[key]);
  //       for (const key in images) {
  //         payload[key] = images[key];
  //       }
  //     }
  //     payload.productId = await idGenerate(
  //       "PRO-",
  //       "productId",
  //       this.#repository
  //     );
  //     payload.warehouseRef = warehouseRef;
  //     console.log(payload, "final payload to repo???????????????");
  //     const productData = await this.#repository.updateProduct(
  //       id,
  //       payload,
  //       session
  //     );
  //     if (files.length && productData) {
  //       console.log("Checking for image deletions...");

  //       // Compare old and new images to find differences
  //       const oldImages = existingProduct.images || [];
  //       const newImages = productData.images || [];

  //       const oldThumbnail = existingProduct.thumbnailImage;
  //       const newThumbnail = productData.thumbnailImage;

  //       const oldBackView = existingProduct.backViewImage;
  //       const newBackView = productData.backViewImage;

  //       // Find removed images
  //       const imagesToRemove = oldImages.filter(
  //         (img) => !newImages.includes(img)
  //       );

  //       if (oldThumbnail && oldThumbnail !== newThumbnail) {
  //         imagesToRemove.push(oldThumbnail);
  //       }
  //       if (oldBackView && oldBackView !== newBackView) {
  //         imagesToRemove.push(oldBackView);
  //       }

  //       // Remove only the images that were replaced
  //       if (imagesToRemove.length) {
  //         await removeUploadFile(imagesToRemove);
  //         console.log("Removed images:", imagesToRemove);
  //       }
  //     }
  //     return productData;
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  async updateProduct(id, payloadFiles, payload, session) {
    try {


      const { files } = payloadFiles;
      const {
        name,
        barcode,
        mrpPrice,
        discountType,
        discount,
        inventoryType,
        inventory,
        inventoryArray,
      } = payload;

      const existingProduct = await this.#repository.findById(id);
      if (!existingProduct) throw new Error("Product not found");

      let inventoryIds = [];
      let totalInventoryCount = 0;

      // Handle inventory logic
      if (inventoryType === "colorInventory") {
        let newInventoryId = "";
        for (const item of inventoryArray) {
          const quantity = parseInt(item.quantity) || 0;
          totalInventoryCount += quantity;

          const title = "INV-";
          if (!newInventoryId) {
            newInventoryId = await idGenerate(
              title,
              "inventoryID",
              this.#inventoryRepository
            );
          } else {
            let idNum = Number(newInventoryId.slice(title.length + 6)) + 1;
            let prefix = newInventoryId.slice(0, title.length + 6);
            newInventoryId = prefix + idNum;
          }

          const newInventory = {
            quantity,
            availableQuantity: quantity,
            inventoryType,
            color: item.colorCode || "#000000",
            name: item.color || "Unknown",
            barcode: item.barcode || generateEAN13Barcode(),
            inventoryID: newInventoryId,
          };

          const createdInventory = await this.#inventoryRepository.create(
            newInventory,
            session
          );
          inventoryIds.push(createdInventory[0]._id);
        }
      } else if (inventoryType === "levelInventory") {
        let newInventoryId = "";
        for (const item of inventoryArray) {
          const quantity = Number(item.quantity) || 0;
          totalInventoryCount += quantity;

          const title = "INV-";
          if (!newInventoryId) {
            newInventoryId = await idGenerate(
              title,
              "inventoryID",
              this.#inventoryRepository
            );
          } else {
            let idNum = Number(newInventoryId.slice(title.length + 6)) + 1;
            let prefix = newInventoryId.slice(0, title.length + 6);
            newInventoryId = prefix + idNum;
          }

          const newInventory = {
            level: item.level || "Unknown",
            barcode: item.barcode || generateEAN13Barcode(),
            quantity,
            availableQuantity: quantity,
            inventoryType,
            inventoryID: newInventoryId,
          };

          const createdInventory = await this.#inventoryRepository.create(
            newInventory,
            session
          );
          inventoryIds.push(createdInventory[0]._id);
        }
      } else if (inventoryType === "colorLevelInventory") {
        let newInventoryId = "";
        for (const item of inventoryArray) {
          const level = item.level || "Unknown";
          const variants = item.colorLevel;

          for (const variant of variants) {
            const quantity = Number(variant.quantity) || 0;
            totalInventoryCount += quantity;

            const title = "INV-";
            if (!newInventoryId) {
              newInventoryId = await idGenerate(
                title,
                "inventoryID",
                this.#inventoryRepository
              );
            } else {
              let idNum = Number(newInventoryId.slice(title.length + 6)) + 1;
              let prefix = newInventoryId.slice(0, title.length + 6);
              newInventoryId = prefix + idNum;
            }

            const newInventory = {
              level,
              quantity,
              availableQuantity: quantity,
              color: variant.colorCode || "#000000",
              name: variant.color || "Unknown",
              barcode: variant.barcode || generateEAN13Barcode(),
              inventoryType,
              inventoryID: newInventoryId,
            };

            const createdInventory = await this.#inventoryRepository.create(
              newInventory,
              session
            );
            inventoryIds.push(createdInventory[0]._id);
          }
        }
      } else {
        payload.inventoryType = "inventory";
        const newInventoryId = await idGenerate(
          "INV-",
          "inventoryID",
          this.#inventoryRepository
        );
        const newInventory = {
          quantity: inventory,
          barcode: barcode || generateEAN13Barcode(),
          availableQuantity: inventory,
          inventoryType,
          inventoryID: newInventoryId,
        };

        const createdInventory = await this.#inventoryRepository.create(
          newInventory,
          session
        );
        inventoryIds.push(createdInventory[0]._id);
        totalInventoryCount = inventory;
      }

      // Update price and discount
      if (discountType && discount) {
        const { price, discountAmount } = calculateDiscountAmount(
          mrpPrice,
          discountType,
          discount
        );
        payload.price = price;
        payload.discountAmount = discountAmount;
      } else {
        payload.price = mrpPrice;
      }

      // Set inventory refs
      payload.inventoryRef = inventoryIds;
      payload.mainInventory = totalInventoryCount;

      // Upload and update images
      if (files?.length) {
        const images = await ImgUploader(files);
        for (const key in images) {
          payload[key] = images[key];
        }
      }

      const productData = await this.#repository.updateProduct(
        id,
        payload,
        session
      );

      // Link inventory to product
      if (productData && inventoryIds.length) {
        const productId = productData._id || productData[0]?._id;
        if (!productId)
          throw new Error("Failed to get product ID from update result");

        for (const inventoryId of inventoryIds) {
          await this.#inventoryRepository.updateById(
            inventoryId,
            { productRef: productId },
            session
          );
        }
      }

      return productData;
    } catch (error) {
      console.error("Update Product Error:", error);
      throw error;
    }
  }

  async togglePriority(id) {


    const updatedProduct = await this.#repository.togglePriority(id);
    return updatedProduct;
  }


  async updateProductStatus(id, status) {
    if (!status) throw new NotFoundError("Status is required");
    status = status === "true";
    const product = await this.#repository.updateProductStatus(id, {
      status: status,
    });

    if (!product) throw new NotFoundError("Product not found");
    return product;
  }

  async deleteProduct(id, session) {

    const product = await this.#repository.findById(id);
    if (!product) throw new NotFoundError("Product not found");
    const deletedProduct = await this.#repository.deleteById(id, session);
    // inventoryRepository dete product?.inventoryRef
    if (product?.inventoryRef) {
      for (const inventoryRef of product.inventoryRef) {
        const data = await this.#inventoryRepository.deleteById(
          inventoryRef,
          session
        );
      }
    }
    if (deletedProduct) {
      if (deletedProduct?.thumbnailImage) {
        await removeUploadFile(product?.thumbnailImage);
      }
      if (deletedProduct?.backViewImage) {
        await removeUploadFile(product?.backViewImage);
      }
      if (Array.isArray(deletedProduct?.images)) {
        deletedProduct?.images.forEach(async (image) => {
          await removeUploadFile(image);
        });
      }
    }

    return deletedProduct;
  }

  async getCategoriesWithSubcategoriesAndCounts() {
    const categories =
      await this.#repository.getCategoriesWithSubcategoriesAndCounts();
    return categories;
  }
}

module.exports = new ProductService(
  productRepository,
  inventoryRepository,
  categoryRepository,
  subCategoryRepository,
  "product"
);
