'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.enableEnterKey = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var enableEnterKey = function enableEnterKey(input, autocomplete) {
	var originalAddEventListener = input.addEventListener;

	var addEventListenerWrapper = function addEventListenerWrapper(type, listener) {
		if (type === "keydown") {
			var originalListener = listener;
			listener = function listener(event) {
				// 0. get autocomplete div corresponing to input field
				var pacContainer = getAutoCompleteContainer(autocomplete);
				if (pacContainer) {
					// 1. check if it is visible (check if display property is not 'none')
					var suggestionsVisible = pacContainer.style.display !== 'none';

					// 2. check if one of the suggestions is selected
					var suggestionSelected = pacContainer.getElementsByClassName('pac-item-selected').length > 0;

					// return key press
					if (event.which === 13 || event.keyCode === 13) {

						// when user press enter while no suggestion is selected yet
						if (suggestionsVisible && !suggestionSelected) {
							// 3. make event from original event (copy)
							var arrowDownEvent = JSON.parse(JSON.stringify(event, function (k, v) {
								if (v instanceof Node) return 'Node';
								if (v instanceof Window) return 'Window';
								return v;
							}, ' '));
							// fake arrow down event to auto-select first suggestion (it will then be choosen by return down event)
							arrowDownEvent.which = 40;
							arrowDownEvent.keyCode = 40;

							// 4. send arrow down key press event (add simulated event) before return press
							originalListener.apply(input, [arrowDownEvent]);

							// 5. preventDefault so form is not submitted
							event.preventDefault();
						}

						// when suggestion is already selected (by arrow key) and user presses return to choose it
						else if (suggestionsVisible && suggestionSelected) {
								// 5. preventDefault so form is not submitted
								event.preventDefault();
							}
						// if suggestions not visible do not prevent default (ex submit)
					}
				} else console.warn('could not find google autocomplete container');

				// 6. send (original) return key press event
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

exports.enableEnterKey = enableEnterKey;
//# sourceMappingURL=suggestion-event.js.map