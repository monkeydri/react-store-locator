import React, { Component } from 'react';
import GoogleMap from 'google-map-react';
import { fitBounds } from 'google-map-react/utils';
import geolib from 'geolib';
import Pin from './Pin';
import Info from './Info';
import GoogleMarker from './GoogleMarker';
import infoStyle from './InfoStyle';
import searchStyle from './SearchStyle';

function findDealerIndex(id, dealers) {
  for (let i = dealers.length; i--; ) {
    if (dealers[i].id === id) {
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
    this.toggleDealer = this.toggleDealer.bind(this);
    this.closeDealer = this.closeDealer.bind(this);
    this.onPlacesChanged = this.onPlacesChanged.bind(this);

    this.state = {
      dealers: [],
      foundDealers: [],
      center: null,
      zoom: null,
      googleMarkers: []
    };
  }

  changeMap(props) {
    console.log(props);
    const {
      bounds: { ne, nw, se, sw }
    } = props;

    const { dealers } = this.state;
    if (dealers) {
      const foundDealers = dealers.filter(dealer => {
        if (
          dealer.lat > se.lat &&
          sw.lat &&
          (dealer.lat < ne.lat && nw.lat) &&
          (dealer.lng > nw.lng && sw.lng) &&
          (dealer.lng < ne.lng && se.lng)
        ) {
          return dealer;
        }
      });
      foundDealers.map(dealer => {
        const distanceMeters = geolib.getDistance(props.center, {
          lat: dealer.lat,
          lng: dealer.lng
        });
        const distanceMiles = (distanceMeters * 0.000621371).toFixed(2);
        dealer.distanceFromCenter = distanceMiles;
        return dealer;
      });
      this.setState({ foundDealers });
      if (this.props.onChange) {
        this.props.onChange(foundDealers);
      }
    }
  }

  toggleDealer(id) {
    console.log(id);
    const index = findDealerIndex(id, this.state.dealers);
    if (index !== null) {
      const dealers = this.state.dealers;
      dealers[index].show = !dealers[index].show;
      this.setState({ dealers });
    }
  }

  closeDealer(id) {
    const index = findDealerIndex(id, this.state.dealers);
    if (index !== null) {
      const dealers = this.state.dealers;
      dealers[index].show = false;
      this.setState({ dealers });
    }
  }

  createMapOptions(maps) {
    return {
      styles: this.props.mapStyle
    };
  }

  onPlacesChanged() {
    const { google } = this.props;
    let places = this.searchBox.getPlaces();
    if (places) {
      if (places.length > 0) {
        const firstLocation = places[0];
        const { geometry } = firstLocation;
        const newBounds = {
          ne: {
            lat: geometry.viewport.getNorthEast().lat(),
            lng: geometry.viewport.getNorthEast().lng()
          },
          sw: {
            lat: geometry.viewport.getSouthWest().lat(),
            lng: geometry.viewport.getSouthWest().lng()
          }
        };
        const size = {
          width: this.mapEl.offsetWidth,
          height: this.mapEl.offsetHeight
        };

        const { center, zoom } = fitBounds(newBounds, size);
        if (this.state.googleMarkers.length > 0) {
          for (let i = this.state.googleMarkers.length; i--; ) {
            this.state.googleMarkers[i].setMap(null);
          }
          this.setState({
            googleMarkers: []
          });
        }
        const marker = GoogleMarker(
          this.props.customIcon,
          this.props.googleMapIcon,
          this.map.map_,
          center
        );
        this.setState({
          center: center,
          zoom: zoom,
          googleMarkers: [...this.state.googleMarkers, marker]
        });
      }
    }
  }

  componentDidMount() {
    const { google } = this.props;
    const input = this.searchInput;
    this.searchBox = new google.maps.places.SearchBox(input);
    this.searchBox.addListener('places_changed', this.onPlacesChanged);

    const bounds = new google.maps.LatLngBounds();
    this.props.dealers.map(dealer => {
      bounds.extend(new google.maps.LatLng(dealer.lat, dealer.lng));
    });
    const newBounds = {
      ne: {
        lat: bounds.getNorthEast().lat(),
        lng: bounds.getNorthEast().lng()
      },
      sw: {
        lat: bounds.getSouthWest().lat(),
        lng: bounds.getSouthWest().lng()
      }
    };
    const size = {
      width: this.mapEl.offsetWidth,
      height: this.mapEl.offsetHeight
    };
    const { center, zoom } = fitBounds(newBounds, size);
    this.setState({
      dealers: this.props.dealers,
      zoom: zoom,
      center: center
    });
  }

  render() {
    let Pin = this.props.pin;

    return (
      <div
        style={{
          height: this.props.height,
          width: this.props.width,
          position: 'relative'
        }}
        ref={mapEl => (this.mapEl = mapEl)}
      >
        <div
          style={{
            position: 'absolute',
            top: 5,
            left: 5,
            zIndex: 100
          }}
        >
          <input
            className="storeLocatorInput"
            style={searchStyle.searchInput}
            onChange={this.onPlacesChanged}
            ref={input => (this.searchInput = input)}
            type="text"
            placeholder="Search Dealers..."
          />
        </div>
        <GoogleMap
          ref={ref => (this.map = ref)}
          center={this.props.center || this.state.center}
          zoom={this.props.zoom || this.state.zoom}
          options={this.createMapOptions}
          onChange={this.changeMap}
        >
          {this.props.dealers.map(dealer => {
            return (
              <Pin
                key={dealer.id}
                handleDealerClick={this.toggleDealer}
                lat={dealer.lat}
                lng={dealer.lng}
                {...dealer}
              >
                {!this.props.children ? (
                  <Info show={dealer.show} style={this.props.infoStyle}>
                    <div style={infoStyle.main}>
                      {Object.keys(dealer).map((k, i) => {
                        if (
                          k === 'id' ||
                          k === 'lat' ||
                          k === 'lng' ||
                          k === 'show'
                        )
                          return;
                        return (
                          <div key={k}>
                            {k}: {`${dealer[k]}`}
                            {i + 1 === Object.keys(dealer).length ? null : (
                              <hr style={infoStyle.hr} />
                            )}
                          </div>
                        );
                      })}
                      <div
                        style={infoStyle.close}
                        onClick={() => this.closeDealer(dealer.id)}
                      >
                        x
                      </div>
                    </div>
                  </Info>
                ) : (
                  this.props.children(dealer, this.closeDealer)
                )}
              </Pin>
            );
          })}
        </GoogleMap>
      </div>
    );
  }
}

Map.defaultProps = {
  pin: Pin,
  mapStyle: {},
  height: '800px',
  width: '100%',
  customIcon: {
    path:
      'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
    color: '#FE7569',
    borderColor: '#000'
  }
};
