
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import { Observable } from 'rx'
import uuid from 'uuid/v4';

import Header from "./Header";
import Product from './Product';
import ProductList from './ProductList';
import ShoppingCart from './ShoppingCart';
import Signup from "./Signup";
import Login from "./Login";
import NoMatch from './NoMatch';
import Error from './Error';

import Services from '../lib/services';
import config from '../lib/config';

class App extends Component {

  constructor(){
    super();

    this.state = {
      products: [],
      ready: false,
      isLoadingSignup: false,
      isLoadingSignin: false,
      newUser: null,
      userToken: null,
      iotClient: null,
      hasNotification: false
    };

  }

  handelSelect = (product) => {
    const products = this.state.products.slice();
    const index = products.map(i => i.id).indexOf(product.id);
    products[index].isSelected = product.isSelected;
    this.setState({products: products});
  };

  handleDeselect = (product) => {
    this.handelSelect(product)
  };

  handleSave = () => {
    console.log('App handleSave');
  };

  handleCheckout = () => {
    console.log('App handleCheckout');
  };

  handleSignup = (email, password) => {
    console.log('App handleSignup');
    this.setState({ isLoadingSignup: true });
    Services.signup(email, password)
      .subscribe(res => {
        console.log('Signup success!');
        this.setState({
          isLoadingSignup: false ,
          newUser: res.user
        });
      }, error => {
        console.error('Signup failed error:', error);
        this.setState({ isLoadingSignup: false });
        alert(error)
      });
  };

  handleConfirmSignup = (confirmationCode, history) => {
    console.log('App handleConfirmSignup');
    this.setState({ isLoadingSignup: true });
    Services.confirmSignup(this.state.newUser, confirmationCode)
      .subscribe(() => {
        console.log('Confirm signup success!');
        this.setState({ isLoadingSignup: false });
        history.push('/');
      }, error => {
        console.error('Confirm signup failed error:', error);
        this.setState({ isLoadingSignup: false });
        alert(error)
      });
  };

  handleLogin = (email, password, history) => {
    console.log('App handleLogin');
    Services.login(email, password)
      .flatMap(token =>
        Services.products(token)
          .map(result => ({ state: 'onGetProducts', data: result.data }))
          .startWith({ state: 'onLogin', data: token })
      )
      .startWith({ state: 'onStartLogin' })
      .catch(error => Observable.just({ state: 'onLoginError', data: error }))
      .subscribe(result => { this.onLoginResult(result, history) })
  };

  handleLogout = () => {
    console.log('App handleLogout');
    Services.logout();
    this.setState({ userToken: null });
  };

  handleComments = (comment, productId) => {
    console.log('App handleComments');
    const newComment = {
      id: uuid(),
      username: 'Luo Jie',
      age: 'a fow seconds',
      text: comment
    };

    Services.publishNewComment(this.state.iotClient, newComment, productId);
  };

  handleIotMessages = (messageObject) => {
    console.log('App handleIotMessages');
    if (messageObject.topic === config.iot.topics.COMMENTS) {
      const msg = JSON.parse(messageObject.message.toString());
      const product = this.state.products.find(product => product.id === msg.productId);
      product.comments.unshift(msg.comment);

      this.setState({ products: this.state.products });
    } else {
      this.setState({ hasNotification: true });
    }
  };

  handleReadNotification = () => {
    console.log('App handleReadNotification');
    this.setState({ hasNotification: false });
  };

  onLoginResult = (result, history) => {
    switch (result.state) {
      case 'onStartLogin':
        this.onStartLogin();
        break;
      case 'onLogin':
        this.onLogin(result.data, history);
        break;
      case 'onGetProducts':
        this.onGetProducts(result.data);
        break;
      case 'onLoginError':
        this.onLoginError(result.data);
        break;
      default:
        console.log('Login fatal error', result);
        break;
    }
  };

  onStartLogin = () => {
    console.log('App On Start Login');
    this.setState({ isLoadingSignin: true });
  };

  onLogin = (userToken, history) => {
    console.log('App On Login');
    this.setState({
      isLoadingSignin: false,
      userToken: userToken
    });
    history.push('/');
  };

  onGetProducts = (products) => {
    console.log('App On Get Products');
    this.setState({
      products: products,
      ready: true
    });
  };

  onLoginError = (error) => {
    console.error('App On Login Error:', error);
    this.setState({ isLoadingSignin: false });
    alert(error);
  };

  render() {
    return (
      <Router>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Header
                isLogin ={!!this.state.userToken}
                onLogout={this.handleLogout}
                hasNotification={this.state.hasNotification}
                onReadNotification={this.handleReadNotification}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              {
                this.state.ready
                  ?
                    <Switch>
                      <Route path="/" exact render={() =>
                        <ProductList
                          products={this.state.products}
                          onSelect={this.handelSelect}
                        />
                      }/>
                      <Route path="/product/:id" render={(props) =>
                        <Product
                          product={this.state.products.find(x => x.id === props.match.params.id)}
                          onSelect={this.handelSelect}
                          onComment={this.handleComments}
                        />
                      }/>
                      <Route path="/shopping-cart" render={() =>
                        <ShoppingCart
                          selectedProducts={this.state.products.filter(p => p.isSelected)}
                          onDeselect={this.handleDeselect}
                          onSave={this.handleSave}
                          onCheckout={this.handleCheckout}
                        />
                      }/>
                      <Route path="/signup" render={(props) =>
                        <Signup
                          {...props}
                          isLoadingSignup={this.state.isLoadingSignup}
                          newUser={this.state.newUser}
                          onSignup={this.handleSignup}
                          onConfirmSignup={this.handleConfirmSignup}
                        />
                      }/>
                      <Route path="/login" render={(props) =>
                        <Login
                          {...props}
                          isLoadingSignin={this.state.isLoadingSignin}
                          onSignin={this.handleLogin}
                        />
                      }/>
                      <Route path="/error" component={Error}/>
                      <Route component={NoMatch}/>
                    </Switch>
                  :
                    <div>
                      <span className="glyphicon glyphicon-refresh spin"/>
                    </div>
              }
            </div>
          </div>
        </div>
      </Router>
    );
  }

  componentDidMount() {

    const rxUserToken = Services.userToken()
      .shareReplay(1);

    const rxIotClient = rxUserToken
      .flatMap((userToken) => Services.iotClient(userToken))
      .shareReplay(1);

    const rxIotClientMessage = rxIotClient
      .flatMap((client) => client.messageSubject)
      .shareReplay(1);

    const rxProducts = rxUserToken
      .flatMap((userToken) => Services.products(userToken))
      .shareReplay(1);

    rxUserToken.subscribe(
      (userToken) => {
        console.log('On Get UserToken');
        this.setState({ userToken: userToken })
      },
      (error) => {
        console.log('On Get UserToken Error', error);
        alert(error)
      }
    );

    rxIotClient.subscribe(
      (iotClient) => {
        console.log('On Get IotClient');
        this.setState({ iotClient: iotClient })
      },
      (error) => {
        console.log('On Get IotClient Error', error);
        alert(error)
      }
    );

    rxIotClientMessage.subscribe(
      (messageObject) => {
        console.log('On Get ClientMessage');
        this.handleIotMessages(messageObject);
      } ,
      (error) => {
        console.log('On Get ClientMessage Error', error);
        alert(error)
      }
    );

    rxProducts.subscribe(
      (result) =>  {
        console.log('On Get Products');
        this.setState({ products: result.data, ready: true });
      },
      (error) => {
        console.log('On Get Products Error', error);
        this.setState({ ready: true });
        alert(error);
      }
    )
  }
}

export default App;