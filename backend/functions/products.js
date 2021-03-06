/**
 * Created by Air on 2017/10/16.
 */

const Product = require('../lib/product');
const Cart = require('../lib/cart');
const Checkout = require('../lib/checkout');
const ProductsHandler = require('../handler/productshandler');

// import Product from '../lib/product';
// import Cart from '../lib/cart';
// import Checkout from '../lib/checkout';
// import ProductsHandler from '../handler/productshandler';

module.exports.handler = (event, context, callback) => {

  let userId = null;
  if (event.requestContext.authorizer) userId = event.requestContext.authorizer.claims.sub;

  try {
    switch (`${event.httpMethod} ${event.resource}`) {
      case 'GET /products':
        Product.get(null, callback);
        break;
      case 'GET /productsAuth':
        Product.get(userId, callback);
        break;
      case 'OPTIONS /productsAuth':
        Product.options(callback);
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
    ProductsHandler.handleError(error, callback);
  }
};

