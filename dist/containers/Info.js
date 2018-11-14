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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Info = function (_Component) {
  (0, _inherits3.default)(Info, _Component);

  function Info(props) {
    (0, _classCallCheck3.default)(this, Info);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Info.__proto__ || Object.getPrototypeOf(Info)).call(this, props));

    _this.state = {
      style: {
        width: '175px',
        height: 'auto',
        backgroundColor: '#fff'
      }
    };
    return _this;
  }

  (0, _createClass3.default)(Info, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var width = this.props.style.width || this.state.style.width;
      var height = this.props.style.height || this.state.style.height;
      var backgroundColor = this.props.style.backgroundColor || this.state.style.backgroundColor;

      return this.props.show ? _react2.default.createElement(
        'div',
        {
          onClick: function onClick(e) {
            return e.stopPropagation();
          },
          style: {
            cursor: 'default',
            fontSize: '1em',
            backgroundColor: backgroundColor,
            width: width,
            height: height,
            overflow: 'hidden',
            transform: 'translate(-50%, -100%)',
            position: 'absolute',
            marginTop: '-20px',
            zIndex: 4
          },
          ref: function ref(el) {
            return _this2.infoDiv = el;
          }
        },
        this.props.children
      ) : null;
    }
  }]);
  return Info;
}(_react.Component);

exports.default = Info;


Info.defaultProps = {
  style: {
    width: '175px',
    height: 'auto',
    backgroundColor: '#fff'
  }
};
module.exports = exports['default'];
//# sourceMappingURL=Info.js.map