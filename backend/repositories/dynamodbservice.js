/**
 * Created by Air on 2017/10/16.
 */

const AWS = require('aws-sdk');
AWS.config.update({region:'ap-northeast-2'});
const DocumentClient = new AWS.DynamoDB.DocumentClient();
const Rx = require('rx');

class DynamoDBService {

  static allProducts() {

    return Rx.Observable.create(observer => {
      const params = { TableName: 'Product' };
      DocumentClient.scan(params, (error, data) => {
        error ? observer.onError(error) : observer.onNext(data.Items || []);
      });
    })
  }
}

module.exports = DynamoDBService;
// export default DynamoDBService;
