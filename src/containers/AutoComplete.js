import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';

class AutoComplete extends Component {
  componentDidMount() {
    if (this.props.loaded) {
      const { google } = this.props;
      const autocomplete = new google.maps.places.Autocomplete(this.input);
      autocomplete.addListener(
        'place_changed',
        function() {
          const place = autocomplete.getPlace();
          if (!place.geometry) {
            alert('No details available for input: ' + place.name + '');
            return;
          }
          if (place) {
            if (this.props.getValue) {
              this.props.getValue(place);
            }
          }
        }.bind(this)
      );
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
      />
    );
  }
}

export default GoogleApiWrapper(props => ({
  apiKey: props.googleApiKey
}))(AutoComplete);
