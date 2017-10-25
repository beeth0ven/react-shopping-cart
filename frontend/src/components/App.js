
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import { Observable } from 'rx'

import Product from './Product';
import ProductList from './ProductList';
import ShoppingCart from './ShoppingCart';
import Signup from "./Signup";
import Login from "./Login";
import NoMatch from './NoMatch';
import Error from './Error';

import Services from '../lib/services';
import Header from "./Header";

class App extends Component {

  constructor(){
    super();

    this.state = {
      products: [],
      ready: false,
      isLoadingSignup: false,
      isLoadingSignin: false,
      newUser: null,
      userToken: null
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
    console.log('handleSignup');
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
    console.log('handleConfirmSignup');
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
    console.log('handleLogin');
    Services.login(email, password)
      .flatMap(token =>
        Services.getProducts(token)
          .map(result => ({ state: 'onGetProducts', data: result.data }))
          .startWith({ state: 'onLogin', data: token })
      )
      .startWith({ state: 'onStartLogin' })
      .catch(error => Observable.just({ state: 'onLoginError', data: error }))
      .subscribe(result => { this.onLoginResult(result, history) })
  };

  handleLogout = () => {
    console.log('handleLogout');
    Services.logout();
    this.setState({ userToken: null });
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
    console.log('On Start Login');
    this.setState({ isLoadingSignin: true });
  };

  onLogin = (userToken, history) => {
    console.log('On Login');
    this.setState({
      isLoadingSignin: false,
      userToken: userToken
    });
    history.push('/');
  };

  onGetProducts = (products) => {
    console.log('On Get Products');
    this.setState({
      products: products,
      ready: true
    });
  };

  onLoginError = (error) => {
    console.error('On Login Error:', error);
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

    Services.getProducts()
      .subscribe(res => this.setState({
          products: res.data,
          ready: true
        }),
        error => console.error(error)
      );
  }
}

export default App;