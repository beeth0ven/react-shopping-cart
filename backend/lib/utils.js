/**
 * Created by Air on 2017/10/16.
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*'
};

module.exports.successHandler = (obj, callback) => {
  callback(null, {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(obj)
  })
};

module.exports.errorHandler = (err, callback) => {
  callback({
    statusCode: 500,
    headers: corsHeaders,
    body: JSON.stringify({
      message: 'Internal Server Error',
      error: err.toString()
    })
  });
};

module.exports.notFoundHandler = (callback) => {
  callback({
    statusCode: 404,
    headers: corsHeaders,
    body: JSON.stringify({
      message: 'Not Found'
    })
  });
};

module.exports.optionsHandler = (callback) => {
  callback(null, {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods":
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    }
  })
};