import React, { Component } from 'react'
import { GoogleApiWrapper } from 'google-maps-react'
import { tagAutoCompleteContainer, enableEnterKey } from '../helpers'

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
   let updatedAddress = {}
   place.address_components.map(comp => {
    if (comp.types.includes('postal_code')) {
     updatedAddress.zip = comp.short_name
    }
    if (comp.types.includes('street_number')) {
     updatedAddress.number = comp.short_name
    }
    if (comp.types.includes('route')) {
     updatedAddress.street = comp.short_name
    }
    if (comp.types.includes('locality')) {
     updatedAddress.city = comp.short_name
    }
    if (comp.types.includes('administrative_area_level_1')) {
     updatedAddress.state = comp.short_name
    }
    if (comp.types.includes('country')) {
     updatedAddress.country = comp.short_name
    }
   })
   updatedAddress.place = place;
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
  delete updatedInput['customOptions']

  return (
   <input
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
