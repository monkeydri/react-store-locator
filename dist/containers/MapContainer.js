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

var _Map = require('./Map');

var _Map2 = _interopRequireDefault(_Map);

var _Search = require('./Search');

var _Search2 = _interopRequireDefault(_Search);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MapContainer = function (_Component) {
  (0, _inherits3.default)(MapContainer, _Component);

  function MapContainer() {
    (0, _classCallCheck3.default)(this, MapContainer);
    return (0, _possibleConstructorReturn3.default)(this, (MapContainer.__proto__ || Object.getPrototypeOf(MapContainer)).apply(this, arguments));
  }

  (0, _createClass3.default)(MapContainer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      (0, _Search2.default)((0, _extends3.default)({}, this.props));
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_Map2.default, this.props);
    }
  }]);
  return MapContainer;
}(_react.Component);

exports.default = (0, _googleMapsReact.GoogleApiWrapper)(function (props) {
  return {
    apiKey: props.googleApiKey
  };
})(MapContainer);
module.exports = exports['default'];
//# sourceMappingURL=MapContainer.js.map