import React, { Component } from 'react';
import { fitBounds } from 'google-map-react/utils';
import { mapState } from '../state';

function initSearch(google, options) {
  const input = document.querySelector('.storeLocatorSearchInput');
  if (input) {
    const searchBox = new google.maps.places.Autocomplete(input);

    searchBox.addListener('place_changed', function() {
      const place = searchBox.getPlace();
      if (place)
      {
        if (!place.geometry) {
          console.warn('Returned place contains no geometry');
          return;
        }

        const { geometry } = place;
        const newBounds = {
          ne: {
            lat: geometry.viewport.getNorthEast().lat(),
            lng: geometry.viewport.getNorthEast().lng()
          },
          sw: {
            lat: geometry.viewport.getSouthWest().lat(),
            lng: geometry.viewport.getSouthWest().lng()
          }
        };
        mapState.setState({ newBounds });
      };
    });
  }
}

export default props => {
  if (props.google) {
    initSearch(props.google);
  }

  return (
    <input
      type="text"
      className="storeLocatorSearchInput"
      placeholder={props.placeholder || 'Enter Your Location'}
      style={props.style || {}}
      onChange={props.onChange}
    />
  );
};
