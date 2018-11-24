'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('google-map-react/utils');

var _state = require('../state');

var _helpers = require('../helpers');

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
        _state.mapState.setState({ newBounds: newBounds });

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
        if (getValue) {
          getValue(updatedAddress);
        }
      }
    });
    (0, _helpers.enableEnterKey)(input);
    (0, _helpers.tagAutoCompleteContainer)(input);
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