import React, { Component } from 'react';
import { fitBounds } from 'google-map-react/utils';
import { mapState } from '../state';

function initSearch(google, options, getValue) {
  const input = document.querySelector('.storeLocatorSearchInput');
  if (input) {
    const searchBox = new google.maps.places.Autocomplete(input, options);

    searchBox.addListener('place_changed', function() {
      const place = searchBox.getPlace();
      if (place) {
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
        updatedAddress.place = place;
        if (getValue) {
          getValue(updatedAddress)
        }
      }
    });
  }
}

export default props => {
  if (props.google) {
    initSearch(props.google, props.options || {}, props.getValue);
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
