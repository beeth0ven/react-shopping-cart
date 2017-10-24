/**
 * Created by Air on 2017/10/14.
 */

import React, { Component } from 'react';
import {
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock
} from 'react-bootstrap';

class Signup extends  Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      confirmationCode: ''
      // newUser: null,
      // isLoadingSignup: false
    };

  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };


  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSignup(this.state.email, this.state.password);
  };

  handleConfirmationSubmit = (event) => {
    event.preventDefault();
    this.props.onConfirmSignup(this.state.confirmationCode, this.props.history);
  };

  validateForm() {
    return this.state.email.length > 0
      && this.state.password.length > 0
      && this.state.confirmPassword === this.state.password
  };

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

  render() {

    const signupForm =
      <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="email">
          <ControlLabel>E-mail</ControlLabel>
          <FormControl autoFocus type="email" value={this.state.email} onChange={this.handleChange}/>
        </FormGroup>
        <FormGroup controlId="password">
          <ControlLabel>Password</ControlLabel>
          <FormControl value={this.state.password} onChange={this.handleChange}/>
        </FormGroup>
        <FormGroup controlId="confirmPassword">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl value={this.state.confirmPassword} onChange={this.handleChange}/>
        </FormGroup>
        <div className="text-center">
          <button type="submit" className="btn btn-primary" disabled={!this.validateForm()}>
            {
              this.props.isLoadingSignup
                ? 'Signing up...'
                : 'Signup'
            }
          </button>
        </div>
      </form>;

    const confirmSignupForm =
      <form onSubmit={this.handleConfirmationSubmit}>
        <FormGroup controlId='confirmationCode'>
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl autoFocus type='text' value={this.state.confirmationCode} onChange={this.handleChange}/>
          <HelpBlock>Please check your e-mail for the code.</HelpBlock>
        </FormGroup>
        <div className='text-center'>
          <button type='submit' className='btn btn-primary' disabled={!this.validateConfirmationForm() || this.state.isLoadingSignup }>
            {
              this.props.isLoadingSignup
                ? 'Verifying'
                : 'Verify'
            }
          </button>
        </div>
      </form>;

    return (
      <div>
        <h4>Signup</h4>
        <div className="signup">
          {
            this.props.newUser === null
              ? signupForm
              : confirmSignupForm
          }
        </div>
      </div>
    );
  }
}

export default Signup;