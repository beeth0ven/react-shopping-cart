const Util = require('../lib/util');

class ProductsHandler {

  static handleDefault(callback) {
    callback(Util.notFoundResponse());
  }

  static handleError(error, callback) {
    callback(Util.internalErrorResponse(error));
  }
}

module.exports = ProductsHandler;
// export default ProductsHandler;