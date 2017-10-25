/**
 * Created by Air on 2017/10/13.
 */

export default {
  "apiGateway": {
    "ADDRESS": "https://edhccdm5t1.execute-api.ap-northeast-2.amazonaws.com",
    "STAGE": "dev"
  },
  "services": {
    "PRODUCTS": "products",
    "CART": "cart",
    "CHECKOUT": "checkout"
  },
  "cognito": {
    "USER_POOL_ID": "ap-northeast-2_cu1JdcyH6",
    "APP_CLIENT_ID": "3kfmgh8fbjg1n1n5oul34v8m4e",
    "IDENTITY_POOL_ID": "ap-northeast-2:7747e801-2c6c-4934-8441-c93d98914bf3",
    "REGION": "ap-northeast-2"
  },
  "iot": {
    "ENDPOINT": "a31rj89y7cz6hq.iot.ap-northeast-2.amazonaws.com",
    "REGION": "ap-northeast-2",
    "topics": {
      "COMMENTS": "serverless-store-comments"
    },
    "POLICY_NAME": "iot-policy"
  }
}