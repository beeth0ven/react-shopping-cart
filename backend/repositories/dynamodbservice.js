/**
 * Created by Air on 2017/10/16.
 */

const AWS = require('aws-sdk');
const DocumentClient = new AWS.DynamoDB.DocumentClient();
const Rx = require('rx');

class DynamoDBService {

  static allProducts() {

    return Rx.Observable.create(observer => {

      const params = { TableName: 'Product' };

      const request = DocumentClient.scan(params, (error, date) => {
        if (error) observer.onError(error);
        else if (date.Items) {

        }
        else observer.onNext([]);
      });
      return request.abort.bind(request);
    })
  }
}

export default DynamoDBService;
