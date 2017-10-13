/**
 * Created by Air on 2017/10/13.
 */

import lonelyBird from '../images/lonely-bird.jpg';
import solidFriendship from '../images/solid-friendship.jpg';

const comments = [{
  id: 1,
  username: "John Doe",
  age: "3 days ago",
  text: "I'm using this to decorate my desk. I liked it."
}, {
  id: 2,
  username: "Jane Smith",
  age: "7 days ago",
  text: "This product was very well made."
}];

const products = [{
  id: "lonely-bird",
  name: "Lonely Bird",
  image: lonelyBird,
  price: 29.99,
  isSelected: false,
  comments: comments
}, {
  id: "solid-friendship",
  name: "Solid Friendship",
  image: solidFriendship,
  price: 19.99,
  isSelected: false,
  comments: comments
}];

class Services {

  static getProducts(callback) {
    const res = {
      data: { products: products }
    };
    setTimeout(() => { callback(null, res) }, 500);
  }
}

export default Services;