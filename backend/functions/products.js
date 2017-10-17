/**
 * Created by Air on 2017/10/16.
 */

import Product from '../lib/product'
import Cart from '../lib/cart'
import Checkout from '../lib/checkout'
const Util = require('../lib/util');

module.exports.handler = (event, context, callback) => {

  try {
    switch (`${event.httpMethod} ${event.resource}`) {
      case 'GET /products':
        Product.get(callback);
        break;
      case 'PUT /cart':
        Cart.put(event, callback);
        break;
      case 'OPTIONS /cart':
        callback(null, Util.optionsResponse());
        break;
      case 'POST /checkout':
        Checkout.post(callback);
        break;
      case 'OPTIONS /checkout':
        callback(null, Util.optionsResponse());
        break;
      default:
        callback(Util.notFoundResponse());
    }
  } catch (error) {
    callback(Util.internalErrorResponse(error));
  }
};