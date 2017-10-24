
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

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
        console.log('Signup failed error:', error);
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
        console.log('Confirm signup failed error:', error);
        this.setState({ isLoadingSignup: false });
        alert(error)
      });
  };

  handleLogin = (email, password, history) => {
    console.log('handleLogin');
    this.setState({ isLoadingSignin: true });
    Services.login(email, password)
      .flatMap(token =>
        Services.getProducts(token)
          .map(result => ({
            state: 'didGetProducts',
            data: result.data
          }))
          .startWith({
            state: 'didLogin',
            data: token
          })
      )
      .subscribe(result => {
        switch (result.state) {
          case 'didLogin':
            console.log('Login success!', result);
            this.setState({
              isLoadingSignin: false,
              userToken: result.data
            });
            history.push('/');
            break;
          case 'didGetProducts':
            console.log('Get products success!', result);
            this.setState({
              products: result.data,
              ready: true
            });
            break;
          default:
            console.log('Login default should not happen', result);
            break;
        }
      }, error => {
        console.log('Login failed error:', error);
        this.setState({ isLoadingSignin: false });
        alert(error);
      })
  };

  render() {
    return (
      <Router>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Header/>
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