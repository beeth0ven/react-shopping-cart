/**
 * Created by Air on 2017/10/16.
 */

const db = require('../repositories/fakedb');

module.exports.retrieveAll = (callback) => {
  db.retrieveAllProducts(callback);
};