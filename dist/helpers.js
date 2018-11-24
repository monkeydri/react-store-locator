'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.enableEnterKey = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var enableEnterKey = exports.enableEnterKey = function enableEnterKey(input, autocomplete) {
	var originalAddEventListener = input.addEventListener;

	var addEventListenerWrapper = function addEventListenerWrapper(type, listener) {
		if (type === "keydown") {
			var originalListener = listener;
			listener = function listener(event) {
				// 0. get autocomplete div corresponing to input field
				var pacContainer = getAutoCompleteContainer(autocomplete);
				if (pacContainer) {
					// 1. check if it is visible
					// WAY 1 : check size > 0 (like jQuery isVisible() does) const suggestionsVisible = pacContainerArray.length > 0 ? pacContainerArray[0].offsetWidth > 0 : false;
					// WAY 2 : check if display property is not 'none'
					var suggestionsVisible = pacContainer.style.display !== 'none';
					// WAY 3 : check if it has children

					// 2. check if one of the suggestions is selected
					var suggestionSelected = pacContainer.getElementsByClassName('pac-item-selected').length > 0;

					// enter key press
					if (event.which === 13 || event.keyCode === 13) {
						// user press enter while no suggestion is selected yet : auto-select first one (using fake arrow key) then it will be choosen by enter key press. preventDefault so form is not submitted
						if (suggestionsVisible && !suggestionSelected) {
							// 3. make event from original event (copy)
							var arrowDownEvent = JSON.parse(JSON.stringify(event, function (k, v) {
								if (v instanceof Node) return 'Node';
								if (v instanceof Window) return 'Window';
								return v;
							}, ' '));
							arrowDownEvent.which = 40;
							arrowDownEvent.keyCode = 40;

							// 4. send arrow down key press event (add simulated event) before return press)
							originalListener.apply(input, [arrowDownEvent]);

							// 5.
							event.preventDefault();
						}

						// suggestion is already selected (by arrow key) and user presses enter to choose it. preventDefault so form is not submitted
						else if (suggestionsVisible && suggestionSelected) {
								// 5.
								event.preventDefault();
							}
						// else if suggestions not visible do not prevent default (ex submit)
					}
				} else console.warn('could not find google autocomplete container');

				// 6. sent (original) return key press event
				originalListener.apply(input, [event]);
			};
		}
		originalAddEventListener.apply(input, [type, listener]);
	};

	input.addEventListener = addEventListenerWrapper;
};

var getAutoCompleteContainer = function getAutoCompleteContainer(autocomplete) {
	if (autocomplete && autocomplete.gm_accessors_) {
		var place = autocomplete.gm_accessors_.place;

		var placeKey = Object.keys(place).find(function (value) {
			return (0, _typeof3.default)(place[value]) === 'object' && place[value].hasOwnProperty('gm_accessors_');
		});

		var input = place[placeKey].gm_accessors_.input[placeKey];

		var inputKey = Object.keys(input).find(function (value) {
			return input[value].classList && input[value].classList.contains('pac-container');
		});

		return input[inputKey];
	} else console.warn('could not find google autocomplete container : incomplete autocomplete object');
};
//# sourceMappingURL=helpers.js.map