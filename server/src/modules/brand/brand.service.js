const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");
const brandRepository = require("./brand.repository.js");


class BrandService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createBrand(payload, session) {
    const brandData = await this.#repository.createBrand(payload, session);
    return brandData;
  }

  async getAllBrand() {
    return await this.#repository.findAll();
  }

  async getBrandWithPagination(payload) {
    const brand = await this.#repository.getBrandWithPagination(payload);
    return brand;
  }

  async getSingleBrand(id) {
    const brandData = await this.#repository.findById(id);
    if (!brandData) throw new NotFoundError("Brand Not Find");
    return brandData;
  }

  async updateBrand(id, payload) {
    // Update the database with the new data
    const brandData = await this.#repository.updateBrand(id, payload);

    return brandData;
  }

  async updateBrandStatus(id, status) {
    if (!status) throw new NotFoundError("Status is required");
    status = status === "true";
    const brand = await this.#repository.updateBrandStatus(id, {
      status: status,
    });

    if (!brand) throw new NotFoundError("Brand not found");
    return brand;
  }

  async deleteBrand(id) {
    const brand = await this.#repository.findById(id);
    if (!brand) throw new NotFoundError("Brand not found");
    const deletedBrand = await this.#repository.deleteById(id);
    return deletedBrand;
  }
}

module.exports = new BrandService(brandRepository, "brand");
