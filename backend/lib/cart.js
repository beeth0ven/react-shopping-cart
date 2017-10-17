/**
 * Created by Air on 2017/10/16.
 */

import FakeDB from '../repositories/fakedbservice';
const Util = require('./util');
const DB = FakeDB;

class Cart {

  static put(event, callback) {
    const id = JSON.parse(event.body).id;

  }
}

export default Cart;