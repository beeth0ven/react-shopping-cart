/**
 * Created by Air on 2017/10/13.
 */

import AWS from 'aws-sdk';
import axios from 'axios';
import config from './config';
import { Observable } from 'rx';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool
} from 'amazon-cognito-identity-js';

class Services {

  static getProducts(userToken) {
    let url = `${config.apiGateway.ADDRESS}/${config.apiGateway.STAGE}/${config.services.PRODUCTS}`;
    if (userToken) url += 'Auth';
    return this.axiosRequest('get', url, null, userToken);
  }

  static signup(email, password, callback) {
    const userPool = this.defaultCognitoUserPool();

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

  static login(email, password) {
    const userPool = this.defaultCognitoUserPool();

    const user = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    const authenticationData = {
      Username: email,
      Password: password
    };

    const authDetails = new AuthenticationDetails(authenticationData);

    return Observable.create(observer => user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        observer.onNext(result);
        observer.onCompleted();
      },
      onFailure: observer.onError.bind(observer)
      }))
      .map(result => result.getIdToken().getJwtToken());
  }

  static userToken() {
    const currentUser = this.currentUser();

    if (!currentUser) {
      return Observable.error(new Error('Current user is null'));
    }

    const rxGetSession = Observable.fromNodeCallback(currentUser.getSession.bind(currentUser));
    return rxGetSession()
      .map(result => result.getIdToken().getJwtToken());
  }

  static logout() {
    const currentUser = this.currentUser();

    if (currentUser !== null) currentUser.signOut();
    if (AWS.config.credentials) AWS.config.credentials.clearCachedId();
  };

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

  static defaultCognitoUserPool() {
    return new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });
  }

  static currentUser() {
    const userPool = this.defaultCognitoUserPool();
    return userPool.currentUser();
  }
}

export default Services;