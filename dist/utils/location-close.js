'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _geolib = require('geolib');

var _geolib2 = _interopRequireDefault(_geolib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
	var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
		var apiKey = _ref2.apiKey,
		    query = _ref2.query,
		    locations = _ref2.locations;
		var location, geolocationUrl, data, results, geometry, updatedLocations, nearestLocation, foundLocation;
		return _regenerator2.default.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						if (apiKey) {
							_context.next = 3;
							break;
						}

						console.error('No Api key provided');
						return _context.abrupt('return');

					case 3:
						if (query) {
							_context.next = 6;
							break;
						}

						console.error('Must provide a query for a location to be found');
						return _context.abrupt('return');

					case 6:
						if (!(!locations || locations.length < 1)) {
							_context.next = 9;
							break;
						}

						console.error('You must provide locations in order to find the closest one');
						return _context.abrupt('return');

					case 9:
						location = null;
						_context.next = 12;
						return (0, _axios2.default)({
							method: 'get',
							url: 'https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:' + query + '|country:US&key=' + apiKey
						});

					case 12:
						geolocationUrl = _context.sent;
						data = geolocationUrl.data;
						results = data.results;

						if (results && results.length > 0) {
							geometry = results[0].geometry;

							if (geometry) {
								location = geometry['location'];
							}
						}

						if (location) {
							_context.next = 19;
							break;
						}

						console.error('No location found by that query, please try again');
						return _context.abrupt('return');

					case 19:
						updatedLocations = {};

						locations.forEach(function (loc, i) {
							if (!loc['lat'] || !loc['lng']) {
								console.warn(JSON.stringify(locations[i]) + ' will be omitted from the search, must have \'lat\' and \'lng\' fields');
								return;
							}
							if (!loc['id']) {
								console.warn('Location must have an id: ' + JSON.stringify(locations[i]));
								return;
							}
							updatedLocations[loc['id']] = (0, _extends3.default)({}, loc, {
								latitude: loc['lat'],
								longitude: loc['lng']
							});
						});

						if (!(Object.keys(updatedLocations).length < 1)) {
							_context.next = 24;
							break;
						}

						console.error('No locations to compare with');
						return _context.abrupt('return');

					case 24:
						nearestLocation = _geolib2.default.findNearest(location, updatedLocations);
						foundLocation = locations.find(function (loc) {
							return loc['id'] === nearestLocation['key'];
						});

						if (foundLocation) {
							_context.next = 29;
							break;
						}

						console.error('No nearest location found');
						return _context.abrupt('return');

					case 29:
						return _context.abrupt('return', foundLocation);

					case 30:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined);
	}));

	return function (_x) {
		return _ref.apply(this, arguments);
	};
}();

module.exports = exports['default'];
//# sourceMappingURL=location-close.js.map