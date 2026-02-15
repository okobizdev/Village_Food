const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");
const userRepository = require("./user.repository.js");
const { idGenerate } = require("../../utils/IdGenerator.js");

class UserService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createUser(payload) {
    payload.userId = await idGenerate("USE-", "userId", this.#repository);
    const userData = await this.#repository.createUser(payload);
    return userData;
  }

  async getAllUser() {
    return await this.#repository.findAll({ status: true });
  }

  async getUserWithPagination(payload) {
    const user = await this.#repository.getUserWithPagination(payload);
    return user;
  }

  async getSingleUser(id) {
    const userData = await this.#repository.findById(id);
    if (!userData) throw new NotFoundError("User Not Find");
    return userData;
  }

  async updateUser(id, payload) {

    const { warehouseRef } = payload;

    if (!warehouseRef || warehouseRef === "undefined") {
      delete payload.warehouseRef;
    }

    const userData = await this.#repository.updateById(id, payload);
    if (!userData) throw new NotFoundError("User Not Find");

    return userData;
  }

  async deleteUser(id) {
    const user = await this.#repository.findById(id);
    if (!user) throw new NotFoundError("User not found");
    const deletedUser = await this.#repository.deleteById(id);

    return deletedUser;
  }
}

module.exports = new UserService(userRepository, "user");
