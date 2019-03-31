'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _googleMapReact = require('google-map-react');

var _googleMapReact2 = _interopRequireDefault(_googleMapReact);

var _utils = require('google-map-react/utils');

var _geolib = require('geolib');

var _geolib2 = _interopRequireDefault(_geolib);

var _reactLoadScript = require('react-load-script');

var _reactLoadScript2 = _interopRequireDefault(_reactLoadScript);

var _Pin = require('./Pin');

var _Pin2 = _interopRequireDefault(_Pin);

var _ClusterPin = require('./ClusterPin');

var _ClusterPin2 = _interopRequireDefault(_ClusterPin);

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _InfoStyle = require('./InfoStyle');

var _InfoStyle2 = _interopRequireDefault(_InfoStyle);

var _SearchStyle = require('./SearchStyle');

var _SearchStyle2 = _interopRequireDefault(_SearchStyle);

var _clustering = require('../utils/clustering');

var _objects = require('../utils/objects');

var _arrays = require('../utils/arrays');

var _string = require('../utils/string');

var _parsePlace = require('../utils/parse-place');

var _suggestionEvent = require('../utils/suggestion-event');

var _state3 = require('../state');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getLocationsBounds = function getLocationsBounds(locations) {
	var bounds = new google.maps.LatLngBounds();
	locations.map(function (location) {
		bounds.extend(new google.maps.LatLng(parseFloat(location.lat), parseFloat(location.lng)));
	});
	return bounds;
};

// adds distance from the center for each location
var locationsWithDistance = function locationsWithDistance(locations, center) {
	return locations.map(function (location) {
		var distanceMeters = _geolib2.default.getDistance(center, {
			lat: location.lat,
			lng: location.lng
		});
		var distanceMiles = (distanceMeters * 0.000621371).toFixed(2);
		location.distanceFromCenter = distanceMiles;
		return (0, _extends3.default)({}, location);
	});
};

