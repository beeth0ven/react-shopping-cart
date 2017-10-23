const AWS = require('aws-sdk');
AWS.config.update({region:'ap-northeast-2'});
const handler = require('../functions/products').handler;

const event = {
  httpMethod: 'GET',
  resource: '/products'
};

handler(event, null, (error, response) => {
  error ? console.error(error) : console.log(response);
});