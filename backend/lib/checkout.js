/**
 * Created by Air on 2017/10/16.
 */

const FakeDB = require('../repositories/fakedbservice');
// import FakeDB from '../repositories/fakedbservice';
const Util = require('./util');
const DB = FakeDB;

class Checkout {

  static post(callback) {

  }

  static options(callback) {
    callback(null, Util.optionsResponse());
  }
}

module.exports = Checkout;
// export default Checkout;