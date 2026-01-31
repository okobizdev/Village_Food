const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");
const bannerRepository = require("./banner.repository.js");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class BannerService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createBanner(payload, payloadFiles, session) {
    if (!payload.image) throw new Error("image is required");

    const bannerData = await this.#repository.createBanner(payload);
    return bannerData;
  }

  async getAllBanner(payload) {
    return await this.#repository.findAll({});
  }

  async getBannerWithPagination(payload) {
    const banner = await this.#repository.getBannerWithPagination(payload);
    return banner;
  }

  async getSingleBanner(id) {
    const bannerData = await this.#repository.findById(id);
    if (!bannerData) throw new NotFoundError("Banner Not Find");
    return bannerData;
  }

  async updateBanner(id, payload, payloadFiles, session) {
    const oldBanner = await this.#repository.findById(id);
    if (!oldBanner) throw new NotFoundError("Banner Not Find");

    const bannerData = await this.#repository.updateById(id, payload);

    // If new image is uploaded and there was an old image, delete old one from cloudinary
    if (payload.image && oldBanner.image && payload.image !== oldBanner.image && oldBanner.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(oldBanner.imagePublicId);
      } catch (error) {
        console.error("Failed to delete old image from cloudinary:", error);
      }
    }

    return bannerData;
  }

  async deleteBanner(id) {
    const banner = await this.#repository.findById(id);
    if (!banner) throw new NotFoundError("Banner not found");

    const deletedBanner = await this.#repository.deleteById(id);

    if (deletedBanner && banner?.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(banner.imagePublicId);
      } catch (error) {
        console.error("Failed to delete image from cloudinary:", error);
      }
    }

    return deletedBanner;
  }
}

module.exports = new BannerService(bannerRepository, "banner");
