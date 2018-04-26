import React, { Component } from 'react';

export default class Pin extends Component {
  render() {
    const styles = {
      mapMarker: {
        color: '#000',
        backgroundColor: '#A00000',
        height: '25px',
        width: '25px',
        borderRadius: '50%',
        border: '1.5px solid white',
        cursor: 'pointer'
      }
    };
    return (
      <div
        style={styles.mapMarker}
        onClick={() => this.props.handleDealerClick(this.props.id)}
      >
        {this.props.children}
      </div>
    );
  }
}
