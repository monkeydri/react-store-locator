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
        cursor: 'pointer',
        transform: 'translate(-50%, -50%)'
      }
    };
    return (
      <div>
        {this.props.children}
        <div
          style={styles.mapMarker}
          onClick={() => this.props.handleDealerClick(this.props.id)}
        />
      </div>
    );
  }
}
