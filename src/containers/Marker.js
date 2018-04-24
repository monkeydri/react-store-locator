import React, { Component } from 'react';

export default class Marker extends Component {
  render() {
    return (
      <div
        style={{
          cursor: 'pointer',
          backgroundColor: 'purple',
          height: '100px',
          width: '20px'
        }}
        onClick={() => this.props.handleMarkerClick(this.props.id)}
      >
        <div
          style={
            this.props.show
              ? {
                  display: 'block',
                  height: '40px',
                  width: '100px',
                  backgroundColor: 'white',
                  color: 'blue'
                }
              : { display: 'none' }
          }
        >
          {this.props.name}
        </div>
      </div>
    );
  }
}
