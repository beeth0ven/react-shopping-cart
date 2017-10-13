
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

// import Header
import Product from './Product';
import ProductList from './ProductList';
import ShoppingCart from './ShoppingCart';
import NoMatch from './NoMatch';
import Error from './Error';

import Services from '../lib/services';
import Header from "./Header";

class App extends Component {

  constructor(){
    super();
    this.state = {
      products: [],
      ready: false
    };

    this.handelSelect = this.handelSelect.bind(this);
    this.handleDeselect = this.handleDeselect.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCheckout = this.handleCheckout.bind(this);
  }

  handelSelect(product) {
    const products = this.state.products.slice();
    const index = products.map(i => i.id).indexOf(product.id);
    products[index].isSelected = product.isSelected;
    this.setState({products: products});
  }

  handleDeselect(product) {
    this.handelSelect(product)
  }

  handleSave() {
    console.log('App handleSave');
  }

  handleCheckout() {
    console.log('App handleCheckout');
  }

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
                          selectedProducts={this.state.products.find(p => p.isSelected)}
                          onDeselect={this.handleDeselect}
                          onSave={this.handleSave}
                          onCheckout={this.handleCheckout}
                        />
                      }/>
                      {/* Login Signup Stuff*/}

                      <Route path="/error" cpmponent={Error}/>
                      <Route components={NoMatch}/>
                    </Switch>
                  :
                    <div>
                      <span className="glyphicon glyphicon-refresh spin"></span>
                    </div>
              }
            </div>
          </div>
        </div>
      </Router>
    );
  }

  componentDidMount() {
    Services.getProducts((err, res) => {
      if (err)
        console.error(err);
      else
        this.setState({
          products: res.data.products,
          ready: true
        });
    });
  }
}

export default App;