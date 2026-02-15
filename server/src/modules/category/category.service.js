const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");

const categoryRepository = require("./category.repository.js");

class CategoryService extends BaseService {
  #repository;

  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createCategory(payload, session) {
    const categoryData = await this.#repository.createCategory(
      payload,
      session
    );
    return categoryData;
  }

  async getAllCategory() {
    return await this.#repository.getAllCategory();
  }

  async getCategoryWithPagination(payload) {
    const category = await this.#repository.getCategoryWithPagination(payload);
    return category;
  }

  async getSingleCategory(id) {
    const categoryData = await this.#repository.getCategoryById(id);
    if (!categoryData) throw new NotFoundError("Category Not Find");
    return categoryData;
  }

  async getSingleCategoryWithSlug(slug) {
    const categoryData = await this.#repository.getCategoryBySlug(slug);
    if (!categoryData) throw new NotFoundError("Category Not Find");
    return categoryData;
  }


  async updateCategory(id, payload) {
    const {
      name,
      slug,
      status,
      image,
      imagePublicId,
    } = payload;


    // Build update payload
    const updatePayload = {
      name,
      slug,
      status,
    };

    // Only add image fields if they're provided
    if (image) updatePayload.image = image;
    if (imagePublicId) updatePayload.imagePublicId = imagePublicId;


    // Get old category data for file cleanup
    const oldCategory = await this.#repository.findById(id);
    if (!oldCategory) {
      throw new NotFoundError("Category not found");
    }

    // Update the database with the new data
    const categoryData = await this.#repository.updateCategory(id, updatePayload);

    return categoryData;
  }

  async updateCategoryStatus(id, status) {
    if (status === undefined) throw new Error("Status is required");

    const updatedStatus = status === true || status === "true";

    const category = await this.#repository.updateCategoryStatus(id, {
      status: updatedStatus,
    });

    if (!category) throw new NotFoundError("Category not found");

    return category;
  }


  async deleteCategory(id) {
    const category = await this.#repository.findById(id);
    if (!category) throw new NotFoundError("Category not found");
    const deletedCategory = await this.#repository.deleteById(id);
    return deletedCategory;
  }

  async getNavBar() {
    const navbarData = await this.#repository.getNavBar();
    if (!navbarData) throw new NotFoundError("Navbar Not Find");
    return navbarData;
  }

}

module.exports = new CategoryService(categoryRepository, "category");
