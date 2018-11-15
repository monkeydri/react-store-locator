'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('google-map-react/utils');

var _state = require('../state');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initSearch(google, options) {
  var input = document.querySelector('.storeLocatorSearchInput');
  if (input) {
    var searchBox = new google.maps.places.Autocomplete(input, options);

    searchBox.addListener('places_changed', function () {
      var places = searchBox.getPlaces();
      places.forEach(function (place) {
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
        _state.mapState.setState({ newBounds: newBounds });
      });
    });
  }
}

exports.default = function (props) {
  if (props.google) {
    initSearch(props.google, props.options);
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