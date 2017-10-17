/**
 * Created by Air on 2017/10/16.
 */

import FakeDB from '../repositories/fakedbservice';
const Util = require('./util');
const DB = FakeDB;

class Product {

  static get(callback) {
    DB.allProducts()
      .subscribe(
        products => callback(null, Util.successResponse(products)),
        error => callback(Util.internalErrorResponse(error))
      )
  }
}

export default Product;