const enableEnterKey = (input, autocomplete) => {
	const originalAddEventListener = input.addEventListener

	const addEventListenerWrapper = (type, listener) => {
		if (type === "keydown") {
			const originalListener = listener;
			listener = (event) => {
				// 0. get autocomplete div corresponing to input field
				const pacContainer = getAutoCompleteContainer(autocomplete);
				if (pacContainer) {
					// 1. check if it is visible (check if display property is not 'none')
					const suggestionsVisible = pacContainer.style.display !== 'none';

					// 2. check if one of the suggestions is selected
					const suggestionSelected = pacContainer.getElementsByClassName('pac-item-selected').length > 0;

					// return key press
					if (event.which === 13 || event.keyCode === 13) {

						// when user press enter while no suggestion is selected yet
						if (suggestionsVisible && !suggestionSelected) {
							// 3. make event from original event (copy)
							const arrowDownEvent = JSON.parse(JSON.stringify(event, (k, v) =>
							{
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
						else if (suggestionsVisible && suggestionSelected)
						{
							// 5. preventDefault so form is not submitted
							event.preventDefault();
						}
						// if suggestions not visible do not prevent default (ex submit)
					}
				}
				else console.warn('could not find google autocomplete container'); 

				// 6. send (original) return key press event
				originalListener.apply(input, [event])
			}
		}
		originalAddEventListener.apply(input, [type, listener])
	}

	input.addEventListener = addEventListenerWrapper;
};
 
const getAutoCompleteContainer = (autocomplete) => {
	if (autocomplete && autocomplete.gm_accessors_) {
		const place = autocomplete.gm_accessors_.place;

		const placeKey = Object.keys(place).find((value) => (
			 (typeof(place[value]) === 'object') && (place[value].hasOwnProperty('gm_accessors_'))
		));

		const input = place[placeKey].gm_accessors_.input[placeKey];

		const inputKey = Object.keys(input).find((value) => (
			(input[value].classList && input[value].classList.contains('pac-container'))
		));

		return input[inputKey];
	}
	else console.warn('could not find google autocomplete container : incomplete autocomplete object')
}

export { enableEnterKey }