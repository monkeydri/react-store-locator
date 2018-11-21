'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _googleMapsReact = require('google-maps-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AutoComplete = function (_Component) {
  (0, _inherits3.default)(AutoComplete, _Component);

  function AutoComplete(props) {
    (0, _classCallCheck3.default)(this, AutoComplete);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AutoComplete.__proto__ || Object.getPrototypeOf(AutoComplete)).call(this, props));

    _this.state = {
      place: null
    };

    _this.updateInput = _this.updateInput.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(AutoComplete, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.loaded) {
        var _props = this.props,
            google = _props.google,
            customOptions = _props.customOptions;
        // Try using differnet types options. Or just look at search comp and copy directly

        var options = (0, _extends3.default)({
          types: ['address']
        }, customOptions);
        this.autocomplete = new google.maps.places.Autocomplete(this.input, options);
        this.autocomplete.addListener('place_changed', this.updateInput);
      }
    }
  }, {
    key: 'updateInput',
    value: function updateInput(e) {
      if (!this.props.getValue) {
        console.warn('Use the prop getValue to get the location back from AutoComplete.');
      }
      var place = this.autocomplete.getPlace();
      if (place === this.state.place) place = undefined;
      if (place) {
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
        this.props.getValue(updatedAddress);

        if (place.formatted_address) {
          if (this.props.getValue) {
            this.setState({
              place: place
            });
          }
          return;
        }
        if (place.name) {
          if (this.props.getValue) {
            this.setState({
              place: place
            });
          }
        }
      } else if (!place) {
        if (this.props.getValue) {
          this.props.getValue(e.target.value);
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var updatedInput = (0, _extends3.default)({}, this.props);
      delete updatedInput['getValue'];
      delete updatedInput['google'];
      delete updatedInput['googleApiKey'];
      delete updatedInput['loaded'];

      return _react2.default.createElement('input', (0, _extends3.default)({
        type: this.props.type || 'text',
        ref: function ref(_ref) {
          return _this2.input = _ref;
        },
        className: 'storeLocatorAutocomplete',
        onChange: this.updateInput
      }, updatedInput));
    }
  }]);
  return AutoComplete;
}(_react.Component);

exports.default = (0, _googleMapsReact.GoogleApiWrapper)(function (props) {
  return {
    apiKey: props.googleApiKey
  };
})(AutoComplete);
module.exports = exports['default'];
//# sourceMappingURL=AutoComplete.js.map