const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");
const paymentServiceConfigRepository = require("./payment.service.config.repository.js");

class PaymentServiceConfigService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createPaymentServiceConfig(payload, session) {
    const paymentServiceConfigData =
      await this.#repository.createPaymentServiceConfig(payload, session);
    return paymentServiceConfigData;
  }

  async getAllPaymentServiceConfig() {
    return await this.#repository.findAll();
  }

  async getPaymentServiceConfigWithPagination(payload) {
    const paymentServiceConfig =
      await this.#repository.getPaymentServiceConfigWithPagination(payload);
    return paymentServiceConfig;
  }

  async getSinglePaymentServiceConfig(id) {
    const paymentServiceConfigData = await this.#repository.findById(id);
    if (!paymentServiceConfigData)
      throw new NotFoundError("PaymentServiceConfig Not Find");
    return paymentServiceConfigData;
  }

  async updatePaymentServiceConfig(id, payload) {

    // Update the database with the new data
    const paymentServiceConfigData =
      await this.#repository.updatePaymentServiceConfig(id, payload);

    return paymentServiceConfigData;
  }

  async updatePaymentServiceConfigStatus(id, status) {
    if (!status) throw new NotFoundError("Status is required");
    status = status === "true";
    const paymentServiceConfig =
      await this.#repository.updatePaymentServiceConfigStatus(id, {
        status: status,
      });

    if (!paymentServiceConfig)
      throw new NotFoundError("PaymentServiceConfig not found");
    return paymentServiceConfig;
  }

  async deletePaymentServiceConfig(id) {
    const paymentServiceConfig = await this.#repository.findById(id);
    if (!paymentServiceConfig)
      throw new NotFoundError("PaymentServiceConfig not found");
    const deletedPaymentServiceConfig = await this.#repository.deleteById(id);

    if (deletedPaymentServiceConfig) {
      await removeUploadFile(paymentServiceConfig?.image);
    }
    return deletedPaymentServiceConfig;
  }
}

module.exports = new PaymentServiceConfigService(
  paymentServiceConfigRepository,
  "paymentServiceConfig"
);
