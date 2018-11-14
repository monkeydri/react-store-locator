'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _mapMarker = require('react-icons/lib/fa/map-marker');

var _mapMarker2 = _interopRequireDefault(_mapMarker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Pin = function (_Component) {
  (0, _inherits3.default)(Pin, _Component);

  function Pin() {
    (0, _classCallCheck3.default)(this, Pin);
    return (0, _possibleConstructorReturn3.default)(this, (Pin.__proto__ || Object.getPrototypeOf(Pin)).apply(this, arguments));
  }

  (0, _createClass3.default)(Pin, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var styles = {
        mapMarker: {
          cursor: 'pointer',
          background: 'yellow'
        }
      };
      return _react2.default.createElement(
        'div',
        null,
        this.props.children,
        _react2.default.createElement(
          'div',
          {
            style: styles.mapMarker,
            onClick: function onClick() {
              return _this2.props.handleLocationClick(_this2.props.id);
            }
          },
          _react2.default.createElement(_mapMarker2.default, {
            size: 37,
            style: {
              transform: 'translate(-50%, -50%)'
            }
          })
        )
      );
    }
  }]);
  return Pin;
}(_react.Component);

exports.default = Pin;
module.exports = exports['default'];
//# sourceMappingURL=Pin.js.map