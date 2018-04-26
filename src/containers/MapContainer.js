import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import Map from './Map';

class MapContainer extends Component {
  render() {
    return <Map {...this.props} />;
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCl5euNmDvFzhI7sNxXj7GdYC6lOALQGZE'
})(MapContainer);
