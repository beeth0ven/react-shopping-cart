const handler = require('../functions/products').handler;

const event = {
  httpMethod: 'GET',
  resource: '/products'
};

handler(event, null, (error, response) => {
  error ? console.log(error) : console.log(response);
});