import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import Map from './Map';
import Search from './Search';

class MapContainer extends Component {
  componentDidMount() {
    Search({ ...this.props });
  }

  render() {
    return <Map {...this.props} />;
  }
}
export default GoogleApiWrapper(props => ({
  apiKey: props.googleApiKey
}))(MapContainer);
