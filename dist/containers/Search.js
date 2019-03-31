'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('google-map-react/utils');

var _state = require('../state');

var _parsePlace = require('../utils/parse-place');

var _suggestionEvent = require('../utils/suggestion-event');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initSearch(google, options, getValue) {
	var input = document.querySelector('.storeLocatorSearchInput');
	if (input) {
		var searchBox = new google.maps.places.Autocomplete(input, options);

		searchBox.addListener('place_changed', function () {
			var place = searchBox.getPlace();
			if (place) {
				if (!place.geometry) {
					console.warn('Returned place contains no geometry');
					return;
				}

				var geometry = place.geometry;

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
				_state.mapState.setState({ place: place, newBounds: newBounds });

				var updatedAddress = (0, _parsePlace.addressFromPlace)(place);
				if (getValue) {
					getValue(updatedAddress);
				}
			}
		});
		(0, _suggestionEvent.enableEnterKey)(input, searchBox);
	}
}

exports.default = function (props) {
	if (props.google) {
		initSearch(props.google, props.options || {}, props.getValue);
	}

	return _react2.default.createElement('input', {
		type: 'text',
		className: 'storeLocatorSearchInput',
		placeholder: props.placeholder || 'Enter Your Location',
		style: props.style || {},
		onChange: props.onChange
	});
};

module.exports = exports['default'];
//# sourceMappingURL=Search.js.map