/**
 * Created by Air on 2017/10/16.
 */

const AWS = require('aws-sdk');
const dynamodb = AWS.DynamoDB();
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.retrieveAllProducts = (callback) => {

  const params = { TableName: 'Product' };

  documentClient.scan(params, (err, date) => {
    if (err) callback(err);
    else if (date.Items) {

    }
    else callback(null, []);
  })
};
