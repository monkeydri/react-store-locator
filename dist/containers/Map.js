'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _googleMapReact = require('google-map-react');

var _googleMapReact2 = _interopRequireDefault(_googleMapReact);

var _utils = require('google-map-react/utils');

var _geolib = require('geolib');

var _geolib2 = _interopRequireDefault(_geolib);

var _Pin = require('./Pin');

var _Pin2 = _interopRequireDefault(_Pin);

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _GoogleMarker = require('./GoogleMarker');

var _GoogleMarker2 = _interopRequireDefault(_GoogleMarker);

var _InfoStyle = require('./InfoStyle');

var _InfoStyle2 = _interopRequireDefault(_InfoStyle);

var _SearchStyle = require('./SearchStyle');

var _SearchStyle2 = _interopRequireDefault(_SearchStyle);

var _statable = require('statable');

var _state = require('../state');

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function findLocationIndex(id, locations) {
  for (var i = locations.length; i--;) {
    if (locations[i].id === id) {
      return i;
    }
  }
  return null;
}

function arraysAreIdentical(array1, array2) {
  if (array1.length != array2.length) return false;else {
    var array2IncludesArray1 = array1.every(function (element) {
      return array2.includes(element);
    });
    var array1IncludesArray2 = array2.every(function (element) {
      return array1.includes(element);
    });
    return array1IncludesArray2 && array2IncludesArray1;
  }
}

