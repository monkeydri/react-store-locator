import React, { Component } from 'react'
import { GoogleApiWrapper } from 'google-maps-react'

import { addressFromPlace } from '../utils/parse-place'
import { enableEnterKey } from '../utils/suggestion-event'
import { mapState } from '../state'

class AutoComplete extends Component {
	constructor(props) {
		super(props)
		this.state = {
			place: null
		}

		this.updateInput = this.updateInput.bind(this)
	}

	componentDidMount() {
		if (this.props.loaded) {
			const { google, customOptions } = this.props
			// Try using differnet types options. Or just look at search comp and copy directly
			const options = {
				types: [`address`],
				...customOptions
			}
			this.autocomplete = new google.maps.places.Autocomplete(
				this.input,
				options
			)
			this.autocomplete.addListener('place_changed', this.updateInput)
			enableEnterKey(this.input, this.autocomplete)
		}
	}

	updateInput(e) {
		if (!this.props.getValue) {
			console.warn(
				'Use the prop getValue to get the location back from AutoComplete.'
			)
		}
		let place = this.autocomplete.getPlace()
		if (place === this.state.place) place = undefined
		if (place) {
			const updatedAddress = addressFromPlace(place)

			this.props.getValue(updatedAddress)
			if (place.geometry) {
				mapState.setState({ place })
			}
			if (place.formatted_address) {
				if (this.props.getValue) {
					this.setState({ place })
				}
				return
			}
			if (place.name) {
				if (this.props.getValue) {
					this.setState({ place })
				}
			}
		} else if (!place) {
			if (this.props.getValue && e) {
				this.props.getValue(e.target.value)
				mapState.setState({ searchInput: e.target.value })
			}
		}
	}

	render() {
		let updatedInput = { ...this.props }
		delete updatedInput['getValue']
		delete updatedInput['google']
		delete updatedInput['googleApiKey']
		delete updatedInput['loaded']
		delete updatedInput['customOptions']

		return (
			<input
				aria-label={updatedInput.placeholder || updatedInput.name}
				type={this.props.type || 'text'}
				ref={ref => (this.input = ref)}
				className="storeLocatorAutocomplete"
				onChange={this.updateInput}
				{...updatedInput}
			/>
		)
	}
}

export default GoogleApiWrapper(props => ({
	apiKey: props.googleApiKey
}))(AutoComplete)
