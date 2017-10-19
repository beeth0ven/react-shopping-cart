/**
 * Created by Air on 2017/10/16.
 */

import Product from '../lib/product';
import Cart from '../lib/cart';
import Checkout from '../lib/checkout';
import ProductsHandler from '../handler/productshandler';

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
        Cart.options(callback);
        break;
      case 'POST /checkout':
        Checkout.post(callback);
        break;
      case 'OPTIONS /checkout':
        Checkout.options(callback);
        break;
      default:
        ProductsHandler.handleDefault(callback)
    }
  } catch (error) {
    ProductsHandler.handleError(error);
  }
};

