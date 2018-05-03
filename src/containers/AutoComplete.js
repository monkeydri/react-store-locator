import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';

class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      place: null
    };

    this.updateInput = this.updateInput.bind(this);
  }

  componentDidMount() {
    if (this.props.loaded) {
      const { google } = this.props;
      this.autocomplete = new google.maps.places.Autocomplete(this.input);
      this.autocomplete.addListener('place_changed', this.updateInput);
    }
  }

  updateInput(e) {
    let place = this.autocomplete.getPlace();
    if (place === this.state.place) place = undefined;
    if (place) {
      if (place.formatted_address) {
        if (this.props.getValue) {
          this.props.getValue(place.formatted_address);
          this.setState({
            place: place
          });
        }
        return;
      }
      if (place.name) {
        if (this.props.getValue) {
          this.props.getValue(place.name);
          this.setState({
            place: place
          });
        }
      }
    } else if (!place) {
      this.props.getValue(e.target.value);
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
      />
    );
  }
}

export default GoogleApiWrapper(props => ({
  apiKey: props.googleApiKey
}))(AutoComplete);
