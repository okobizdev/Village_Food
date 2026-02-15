

class BaseService {
  #repository;
  constructor(repository, serviceName) {
    this.#repository = repository;
    this.serviceName = serviceName;
  }
}

module.exports = BaseService;