var Map = function (_Component) {
  (0, _inherits3.default)(Map, _Component);

  function Map(props) {
    var _this$state;

    (0, _classCallCheck3.default)(this, Map);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Map.__proto__ || Object.getPrototypeOf(Map)).call(this, props));

    _this.createMapOptions = _this.createMapOptions.bind(_this);
    _this.changeMap = _this.changeMap.bind(_this);
    _this.toggleLocation = _this.toggleLocation.bind(_this);
    _this.closeLocation = _this.closeLocation.bind(_this);
    _this.onPlaceChanged = _this.onPlaceChanged.bind(_this);
    _this.initCenterMap = _this.initCenterMap.bind(_this);
    _this.checkGoogleMarker = _this.checkGoogleMarker.bind(_this);
    _this.handleMapLoad = _this.handleMapLoad.bind(_this);

    _this.state = (_this$state = {
      locations: [],
      foundLocations: [],
      center: null,
      zoom: null,
      googleMarkers: [],
      place: null
    }, (0, _defineProperty3.default)(_this$state, 'googleMarkers', []), (0, _defineProperty3.default)(_this$state, 'mapLoaded', false), _this$state);
    return _this;
  }

  (0, _createClass3.default)(Map, [{
    key: 'checkGoogleMarker',
    value: function checkGoogleMarker() {
      for (var i = this.state.googleMarkers.length; i--;) {
        // this removes each marker from the map
        this.state.googleMarkers[i].setMap(null);
      }

      this.setState({
        googleMarkers: []
      });
    }
  }, {
    key: 'changeMap',
    value: function changeMap(props) {
      if (!this.state.mapLoaded) return;
      var _props$bounds = props.bounds,
          ne = _props$bounds.ne,
          nw = _props$bounds.nw,
          se = _props$bounds.se,
          sw = _props$bounds.sw;
      var locations = this.state.locations;
      // locations within the map bounds

      var foundLocations = locations.filter(function (location) {
        if (location.lat > se.lat && sw.lat && location.lat < ne.lat && nw.lat && location.lng > nw.lng && sw.lng && location.lng < ne.lng && se.lng) {
          return location;
        }
      });
      foundLocations.map(function (location) {
        var distanceMeters = _geolib2.default.getDistance(props.center, {
          lat: location.lat,
          lng: location.lng
        });
        var distanceMiles = (distanceMeters * 0.000621371).toFixed(2);
        location.distanceFromCenter = distanceMiles;
        return (0, _extends3.default)({}, location);
      });
      this.setState({ foundLocations: foundLocations });
      if (this.props.onChange) {
        // this prevents empty array being passed before map has loaded
        if (this.state.mapLoaded) {
          this.props.onChange(foundLocations);
        } else {
          this.props.onChange(null);
        }
      }
      if (this.props.centerMarker) {
        console.warn('centerMarker will be depreciated in future versions');
        var marker = null;
        // check to see if marker already exist at this location for search/center markers
        var createMarker = true;

        if (this.state.googleMarkers.length > 0) {
          var newMarker = {
            lat: props.center.lat.toFixed(4),
            lng: props.center.lng.toFixed(4)
          };
          this.state.googleMarkers.forEach(function (googleMarker) {
            var position = {
              lat: googleMarker.position.lat().toFixed(4),
              lng: googleMarker.position.lng().toFixed(4)
            };
            if (newMarker.lng === position.lng && newMarker.lat === position.lat) {
              createMarker = false;
            }
          });
        }
        if (foundLocations.length > 0) {
          foundLocations.forEach(function (foundLocation) {
            var distance = (_geolib2.default.getDistance(props.center, {
              lat: foundLocation.lat,
              lng: foundLocation.lng
            }) * 0.000621371).toFixed(2);
            if (distance <= 6.5) {
              createMarker = false;
            }
          });
        }
        if (createMarker) {
          marker = (0, _GoogleMarker2.default)(this.props.centerMarker, this.map, props.center);
        }

        // add the new marker to arr of googleMarkers and remove all other ones
        this.checkGoogleMarker();
        if (marker) {
          // this needs to be done to set the markers to null on the map, removing them
          // from the array will not remove them from the map
          this.setState({
            googleMarkers: [marker]
          });
        }
      }
    }
  }, {
    key: 'toggleLocation',
    value: function toggleLocation(id) {
      var index = findLocationIndex(id, this.state.locations);
      if (index !== null) {
        var locations = this.state.locations;
        locations.forEach(function (item) {
          item.show ? item.show = false : item.show = item.show;
        });
        locations[index].show = !locations[index].show;
        this.setState({ locations: locations });
      }
    }
  }, {
    key: 'closeLocation',
    value: function closeLocation(id) {
      var index = findLocationIndex(id, this.state.locations);
      if (index !== null) {
        var locations = this.state.locations;
        locations[index].show = false;
        this.setState({ locations: locations });
      }
    }
  }, {
    key: 'createMapOptions',
    value: function createMapOptions(maps) {
      return {
        styles: this.props.mapStyle
      };
    }
  }, {
    key: 'initCenterMap',
    value: function initCenterMap() {
      var google = this.props.google;
      var newBounds = _state.mapState.state.newBounds;

      var size = {};
      if (this.mapEl) {
        size = {
          width: this.mapEl.offsetWidth,
          height: this.mapEl.offsetHeight
        };
      }

      var _fitBounds = (0, _utils.fitBounds)(newBounds, size),
          center = _fitBounds.center,
          zoom = _fitBounds.zoom;

      if (this.props.centerMarker) {
        console.warn('centerMarker will be depreciated in future versions');
        this.checkGoogleMarker();

        var marker = (0, _GoogleMarker2.default)(this.props.centerMarker, this.map, props.center);
        this.setState({
          googleMarkers: [].concat((0, _toConsumableArray3.default)(this.state.googleMarkers), [marker])
        });
      }

      this.setState({
        center: center,
        zoom: zoom.toString().length > 1 ? 9 : zoom
      });
    }
  }, {
    key: 'onPlaceChanged',
    value: function onPlaceChanged() {
      var place = this.searchBox.getPlace();
      if (place === this.state.place) place = undefined;
      if (place) {
        if (this.props.submitSearch) {
          this.props.submitSearch();
        }
        this.setState({ place: place });
        var _place = place,
            geometry = _place.geometry;

        var newBounds = {
          ne: {
            lat: geometry.viewport.getNorthEast().lat(),
            lng: geometry.viewport.getNorthEast().lng()
          },
          sw: {
            lat: geometry.viewport.getSouthWest().lat(),
            lng: geometry.viewport.getSouthWest().lng()
          }
        };
        var size = {};
        if (this.mapEl) {
          size = {
            width: this.mapEl.offsetWidth,
            height: this.mapEl.offsetHeight
          };
        }

        var _fitBounds2 = (0, _utils.fitBounds)(newBounds, size),
            center = _fitBounds2.center,
            zoom = _fitBounds2.zoom;

        if (this.props.centerMarker) {
          console.warn('centerMarker will be depreciated in future versions');
          this.checkGoogleMarker();

          var marker = (0, _GoogleMarker2.default)(this.props.centerMarker, this.map, center);
          this.setState({
            googleMarkers: [].concat((0, _toConsumableArray3.default)(this.state.googleMarkers), [marker])
          });
        }

        this.setState({
          center: center,
          zoom: zoom.toString().length > 1 ? 9 : zoom
        });
      }

      var updatedAddress = {};
      place.address_components.map(function (comp) {
        if (comp.types.includes('postal_code')) {
          updatedAddress.zip = comp.short_name;
        }
        if (comp.types.includes('street_number')) {
          updatedAddress.number = comp.short_name;
        }
        if (comp.types.includes('route')) {
          updatedAddress.street = comp.short_name;
        }
        if (comp.types.includes('locality')) {
          updatedAddress.city = comp.short_name;
        }
        if (comp.types.includes('administrative_area_level_1')) {
          updatedAddress.state = comp.short_name;
        }
        if (comp.types.includes('country')) {
          updatedAddress.country = comp.short_name;
        }
      });
      updatedAddress.place = place;
      if (this.props.getValue) {
        this.props.getValue(updatedAddress);
      }
    }
  }, {
    key: 'updateMap',
    value: function updateMap(place) {
      if (place === this.state.place) place = undefined;
      if (place) {
        //  if (this.props.submitSearch) {
        //   this.props.submitSearch()
        //  }
        this.setState({ place: place });
        var _place2 = place,
            geometry = _place2.geometry;

        var newBounds = {
          ne: {
            lat: geometry.viewport.getNorthEast().lat(),
            lng: geometry.viewport.getNorthEast().lng()
          },
          sw: {
            lat: geometry.viewport.getSouthWest().lat(),
            lng: geometry.viewport.getSouthWest().lng()
          }
        };
        var size = {};
        if (this.mapEl) {
          size = {
            width: this.mapEl.offsetWidth,
            height: this.mapEl.offsetHeight
          };
        }

        var _fitBounds3 = (0, _utils.fitBounds)(newBounds, size),
            center = _fitBounds3.center,
            zoom = _fitBounds3.zoom;

        if (this.props.centerMarker) {
          console.warn('centerMarker will be depreciated in future versions');
          this.checkGoogleMarker();

          var marker = (0, _GoogleMarker2.default)(this.props.centerMarker, this.map, center);
          this.setState({
            googleMarkers: [].concat((0, _toConsumableArray3.default)(this.state.googleMarkers), [marker])
          });
        }

        this.setState({
          center: center,
          zoom: zoom.toString().length > 1 ? 9 : zoom
        });
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.changeMap();

      if (_state.mapState.state) {
        _state.mapState.subscribe(function (state) {
          if (state.newBounds) {
            _this2.initCenterMap();
          }
        });
      }

      var _props = this.props,
          google = _props.google,
          options = _props.options;

      var input = this.searchInput;
      if (this.props.initSearch) {
        input.value = this.props.initSearch;
      }
      this.searchBox = new google.maps.places.Autocomplete(input, options);
      this.searchBox.addListener('place_changed', this.onPlaceChanged);
      (0, _helpers.enableEnterKey)(input, this.searchBox);

      var defaultZoom = 8,
          defaultCenter = { lat: 0, lng: 180 };
      if (!this.props.initSearch && this.props.locations && this.props.locations.length > 0) {
        var bounds = new google.maps.LatLngBounds();
        this.props.locations.map(function (location) {
          bounds.extend(new google.maps.LatLng(location.lat, location.lng));
        });
        var newBounds = {
          ne: {
            lat: bounds.getNorthEast().lat(),
            lng: bounds.getNorthEast().lng()
          },
          sw: {
            lat: bounds.getSouthWest().lat(),
            lng: bounds.getSouthWest().lng()
          }
        };
        var size = {};
        if (this.mapEl) {
          size = {
            width: this.mapEl.offsetWidth,
            height: this.mapEl.offsetHeight
          };
        }

        var _fitBounds4 = (0, _utils.fitBounds)(newBounds, size),
            center = _fitBounds4.center,
            zoom = _fitBounds4.zoom;

        defaultZoom = zoom;
        defaultCenter = center;
      }

      this.setState({
        locations: this.props.locations,
        zoom: defaultZoom,
        center: defaultCenter
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _state.mapState.unsubscribe();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      // update map place changes
      if (prevProps.place !== this.props.place) {
        this.updateMap(this.props.place);
      }

      // update locations copy in state
      // get ids of previous and current locations (props)
      var prevLocationsIds = prevProps.locations.map(function (location) {
        return location.id;
      });
      var updatedLocationsIds = this.props.locations.map(function (location) {
        return location.id;
      });
      // check if arrays differs
      if (!arraysAreIdentical(prevLocationsIds, updatedLocationsIds)) {
        // get any additional locations (that were not in previous props)
        var additionalLocations = this.props.locations.filter(function (updatedLocation) {
          return !prevLocationsIds.includes(updatedLocation.id);
        });
        // add any location 
        var previousAndAdditionalLocations = [].concat((0, _toConsumableArray3.default)(prevProps.locations), (0, _toConsumableArray3.default)(additionalLocations));
        // remove any location that were in state before and not in updated props
        var updatedLocations = previousAndAdditionalLocations.filter(function (location) {
          return updatedLocationsIds.includes(location.id);
        });
        // update state
        this.setState({ locations: updatedLocations });
      }
    }
  }, {
    key: 'handleMapLoad',
    value: function handleMapLoad(_ref) {
      var _this3 = this;

      var map = _ref.map,
          maps = _ref.maps;

      this.map = map;
      if (this.props.initSearch) {
        var service = new google.maps.places.PlacesService(map);
        service.findPlaceFromQuery({
          query: this.props.initSearch,
          fields: ['photos', 'formatted_address', 'name', 'rating', 'opening_hours', 'geometry']
        }, function (results, status) {
          var result = results ? results[0] : null;
          if (!result || results.length < 1) {
            console.warn('No locations with given query');
            var defaultZoom = 8,
                defaultCenter = { lat: 0, lng: 180 };
            if (_this3.props.locations && _this3.props.locations.length > 0) {
              var bounds = new google.maps.LatLngBounds();
              _this3.props.locations.map(function (location) {
                bounds.extend(new google.maps.LatLng(location.lat, location.lng));
              });
              var newBounds = {
                ne: {
                  lat: bounds.getNorthEast().lat(),
                  lng: bounds.getNorthEast().lng()
                },
                sw: {
                  lat: bounds.getSouthWest().lat(),
                  lng: bounds.getSouthWest().lng()
                }
              };
              var size = {};
              if (_this3.mapEl) {
                size = {
                  width: _this3.mapEl.offsetWidth,
                  height: _this3.mapEl.offsetHeight
                };
              }

              var _fitBounds5 = (0, _utils.fitBounds)(newBounds, size),
                  center = _fitBounds5.center,
                  zoom = _fitBounds5.zoom;

              defaultZoom = zoom;
              defaultCenter = center;
            }
            _this3.setState({
              locations: _this3.props.locations,
              zoom: defaultZoom,
              center: defaultCenter,
              mapLoaded: true
            });
          } else {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              var geometry = result.geometry;

              var _newBounds = {
                ne: {
                  lat: geometry.viewport.getNorthEast().lat(),
                  lng: geometry.viewport.getNorthEast().lng()
                },
                sw: {
                  lat: geometry.viewport.getSouthWest().lat(),
                  lng: geometry.viewport.getSouthWest().lng()
                }
              };
              var _size = {
                width: _this3.mapEl.offsetWidth,
                height: _this3.mapEl.offsetHeight
              };

              var _fitBounds6 = (0, _utils.fitBounds)(_newBounds, _size),
                  _center = _fitBounds6.center,
                  _zoom = _fitBounds6.zoom;

              _this3.setState({
                center: _center,
                zoom: _zoom.toString().length > 1 ? 9 : _zoom,
                mapLoaded: true
              });
            }
          }
        });
      }
      if (this.props.mapLoaded) {
        this.props.mapLoaded();
      }
      this.setState({ mapLoaded: true });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var Pin = this.props.pin.component || this.props.pin;
      var foundLocations = this.state.foundLocations;


      var updatedLocations = foundLocations.length > 0 ? foundLocations : this.props.locations;
      return _react2.default.createElement(
        'div',
        {
          style: {
            height: this.props.height,
            width: this.props.width,
            position: 'relative'
          },
          ref: function ref(mapEl) {
            return _this4.mapEl = mapEl;
          }
        },
        _react2.default.createElement(
          'div',
          {
            style: {
              position: 'absolute',
              top: 5,
              left: 5,
              zIndex: 2
            }
          },
          _react2.default.createElement('input', {
            className: 'storeLocatorInput',
            style: _SearchStyle2.default.searchInput,
            onChange: this.onPlaceChanged,
            ref: function ref(input) {
              return _this4.searchInput = input;
            },
            type: 'text',
            placeholder: 'Enter Your Location...'
          })
        ),
        _react2.default.createElement(
          _googleMapReact2.default
          // ref={ref => (this.map = ref)}
          ,
          { onGoogleApiLoaded: this.handleMapLoad,
            yesIWantToUseGoogleMapApiInternals: true,
            onTilesLoaded: this.props.tilesRendered,
            center: this.props.center || this.state.center,
            zoom: this.props.zoom || this.state.zoom,
            options: this.createMapOptions,
            onChange: this.changeMap
          },
          Array.isArray(this.props.locations) ? updatedLocations.map(function (location) {
            return _react2.default.createElement(
              Pin,
              (0, _extends3.default)({
                key: location.id,
                handleLocationClick: _this4.toggleLocation,
                lat: location.lat,
                lng: location.lng
              }, location, _this4.props, {
                pinProps: _this4.props.pin.pinProps || null
              }),
              !_this4.props.children ? _react2.default.createElement(
                _Info2.default,
                { show: location.show, style: _this4.props.infoStyle },
                _react2.default.createElement(
                  'div',
                  { style: _InfoStyle2.default.main },
                  Object.keys(location).map(function (k, i) {
                    if (k === 'id' || k === 'lat' || k === 'lng' || k === 'show') return;
                    return _react2.default.createElement(
                      'div',
                      {
                        key: k,
                        style: k === 'name' ? { marginBottom: '12px' } : { marginBottom: '2px' }
                      },
                      '' + location[k]
                    );
                  }),
                  _react2.default.createElement(
                    'div',
                    {
                      style: _InfoStyle2.default.close,
                      onClick: function onClick() {
                        return _this4.closeLocation(location.id);
                      }
                    },
                    '\xD7'
                  )
                )
              ) : _this4.props.children(location, _this4.closeLocation)
            );
          }) : console.warn('Locations must be an array of markers')
        )
      );
    }
  }]);
  return Map;
}(_react.Component);

exports.default = Map;


Map.defaultProps = {
  pin: _Pin2.default,
  mapStyle: {},
  height: '800px',
  width: '100%',
  customIcon: {
    path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
    color: '#FE7569',
    borderColor: '#000'
  }
};
module.exports = exports['default'];
//# sourceMappingURL=Map.js.map