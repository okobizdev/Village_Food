const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");

const subCategoryRepository = require("./sub.category.repository.js");

class SubCategoryService extends BaseService {
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.repository = repository;
  }

  async createSubCategory(payload, session) {
    const subCategoryData = await this.repository.createSubCategory(
      payload,
      session
    );
    return subCategoryData;
  }

  async getAllSubCategory() {
    return await this.repository.findAll({}, ["categoryRef"]);
  }

  async getSubCategoryWithPagination(payload) {
    const subCategory = await this.repository.getSubCategoryWithPagination(
      payload
    );
    return subCategory;
  }

  async getSingleSubCategory(id) {
    const subCategoryData = await this.repository.findById(id, [
      "categoryRef",
    ]);
    if (!subCategoryData) throw new NotFoundError("SubCategory Not Find");
    return subCategoryData;
  }

  async getSingleSubCategoryWithSlug(slug) {
    const subCategoryData = await this.repository.findOne({ slug: slug }, [
      "categoryRef",
    ]);
    if (!subCategoryData) throw new NotFoundError("SubCategory Not Find");
    return subCategoryData;
  }

  async updateSubCategory(id, payload, session) {

    // Update the database with the new data
    const subCategoryData = await this.repository.updateSubCategory(
      id,
      payload,
      session
    );

    return subCategoryData;
  }



  async deleteSubCategory(id) {
    const subCategory = await this.repository.findById(id);
    if (!subCategory) throw new NotFoundError("SubCategory not found");
    const deletedSubCategory = await this.repository.deleteById(id);

    return deletedSubCategory;
  }
}

module.exports = new SubCategoryService(subCategoryRepository, "subCategory");
