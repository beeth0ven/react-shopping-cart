import React, { Component } from 'react';

class CommentBox extends Component {

  constructor() {
    super();

    this.state = { input: '' }
  }

  handleChange = (event) => {
    this.setState({ input: event.target.value });
  };

  handleClick = () => {
    this.props.onComment(this.state.input, this.props.productId);
    this.setState({ input: '' });
  };

  render() {
    return (
      <div className='comment-box'>
        <input
          type="text" className="panel-body"
          onChange={this.handleChange} value={this.state.input}
          placeholder='Please, write your review of this product'
        />
        <button className='btn btn-primary' onClick={this.handleClick}>
          <i className='glyphicon glyphicon-share-alt'/> Send
        </button>
      </div>
    )
  }
}

export default CommentBox;