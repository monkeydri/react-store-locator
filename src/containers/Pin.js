import React, { Component } from 'react';
import MapIcon from 'react-icons/lib/fa/map-marker';

export default class Pin extends Component {
  render() {
    const styles = {
      mapMarker: {
        cursor: 'pointer',
        background: 'yellow'
      }
    };
    return (
      <div>
        {this.props.children}
        <div
          style={styles.mapMarker}
          onClick={() => this.props.handleLocationClick(this.props.id)}
        >
          <MapIcon
            size={37}
            style={{
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
      </div>
    );
  }
}
