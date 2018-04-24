import React from 'react';
import { render } from 'react-dom';
import Map from '../src/containers/Map';
import Marker from '../src/containers/Marker';
import axios from 'axios';

const containerEl = document.createElement('div');
document.body.appendChild(containerEl);

const markers = [
  {
    id: 1,
    lat: 53,
    lng: -7.77,
    show: true,
    name: 'First Marker'
  },
  {
    id: 2,
    lat: 53.1,
    lng: -7.77,
    show: true,
    name: 'Second Marker'
  },
  {
    id: 3,
    lat: 53.2,
    lng: -7.77,
    show: true,
    name: 'Third Marker'
  }
];

const markersInBounds = markers => {
  console.log('Markers inside bounds --> ', markers);
};

render(
  <div style={{ height: '100vh', width: '100%' }}>
    <Map
      zoom={10}
      center={{ lat: 53, lng: -7.77 }}
      style={{}}
      height={'100vh'}
      width={'100%'}
      markers={markers}
      markerComponent={Marker}
      markersInBounds={markersInBounds}
    />
  </div>,
  containerEl
);