var Map = function (_Component) {
	(0, _inherits3.default)(Map, _Component);

	function Map(props) {
		(0, _classCallCheck3.default)(this, Map);

		var _this = (0, _possibleConstructorReturn3.default)(this, (Map.__proto__ || Object.getPrototypeOf(Map)).call(this, props));

		_this.createMapOptions = _this.createMapOptions.bind(_this);
		_this.onMapChanged = _this.onMapChanged.bind(_this);
		_this.toggleLocation = _this.toggleLocation.bind(_this);
		_this.closeLocation = _this.closeLocation.bind(_this);
		_this.onPlaceChanged = _this.onPlaceChanged.bind(_this);
		_this.handleGoogleMapApiLoad = _this.handleGoogleMapApiLoad.bind(_this);
		_this.onClusterClick = _this.onClusterClick.bind(_this);
		_this.onMapStateChange = _this.onMapStateChange.bind(_this);
		_this.searchByQuery = _this.searchByQuery.bind(_this);

		_this.state = {
			updatedLocations: props.locations, // locations + show state (toggled on/off)
			center: { lat: 0, lng: 0 },
			zoom: 6,
			place: null,
			mapLoaded: false,
			props: null,
			newBounds: null, // does not seem to change
			searchInput: ''
		};
		return _this;
	}

	(0, _createClass3.default)(Map, [{
		key: 'onClusterClick',
		value: function onClusterClick(_ref) {
			var zoom = _ref.zoom,
			    center = _ref.center;

			if (zoom && center) {
				this.setState({ zoom: zoom, center: center });
			} else if (!zoom || !center) {
				console.warn('Must include zoom: ' + zoom + ' and center: ' + JSON.stringify(center) + ' to update map properly. Try using the updateMap function passed through this.props. \n\t\t\t\tExample:\n\t\t\t\tonClick={() => {\n\t\t\t\t\tupdateMap({\n\t\t\t\t\t\tzoom: this.props.getZoom(this.props.cluster_id)\n\t\t\t\t\t\tcenter: { lat: this.props.lat, lng: this.props.lng }\n\t\t\t\t\t})\n\t\t\t\t}}\n\t\t\t\t');
			}
		}

		// state locations (including show state) within map bounds

	}, {
		key: 'locationsInBounds',
		value: function locationsInBounds(locations, bounds) {
			if (bounds && bounds.ne && bounds.sw) {
				var ne = bounds.ne,
				    sw = bounds.sw;

				return locations.filter(function (location) {
					var lat = (0, _string.strToFixed)(location.lat, 6);
					var lng = (0, _string.strToFixed)(location.lng, 6);
					if (lat >= (0, _string.strToFixed)(sw.lat, 6) && lat <= (0, _string.strToFixed)(ne.lat, 6) && lng >= (0, _string.strToFixed)(sw.lng, 6) && lng <= (0, _string.strToFixed)(ne.lng, 6)) {
						return location;
					}
				});
			} else {
				console.error('invalid bounds');
				return locations;
			}
		}

		// callback on locations in bounds change, either on map change (zoom, center) or locations change

	}, {
		key: 'callBackOnChange',
		value: function callBackOnChange(updatedLocations, bounds, center) {
			var updatedLocationsInBounds = this.locationsInBounds(updatedLocations, bounds);
			var updatedLocationsInBoundsWithDistance = locationsWithDistance(updatedLocationsInBounds, center);
			if (this.props.onChange && updatedLocationsInBoundsWithDistance) {
				this.props.onChange(updatedLocationsInBoundsWithDistance);
			}
		}

		// update clusters + callback onChange with locations currently visible

	}, {
		key: 'onMapChanged',
		value: function onMapChanged(props) {
			if (!props || !this.state.mapLoaded) return;
			var bounds = {},
			    center = {
				lat: props.center.lat > 90 ? props.center.lat - 180 : props.center.lat,
				lng: props.center.lng > 180 ? props.center.lng - 360 : props.center.lng
			};
			bounds.ne = {
				lat: props.bounds.ne.lat > 90 ? props.bounds.ne.lat - 180 : props.bounds.ne.lat,
				lng: props.bounds.ne.lng > 180 ? props.bounds.ne.lng - 360 : props.bounds.ne.lng
			};
			bounds.sw = {
				lat: props.bounds.sw.lat > 90 ? props.bounds.sw.lat - 180 : props.bounds.sw.lat,
				lng: props.bounds.sw.lng > 180 ? props.bounds.sw.lng - 360 : props.bounds.sw.lng

				// locations within the map bounds
			};var updatedLocations = this.state.updatedLocations;

			var updatedLocationsInBounds = this.locationsInBounds(updatedLocations, bounds);

			// if enableClusters is enabled create clusters and set them to the state
			if (this.props.enableClusters) {
				var cluster = this.props.cluster;

				this.setState({
					updatedLocations: (0, _clustering.createClusters)(props, updatedLocationsInBounds.length > 0 ? updatedLocationsInBounds : updatedLocations, cluster && cluster.radius, cluster && cluster.extent, cluster && cluster.nodeSize, cluster && cluster.minZoom, cluster && cluster.maxZoom),
					center: center
				});
			}

			this.callBackOnChange(updatedLocations, bounds, center);
		}
	}, {
		key: 'toggleLocation',
		value: function toggleLocation(id) {
			var updatedLocations = this.state.updatedLocations.map(function (location) {
				return (0, _extends3.default)({}, location, {
					show: location.id === id ? !location.show : false
				});
			});
			this.setState({ updatedLocations: updatedLocations });
		}
	}, {
		key: 'closeLocation',
		value: function closeLocation(id) {
			var updatedLocations = this.state.updatedLocations.map(function (location) {
				return (0, _extends3.default)({}, location, {
					show: false
				});
			});
			this.setState({ updatedLocations: updatedLocations });
		}
	}, {
		key: 'createMapOptions',
		value: function createMapOptions() {
			var _props = this.props,
			    mapStyle = _props.mapStyle,
			    mapOptions = _props.mapOptions;

			return (0, _extends3.default)({
				styles: mapOptions && mapOptions.styles || mapStyle
			}, this.props.mapOptions);
		}
	}, {
		key: 'moveMap',
		value: function moveMap(place) {
			this.setState({ place: place });

			var _getPlaceViewport = this.getPlaceViewport(place),
			    center = _getPlaceViewport.center,
			    zoom = _getPlaceViewport.zoom;

			this.setState({
				center: center,
				zoom: zoom.toString().length > 1 ? 9 : zoom
			});
		}
	}, {
		key: 'onPlaceChanged',
		value: function onPlaceChanged(e) {
			if (e) {
				if (e.target.value) {
					this.setState({
						searchInput: e.target.value
					});
				}
			}

			var place = this.searchBox.getPlace();
			if (place && place !== this.state.place) {
				if (this.props.submitSearch) {
					this.props.submitSearch(place);
				}
				this.moveMap(place);

				var updatedAddress = (0, _parsePlace.addressFromPlace)(place);
				if (this.props.getValue) {
					this.props.getValue(updatedAddress);
				}
			}
		}
	}, {
		key: 'viewPortWithBounds',
		value: function viewPortWithBounds(bounds) {
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
			this.setState({
				newBounds: (0, _utils.fitBounds)(newBounds, size).newBounds
			});
			return (0, _utils.fitBounds)(newBounds, size);
		}
	}, {
		key: 'getPlaceViewport',
		value: function getPlaceViewport(place) {
			var geometry = place.geometry;

			return this.viewPortWithBounds(geometry.viewport);
		}
	}, {
		key: 'getLocationsViewport',
		value: function getLocationsViewport() {
			var center = void 0,
			    zoom = void 0;
			var _props2 = this.props,
			    locations = _props2.locations,
			    defaultCenter = _props2.defaultCenter,
			    defaultZoom = _props2.defaultZoom;


			if (locations.length === 1) {
				center = {
					lat: parseFloat(locations[0].lat),
					lng: parseFloat(locations[0].lng)
				};
			} else {
				var bounds = getLocationsBounds(locations);
				var viewport = this.viewPortWithBounds(bounds);
				center = viewport.center;
				zoom = viewport.zoom;
			}

			return {
				center: center || defaultCenter,
				zoom: zoom || defaultZoom
			};
		}
	}, {
		key: 'getCurrentArea',
		value: function getCurrentArea() {
			var locations = this.props.locations;

			var bounds = getLocationsBounds(locations);

			var center = void 0;
			if (locations.length === 1) {
				center = {
					lat: parseFloat(locations[0].lat),
					lng: parseFloat(locations[0].lng)
				};
			} else {
				center = {
					lat: bounds.getCenter().lat(),
					lng: bounds.getCenter().lng()
				};
			}

			var size = {
				width: this.mapEl.offsetWidth,
				height: this.mapEl.offsetHeight
			};

			var newBounds = {
				ne: {
					lat: bounds.getNorthEast().lat(),
					lng: bounds.getNorthEast().lng()
				},
				nw: {
					lat: bounds.getNorthEast().lat(),
					lng: bounds.getSouthWest().lng()
				},
				se: {
					lat: bounds.getSouthWest().lat(),
					lng: bounds.getNorthEast().lng()
				},
				sw: {
					lat: bounds.getSouthWest().lat(),
					lng: bounds.getSouthWest().lng()
				}
			};

			return {
				center: center,
				zoom: this.googleMapRef.props.zoom,
				size: size,
				bounds: newBounds
			};
		}
	}, {
		key: 'onMapStateChange',
		value: function onMapStateChange(state) {
			var newBounds = state.newBounds,
			    place = state.place;

			if (place) {
				this.setState({ place: place });
			}
			if (newBounds) {
				this.setState({ newBounds: newBounds });
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			google.maps.event.clearInstanceListeners(this.searchBox);
			_state3.mapState.unsubscribe(this.onMapStateChange);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			_state3.mapState.subscribe(this.onMapStateChange);
			var _props3 = this.props,
			    google = _props3.google,
			    options = _props3.options;

			var input = this.searchInput;
			if (this.props.initSearch) {
				input.value = this.props.initSearch;
			}
			if (input) {
				this.searchBox = new google.maps.places.Autocomplete(input, options);
				this.searchBox.addListener('place_changed', this.onPlaceChanged);
				(0, _suggestionEvent.enableEnterKey)(input, this.searchBox);
			}

			// set default map location
			var initialCenter = void 0,
			    initialZoom = void 0;
			// if initial location set by initSearch (D), location will be changed in handleGoogleMapApiLoad
			if (!this.props.initSearch) {
				// A. if initial location set by initialCenter and initialZoom
				if (this.props.initialCenter) {
					initialCenter = this.props.initialCenter;
				}
				if (this.props.initialZoom) {
					initialZoom = this.props.initialZoom;
				}
				// B. if initial location set by place => center map on it
				if (this.props.place) {
					var _getPlaceViewport2 = this.getPlaceViewport(this.props.place),
					    center = _getPlaceViewport2.center,
					    zoom = _getPlaceViewport2.zoom;

					initialCenter = center;
					initialZoom = zoom;
				}
				// C. if initial location not set => center map on location(s) if any
				else if (this.props.locations && this.props.locations.length > 0) {
						var _getLocationsViewport = this.getLocationsViewport(),
						    _center = _getLocationsViewport.center,
						    _zoom = _getLocationsViewport.zoom;

						initialCenter = _center;
						initialZoom = _zoom;
					}
			}
			this.setState({
				zoom: initialZoom || this.props.defaultZoom,
				center: initialCenter || this.props.defaultCenter
			});
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate(prevProps, prevState) {
			var _props4 = this.props,
			    propsInitSearch = _props4.initSearch,
			    propsPlace = _props4.place,
			    propsLocations = _props4.locations;
			var prevPropsInitSearch = prevProps.initSearch,
			    prevPropsPlace = prevProps.place,
			    prevPropsLocations = prevProps.locations;
			var _state = this.state,
			    statePlace = _state.place,
			    stateUpdatedLocations = _state.updatedLocations,
			    center = _state.center;
			var prevStatePlace = prevState.place,
			    prevStateUpdatedLocations = prevState.updatedLocations;

			// add or remove any new or deleted location

			if (propsLocations) {
				var prevPropsLocationsArray = prevPropsLocations ? prevPropsLocations : [];
				var prevPropsLocationsIds = prevPropsLocationsArray.map(function (location) {
					return location.id;
				});
				var propsLocationsIds = propsLocations.map(function (location) {
					return location.id;
				});
				if (!(0, _arrays.arraysAreEqual)(prevPropsLocationsIds, propsLocationsIds)) {
					// get added locations (in propsLocations and not in prevPropsLocations)
					var addedLocations = propsLocations.filter(function (propsLocation) {
						return !prevPropsLocationsIds.includes(propsLocation.id);
					});
					// get removed locations (in prevPropsLocations and not in propsLocations)
					var removedLocations = prevPropsLocationsArray.filter(function (prevPropsLocation) {
						return !propsLocationsIds.includes(prevPropsLocation.id);
					});
					// update state immutably (merge & filter) - keep show state of existing locations
					var updatedLocations = [].concat((0, _toConsumableArray3.default)(stateUpdatedLocations), (0, _toConsumableArray3.default)(addedLocations)).filter(function (location) {
						return !removedLocations.map(function (loc) {
							return loc.id;
						}).includes(location.id);
					});
					this.setState({ updatedLocations: updatedLocations });
					this.callBackOnChange(updatedLocations, this.map && this.map.getBounds(), center);
				}
			}

			if (propsPlace && prevPropsPlace !== propsPlace && propsPlace !== statePlace) {
				this.moveMap(propsPlace);
			}
			if (statePlace && statePlace !== prevStatePlace) {
				this.moveMap(statePlace);
			}
			if (propsInitSearch && prevPropsInitSearch !== propsInitSearch) {
				this.searchByQuery(propsInitSearch);
			}
		}
	}, {
		key: 'searchByQuery',
		value: function searchByQuery(query) {
			var _this2 = this;

			var service = new google.maps.places.PlacesService(this.map);
			service.findPlaceFromQuery({
				query: query,
				fields: ['photos', 'formatted_address', 'name', 'rating', 'opening_hours', 'geometry']
			}, function (results, status) {
				var result = results ? results[0] : null;

				// no or invalid result from google PlacesService => center map on defaultCenter or locations
				if (!result || results.length < 1) {
					console.warn('No locations with given query');
					var locationsViewport = void 0;

					// center map on locations if any
					if (_this2.props.locations && _this2.props.locations.length > 0) {
						locationsViewport = _this2.getLocationsViewport();
					}
					_this2.setState({
						center: locationsViewport.center || _this2.props.defaultCenter,
						zoom: locationsViewport.zoom || _this2.props.defaultZoom,
						mapLoaded: true
					});
				}
				// correct result from google PlacesService => set map location to it
				else if (status == google.maps.places.PlacesServiceStatus.OK) {
						var _getPlaceViewport3 = _this2.getPlaceViewport(result),
						    center = _getPlaceViewport3.center,
						    zoom = _getPlaceViewport3.zoom;

						_this2.setState({
							center: center,
							zoom: zoom.toString().length > 1 ? 9 : zoom, // limit zoom to 9
							mapLoaded: true
						});
					}
			});
		}
	}, {
		key: 'handleGoogleMapApiLoad',
		value: function handleGoogleMapApiLoad(_ref2) {
			var map = _ref2.map;

			this.map = map;

			// D. if initial location set by initSearch => get location from it and center on it
			if (!_state3.mapState.state.place) {
				if (this.props.initSearch) {
					this.searchByQuery(this.props.initSearch);
				}
			}

			if (this.props.mapLoaded) {
				this.props.mapLoaded();
			}

			this.setState({ mapLoaded: true });

			// if initial location was set before map was loaded in componentDidMount (case A, B or C), callback onMapChanged with correct view data to update visible locations
			// this is not needed for case D because onMapChanged is automatically called when map is loaded
			if (!this.props.initSearch) {
				if (this.props.locations && this.props.locations.length > 0) {
					var _getCurrentArea = this.getCurrentArea(),
					    center = _getCurrentArea.center,
					    zoom = _getCurrentArea.zoom,
					    size = _getCurrentArea.size,
					    bounds = _getCurrentArea.bounds;

					this.onMapChanged({ center: center, zoom: zoom, size: size, bounds: bounds });
				}
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			var Pin = this.props.pin.component || this.props.pin;
			var ClusterPin = this.props.cluster ? this.props.cluster.component : this.props.clusterPin ? this.props.clusterPin.component : this.props.defaultClusterPin;

			var _state2 = this.state,
			    zoom = _state2.zoom,
			    center = _state2.center,
			    updatedLocations = _state2.updatedLocations;


			var updatedLocationsInBounds = this.locationsInBounds(updatedLocations, this.map && this.map.getBounds());

			return _react2.default.createElement(
				'div',
				{
					style: {
						height: this.props.height,
						width: this.props.width,
						position: 'relative'
					},
					ref: function ref(mapEl) {
						return _this3.mapEl = mapEl;
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
							return _this3.searchInput = input;
						},
						type: 'text',
						placeholder: 'Enter Your Location...',
						'aria-label': 'search'
					})
				),
				this.props.enableClusters && _react2.default.createElement(_reactLoadScript2.default, { url: 'https://unpkg.com/kdbush@3.0.0/kdbush.min.js' }),
				_react2.default.createElement(
					_googleMapReact2.default,
					{
						ref: function ref(_ref3) {
							return _this3.googleMapRef = _ref3;
						},
						onGoogleApiLoaded: this.handleGoogleMapApiLoad,
						bootstrapURLKeys: { key: this.props.googleApiKey },
						yesIWantToUseGoogleMapApiInternals: true,
						onTilesLoaded: this.props.tilesRendered,
						center: this.props.center || center,
						zoom: this.props.zoom || zoom,
						options: this.createMapOptions,
						onChange: this.onMapChanged,
						gestureHandling: this.props.gestureHandling || 'cooperative'
					},
					updatedLocationsInBounds.map(function (location) {
						if (location.cluster_id) {
							return _react2.default.createElement(ClusterPin, (0, _extends3.default)({
								key: location.id,
								lat: location.lat,
								lng: location.lng,
								updateMap: function updateMap(updates) {
									return _this3.onClusterClick(updates);
								}
							}, location, {
								pinProps: _this3.props.cluster && _this3.props.cluster.pinProps || null
							}));
						}
						return _react2.default.createElement(
							Pin,
							(0, _extends3.default)({
								key: location.id,
								handleLocationClick: _this3.toggleLocation,
								lat: location.lat,
								lng: location.lng
							}, location, _this3.props, {
								pinProps: _this3.props.pin.pinProps || null
							}),
							!_this3.props.children ? _react2.default.createElement(
								_Info2.default,
								{ show: location.show, style: _this3.props.infoStyle },
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
												return _this3.closeLocation(location.id);
											}
										},
										'\xD7'
									)
								)
							) : _this3.props.children(location, _this3.closeLocation)
						);
					})
				)
			);
		}
	}]);
	return Map;
}(_react.Component);

exports.default = Map;


Map.defaultProps = {
	pin: _Pin2.default,
	defaultClusterPin: _ClusterPin2.default,
	mapStyle: {},
	height: '800px',
	width: '100%',
	defaultCenter: { lat: 0, lng: 180 },
	defaultZoom: 8
};
module.exports = exports['default'];
//# sourceMappingURL=Map.js.map