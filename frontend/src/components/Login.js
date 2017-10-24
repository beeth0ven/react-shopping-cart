/**
 * Created by Air on 2017/10/14.
 */

import React, { Component } from 'react';
import {
  FormGroup,
  FormControl,
  ControlLabel,
} from 'react-bootstrap';

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };
  }

  handelChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handelSubmit = (event) => {
    event.preventDefault();
    this.props.onSignin(this.state.email, this.state.password, this.props.history);
  };

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  render() {
    return (
      <div>
        <h4>Login</h4>
        <div className="login">
          <form onSubmit={this.handelSubmit}>
            <FormGroup controlId="email">
              <ControlLabel>E-mail</ControlLabel>
              <FormControl autoFocus type="email" value={this.state.email} onChange={this.handelChange}/>
            </FormGroup>
            <FormGroup controlId="password">
              <ControlLabel>Password</ControlLabel>
              <FormControl type="password" value={this.state.password} onChange={this.handelChange}/>
            </FormGroup>
            <div className="text-center">
              <button type="submit" className="btn btn-primary" disabled={!this.validateForm()}>
                {
                  this.props.isLoadingSignin
                    ? 'Signing in...'
                    : 'Login'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;