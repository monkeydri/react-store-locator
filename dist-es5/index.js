'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_React$Component) {
	_inherits(_class, _React$Component);

	function _class(props) {
		_classCallCheck(this, _class);

		var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

		_this.state = { loading: false };
		_this.hideLoader = _this.hideLoader.bind(_this);
		_this.showLoader = _this.showLoader.bind(_this);
		_this.startTimeout = _this.startTimeout.bind(_this);
		return _this;
	}

	_createClass(_class, [{
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps() {
			this.startTimeout();
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			if (this.img.complete) {
				this.hideLoader();
			} else {
				this.startTimeout();
			}
		}
	}, {
		key: 'startTimeout',
		value: function startTimeout() {
			clearTimeout(this.timeout);
			this.timeout = setTimeout(this.showLoader, 100);
		}
	}, {
		key: 'showLoader',
		value: function showLoader() {
			if (!this.img.complete) {
				this.setState({ loading: true });
			}
		}
	}, {
		key: 'hideLoader',
		value: function hideLoader() {
			clearTimeout(this.timeout);
			this.setState({ loading: false });
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var TagName = this.props.tagName || 'img';
			return _react2.default.createElement(
				'div',
				{ style: {
						maxWidth: this.props.width,
						maxHeight: this.props.height,
						margin: this.props.center ? 'auto' : ''
					} },
				_react2.default.createElement(
					'div',
					{ style: {
							position: 'relative',
							paddingBottom: this.props.height / this.props.width * 100 + '%'
						} },
					_react2.default.createElement(TagName, {
						type: this.props.type,
						srcSet: this.props.srcSet,
						sizes: this.props.sizes,
						src: this.props.src,
						ref: function ref(img) {
							return _this2.img = img;
						},
						onLoad: this.hideLoader,
						onError: this.hideLoader,
						alt: this.props.alt,
						style: {
							position: 'absolute',
							width: '100%',
							maxWidth: '100%',
							top: 0,
							left: 0,
							display: this.state.loading ? 'none' : 'block'
						}
					}),
					this.state.loading && this.props.loading && _react2.default.createElement(
						'div',
						{ style: {
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)'
							} },
						this.props.loading
					)
				)
			);
		}
	}]);

	return _class;
}(_react2.default.Component);

exports.default = _class;