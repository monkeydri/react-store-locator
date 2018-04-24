import React, { Component } from 'react';
import GoogleMap from 'google-map-react';

function findMarkerIndex(id, markers) {
  for (let i = markers.length; i--; ) {
    if (markers[i].id === id) {
      return i;
    }
  }
  return null;
}

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.createMapOptions = this.createMapOptions.bind(this);
    this.changeMap = this.changeMap.bind(this);
    this.toggleMarker = this.toggleMarker.bind(this);

    this.state = {
      markers: []
    };
  }

  changeMap(props) {
    const {
      bounds: { ne, nw, se, sw }
    } = props;
    // east for lng will be greater
    // north for lat will be greater
    const { markers } = this.state;
    if (markers) {
      const foundMarkers = markers.filter(marker => {
        if (
          marker.lat > se.lat &&
          sw.lat &&
          (marker.lat < ne.lat && nw.lat) &&
          (marker.lng > nw.lng && sw.lng) &&
          (marker.lng < ne.lng && se.lng)
        ) {
          return marker;
        }
      });
      this.props.markersInBounds(foundMarkers);
    }
  }

  toggleMarker(id) {
    const index = findMarkerIndex(id, this.state.markers);
    if (index !== null) {
      const markers = this.state.markers;
      markers[index].show = !markers[index].show;
      this.setState({ markers });
    }
  }

  closeMarker(id) {
    const index = findMarkerIndex(id, this.state.markers);
    if (index !== null) {
      const markers = this.state.markers;
      markers[index].show = false;
      this.setState({ markers });
    }
  }

  createMapOptions(maps) {
    return {
      styles: this.props.styles
    };
  }

  componentDidMount() {
    this.setState({ markers: this.props.markers });
  }

  render() {
    const Marker = this.props.markerComponent;
    const markers = (this.state.markers || []).map(marker => (
      <Marker
        key={marker.id}
        handleMarkerClick={this.toggleMarker}
        handleMarkerClose={this.closeMarker}
        {...marker}
      />
    ));
    return (
      <div
        style={{
          height: this.props.height || '800px',
          width: this.props.width || '100%'
        }}
      >
        <GoogleMap
          ref={ref => {
            this.map = ref;
          }}
          center={this.props.center || { lat: 50, lng: 25 }}
          zoom={this.props.zoom || 8}
          options={this.createMapOptions || {}}
          onChange={this.changeMap}
        >
          {markers}
        </GoogleMap>
      </div>
    );
  }
}
