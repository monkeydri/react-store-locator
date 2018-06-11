import React, { Component } from 'react'
import { GoogleApiWrapper } from 'google-maps-react'

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
      const { google } = this.props
      this.autocomplete = new google.maps.places.Autocomplete(this.input)
      this.autocomplete.addListener('place_changed', this.updateInput)
    }
  }

  updateInput(e) {
    if (this.props.onChange) {
      this.props.onChange(e)
    }
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
          updatedAddress.address = comp.short_name
        }
        if (comp.types.includes('route')) {
          updatedAddress.address += ` ${comp.short_name}`
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
      if (this.props.getValue) {
        this.props.getValue(e.target.value)
      }
    }
  }

  render() {
    return (
      <input
        type="text"
        ref={ref => (this.input = ref)}
        className="storeLocatorAutocomplete"
        style={this.props.style}
        placeholder={this.props.placeholder}
        onChange={this.updateInput}
        value={this.props.value}
        defaultValue={this.props.defaultValue}
      />
    )
  }
}

export default GoogleApiWrapper(props => ({
  apiKey: props.googleApiKey
}))(AutoComplete)
