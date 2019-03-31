'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n\t\tcursor: pointer;\n\t\tborder-radius: 50%;\n\t\t& .pointCount {\n\t\t\tposition: relative;\n\t\t\ttop: 50%;\n\t\t\ttransform: translateY(-50%);\n\t\t\ttext-align: center;\n\t\t\tfont-weight: 600;\n\t\t}\n\t'], ['\n\t\tcursor: pointer;\n\t\tborder-radius: 50%;\n\t\t& .pointCount {\n\t\t\tposition: relative;\n\t\t\ttop: 50%;\n\t\t\ttransform: translateY(-50%);\n\t\t\ttext-align: center;\n\t\t\tfont-weight: 600;\n\t\t}\n\t']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n\t\tbackground: #ffdbdb;\n\t\tborder: 2px solid #ff4c4c;\n\t\tcolor: #ff4c4c;\n\t\theight: 35px;\n\t\twidth: 35px;\n\t'], ['\n\t\tbackground: #ffdbdb;\n\t\tborder: 2px solid #ff4c4c;\n\t\tcolor: #ff4c4c;\n\t\theight: 35px;\n\t\twidth: 35px;\n\t']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n\t\tbackground: #ffedcc;\n\t\tborder: 2px solid #ffa500;\n\t\tcolor: #ffa500;\n\t\theight: 40px;\n\t\twidth: 40px;\n\t'], ['\n\t\tbackground: #ffedcc;\n\t\tborder: 2px solid #ffa500;\n\t\tcolor: #ffa500;\n\t\theight: 40px;\n\t\twidth: 40px;\n\t']),
    _templateObject4 = (0, _taggedTemplateLiteral3.default)(['\n\t\tbackground: #ccffcc;\n\t\tborder: 2px solid #00b200;\n\t\tcolor: #00b200;\n\t\theight: 45px;\n\t\twidth: 45px;\n\t'], ['\n\t\tbackground: #ccffcc;\n\t\tborder: 2px solid #00b200;\n\t\tcolor: #00b200;\n\t\theight: 45px;\n\t\twidth: 45px;\n\t']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _emotion = require('emotion');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ClusterPin = function (_Component) {
	(0, _inherits3.default)(ClusterPin, _Component);

	function ClusterPin() {
		(0, _classCallCheck3.default)(this, ClusterPin);
		return (0, _possibleConstructorReturn3.default)(this, (ClusterPin.__proto__ || Object.getPrototypeOf(ClusterPin)).apply(this, arguments));
	}

	(0, _createClass3.default)(ClusterPin, [{
		key: 'render',
		value: function render() {
			var _props = this.props,
			    point_count = _props.point_count,
			    getZoom = _props.getZoom,
			    cluster_id = _props.cluster_id,
			    lat = _props.lat,
			    lng = _props.lng,
			    updateMap = _props.updateMap;

			var size = point_count > 50 ? 'large' : point_count > 25 ? 'medium' : 'small';
			return _react2.default.createElement(
				'div',
				{
					className: (0, _emotion.cx)(styles.cluster, styles['' + size]),
					onClick: function onClick() {
						updateMap({ zoom: getZoom(cluster_id), center: { lat: lat, lng: lng } });
					}
				},
				_react2.default.createElement(
					'div',
					{ className: 'pointCount' },
					point_count
				)
			);
		}
	}]);
	return ClusterPin;
}(_react.Component);

exports.default = ClusterPin;


var styles = {
	cluster: (0, _emotion.css)(_templateObject),
	small: (0, _emotion.css)(_templateObject2),
	medium: (0, _emotion.css)(_templateObject3),
	large: (0, _emotion.css)(_templateObject4)
};
module.exports = exports['default'];
//# sourceMappingURL=ClusterPin.js.map