/**
 * Created by Air on 2017/10/16.
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*'
};

class Util {

  static successResponse(obj) {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(obj)
    }
  };


  static internalErrorResponse(error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: error.toString()
      })
    }
  };

  static notFoundResponse() {
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Not Found'
      })
    }
  };

  static optionsResponse() {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, PATCH, DELETE, OPTIONS"
      }
    }
  };
}

export default Util;
