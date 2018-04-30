import React, { Component } from 'react';
import { fitBounds } from 'google-map-react/utils';
import { mapState } from '../state';
import searchStyle from '../containers/SearchStyle';

function initSearch(google) {
  const input = document.querySelector('.storeLocatorSearchInput');
  const searchBox = new google.maps.places.SearchBox(input);
  searchBox.addListener('places_changed', function() {
    const places = searchBox.getPlaces();
    places.forEach(place => {
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
    });
  });
}

export default props => {
  if (props.maps) {
    initSearch(props);
  }

  return (
    <input
      type="text"
      className="storeLocatorSearchInput"
      placeholder={props.placeholder || 'Enter Your Location'}
      style={props.style || searchStyle.searchInput}
    />
  );
};
