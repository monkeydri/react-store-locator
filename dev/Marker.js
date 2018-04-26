import React, { Component } from 'react';

export default class Marker extends Component {
  render() {
    return (
      <div
        style={{
          cursor: 'pointer',
          backgroundColor: 'purple',
          height: '25px',
          width: '25px',
          border: '2px solid white'
        }}
        onClick={() => this.props.handleDealerClick(this.props.id)}
      >
        {this.props.children}
      </div>
    );
  }
}
