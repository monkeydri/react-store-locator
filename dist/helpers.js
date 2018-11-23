'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (input) {
	var originalAddEventListener = input.addEventListener;

	var addEventListenerWrapper = function addEventListenerWrapper(type, listener) {
		if (type === "keydown") {
			var originalListener = listener;
			listener = function listener(event) {
				var pacContainerArray = document.getElementsByClassName('pac-container');
				// const suggestionsVisible = pacContainerArray.length > 0 ? pacContainerArray[0].offsetWidth > 0 : false;
				var suggestionsVisible = pacContainerArray.length > 0 ? pacContainerArray[0].style.display !== 'none' : false;
				var suggestionSelected = document.getElementsByClassName('pac-item-selected').length > 0;

				// enter key press
				if (event.which === 13 || event.keyCode === 13) {
					// user press enter while no suggestion is selected yet : auto-select first one (using fake arrow key) then it will be choosen by enter key press. preventDefault so form is not submitted
					if (suggestionsVisible && !suggestionSelected) {
						// make event from original event (copy)
						var arrowDownEvent = JSON.parse(JSON.stringify(event, function (k, v) {
							if (v instanceof Node) return 'Node';
							if (v instanceof Window) return 'Window';
							return v;
						}, ' '));
						arrowDownEvent.which = 40;
						arrowDownEvent.keyCode = 40;

						// send arrow down key press event (add simulated event) before return press)
						originalListener.apply(input, [arrowDownEvent]);

						event.preventDefault();
					}

					// suggestion is already selected (by arrow key) and user presses enter to choose it. preventDefault so form is not submitted
					else if (suggestionsVisible && suggestionSelected) {
							event.preventDefault();
						}
					// else if suggestions not visible do not prevent default (ex submit)
				}

				// sent (original) return key press event/
				originalListener.apply(input, [event]);
			};
		}
		originalAddEventListener.apply(input, [type, listener]);
	};

	input.addEventListener = addEventListenerWrapper;
};

module.exports = exports['default'];
//# sourceMappingURL=helpers.js.map