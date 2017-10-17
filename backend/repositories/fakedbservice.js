/**
 * Created by Air on 2017/10/16.
 */

const Rx = require('rx');

class FakeDBService {

  static allProducts() {

    const comments = [{
      id: 1,
      username: "John Doe",
      age: "3 days age",
      text: "I'm using this to decorate my desk. I liked it."
    }, {
      id: 2,
      username: "Jane Smith",
      age: "7 days age",
      text: "This products was very well made."
    }];

    const products = [{
      id: "lonely-bird",
      name: "Lonely Bird",
      image: 'https://s3.amazonaws.com/serverless-store-media/product-images/lonely-bird.jpg',
      price: 29.99,
      isSelected: false,
      comments: comments
    }, {
      id: "solid-friendship",
      name: "Solid Friendship",
      image: 'https://s3.amazonaws.com/serverless-store-media/product-images/solid-friendship.jpg',
      price: 19.99,
      isSelected: false,
      comments: comments
    }];

    return Rx.Observable.just(products);
  }
}

export default FakeDBService;