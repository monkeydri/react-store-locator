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

var _parsePlace = require('../utils/parse-place');

var _suggestionEvent = require('../utils/suggestion-event');

var _state = require('../state');

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
				(0, _suggestionEvent.enableEnterKey)(this.input, this.autocomplete);
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
				var updatedAddress = (0, _parsePlace.addressFromPlace)(place);

				this.props.getValue(updatedAddress);
				if (place.geometry) {
					_state.mapState.setState({ place: place });
				}
				if (place.formatted_address) {
					if (this.props.getValue) {
						this.setState({ place: place });
					}
					return;
				}
				if (place.name) {
					if (this.props.getValue) {
						this.setState({ place: place });
					}
				}
			} else if (!place) {
				if (this.props.getValue && e) {
					this.props.getValue(e.target.value);
					_state.mapState.setState({ searchInput: e.target.value });
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
			delete updatedInput['customOptions'];

			return _react2.default.createElement('input', (0, _extends3.default)({
				'aria-label': updatedInput.placeholder || updatedInput.name,
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