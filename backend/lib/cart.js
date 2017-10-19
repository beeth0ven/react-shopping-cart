/**
 * Created by Air on 2017/10/16.
 */

const FakeDB = require('../repositories/fakedbservice');
// import FakeDB from '../repositories/fakedbservice';
const Util = require('./util');
const DB = FakeDB;

class Cart {

  static put(event, callback) {
    const id = JSON.parse(event.body).id;

  }

  static options(callback) {
    callback(null, Util.optionsResponse());
  }
}

module.exports = Cart;
// export default Cart;