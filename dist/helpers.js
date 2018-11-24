'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var enableEnterKey = exports.enableEnterKey = function enableEnterKey(input) {
	var originalAddEventListener = input.addEventListener;

	var addEventListenerWrapper = function addEventListenerWrapper(type, listener) {
		if (type === "keydown") {
			var originalListener = listener;
			listener = function listener(event) {
				// 0. get autocomplete div corresponing to input field
				var pacContainer = getAutoCompleteContainer(input);
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
				}

				// 6. sent (original) return key press event
				originalListener.apply(input, [event]);
			};
		}
		originalAddEventListener.apply(input, [type, listener]);
	};

	input.addEventListener = addEventListenerWrapper;
};

var hasId = function hasId(element) {
	if (typeof element.id === 'string') {
		return element.id.length > 0;
	} else return false;
};

var getAutoCompleteContainer = function getAutoCompleteContainer(input) {
	var autocompleteContainers = Array.prototype.filter.call(document.getElementsByClassName('pac-container'), function (autocompleteContainer) {
		return autocompleteContainer.id === input.id;
	});

	if (autocompleteContainers.length === 1) return autocompleteContainers[0];else if (autocompleteContainers.length > 1) console.warn('found more than one corresponding google autcomplete container found');else console.warn('could not find any corresponding google autocomplete container');
};

var tagAutoCompleteContainer = exports.tagAutoCompleteContainer = function tagAutoCompleteContainer(input) {
	var id = (Math.random() + 1).toString(36).substring(7);
	input.id = id;

	// find google autocomplete input which is not tagged yet
	var untaggedAutocompleteContainers = Array.prototype.filter.call(document.getElementsByClassName('pac-container'), function (untaggedAutocompleteContainer) {
		return !hasId(untaggedAutocompleteContainer);
	});

	// tag it (if found only one)
	if (untaggedAutocompleteContainers.length === 1) untaggedAutocompleteContainers[0].id = id;else if (untaggedAutocompleteContainers.length > 1) console.warn('found more than one untagged google autcomplete container');else console.warn('could not find any untagged google autocomplete container');
};
//# sourceMappingURL=helpers.js.map