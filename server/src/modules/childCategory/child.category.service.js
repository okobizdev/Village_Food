const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");

const childCategoryRepository = require("./child.category.repository.js");
const {
  removeUploadFile,
} = require("../../middleware/upload/removeUploadFile.js");
const ImgUploader = require("../../middleware/upload/ImgUploder.js");

class ChildCategoryService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createChildCategory(payload, session) {

    const childCategoryData = await this.#repository.createChildCategory(
      payload,
      session
    );
    return childCategoryData;
  }

  async getAllChildCategory(payload) {
    return await this.#repository.getAllChildCategory(payload);
  }

  async getChildCategoryWithPagination(payload) {
    const childCategory = await this.#repository.getChildCategoryWithPagination(
      payload
    );
    return childCategory;
  }

  async getSingleChildCategory(id) {
    const childCategoryData = await this.#repository.findById(id, [
      "subCategoryRef",
    ]);
    if (!childCategoryData) throw new NotFoundError("ChildCategory Not Find");
    return childCategoryData;
  }

  async getSingleChildCategoryWithSlug(slug) {
    const childCategoryData = await this.#repository.findOne({ slug: slug }, [
      "subCategoryRef",
    ]);
    if (!childCategoryData) throw new NotFoundError("ChildCategory Not Find");
    return childCategoryData;
  }

  async updateChildCategory(id, payload, session) {
    // Update the database with the new data
    const childCategoryData = await this.#repository.updateChildCategory(
      id,
      payload,
      session
    );

    return childCategoryData;
  }


  async deleteChildCategory(id) {
    const childCategory = await this.#repository.findById(id);
    if (!childCategory) throw new NotFoundError("ChildCategory not found");
    const deletedChildCategory = await this.#repository.deleteById(id);
    return deletedChildCategory;
  }
}

module.exports = new ChildCategoryService(
  childCategoryRepository,
  "childCategory"
);
