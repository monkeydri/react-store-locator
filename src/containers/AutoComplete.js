import React, { Component } from 'react'
import { GoogleApiWrapper } from 'google-maps-react'

import { parsePlace } from '../utils/parse-place'
import { tagAutoCompleteContainer, enableEnterKey } from '../utils/suggestion-event'

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
   this.autocomplete = new google.maps.places.Autocomplete(this.input, options)
   this.autocomplete.addListener('place_changed', this.updateInput)
   enableEnterKey(this.input);
   tagAutoCompleteContainer(this.input); 
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
   const updatedAddress = parsePlace(place)

   this.props.getValue(updatedAddress)

   if (place.formatted_address) {
    if (this.props.getValue) {
     this.setState({
      place: place
     })
    }
    return
   }
   if (place.name) {
    if (this.props.getValue) {
     this.setState({
      place: place
     })
    }
   }
  } else if (!place) {
   if (this.props.getValue && e) {
    this.props.getValue(e.target.value)
   }
  }
 }

 render() {
  let updatedInput = { ...this.props }
  delete updatedInput['getValue']
  delete updatedInput['google']
  delete updatedInput['googleApiKey']
  delete updatedInput['loaded']

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
