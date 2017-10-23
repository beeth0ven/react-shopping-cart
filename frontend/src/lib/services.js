/**
 * Created by Air on 2017/10/13.
 */

import axios from 'axios';
import config from './config';
import { Observable } from 'rx';
import {
  // AuthenticationDetails,
  // CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool
} from 'amazon-cognito-identity-js';

class Services {

  static getProducts(userToken) {
    let url = `${config.apiGateway.ADDRESS}/${config.apiGateway.STAGE}/${config.services.PRODUCTS}`;
    if (userToken) url += 'Auth';
    return this.axiosRequest('get', url, null);
  }

  static signup(email, password, callback) {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });

    const attributeEmail = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email
      })
    ];

    // Observable.fromNodeCallback:
    // https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/fromnodecallback.md
    const rxSignup = Observable.fromNodeCallback(userPool.signUp.bind(userPool));
    return rxSignup(email, password, attributeEmail, null);
  }

  static confirmSignup(newUser, confirmationCode) {
    const rxConfirmSignup = Observable.fromNodeCallback(newUser.confirmRegistration.bind(newUser));
    return rxConfirmSignup(confirmationCode, true);
  }

  static axiosRequest(method, url, data, userToken) {
    const config = {
      method: method,
      url: url
    };

    if (data || userToken) {
      config.headers = {};

      if (data) {
        config.data = data;
        config.headers["Content-Type"] = "application/json";
      }

      if (userToken) {
        config.headers["Authorization"] = userToken;
      }
    }

    return Observable.fromPromise(axios(config));
  };

}

export default Services;