/**
 * Created by Air on 2017/10/16.
 */

const FakeDB = require('../repositories/fakedbservice');
// import FakeDB from '../repositories/fakedbservice';
const DynamoDBService = require('../repositories/dynamodbservice');
const Util = require('./util');
const DB = DynamoDBService;

class Product {

  static get(userId, callback) {
    console.log('Product get userId:', userId);
    DB.allProducts()
      .subscribe(
        products => callback(null, Util.successResponse(products)),
        error => callback(Util.internalErrorResponse(error))
      )
  }

  static options(callback) {
    callback(null, Util.optionsResponse());
  }
}

module.exports = Product;
// export default Product;