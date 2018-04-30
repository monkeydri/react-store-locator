import React from 'react';
import { render } from 'react-dom';
import Map from '../src/containers/MapContainer';
import Search from '../src/containers/Search';
import Info from '../src/containers/Info';
import Marker from './Marker';
const markerIcon =
  'https://cdn2.iconfinder.com/data/icons/IconsLandVistaMapMarkersIconsDemo/256/MapMarker_PushPin_Right_Chartreuse.png';
const containerEl = document.createElement('div');
document.body.appendChild(containerEl);

const dealers = [
  {
    id: 1,
    lat: 37.9,
    lng: -87.7,
    show: false,
    name: 'First Marker'
  },
  {
    id: 2,
    lat: 37.9,
    lng: -87.3,
    show: false,
    name: 'Second Marker'
  },
  {
    id: 3,
    lat: 37.9,
    lng: -87.5,
    show: true,
    name: 'Third Marker'
  }
];

const myPin = props => (
  <div
    style={{
      cursor: 'pointer',
      backgroundColor: 'purple',
      height: '25px',
      width: '25px',
      border: '2px solid white'
    }}
    onClick={() => props.handleDealerClick(props.id)}
  >
    {props.children}
  </div>
);

const getDealers = dealers => {
  // console.log(dealers);
};

render(
  <div>
    {/* <Search placeholder={'Fly to this location'} /> */}
    <Map
      // pin={myPin}
      dealers={dealers}
      googleApiKey={'AIzaSyCl5euNmDvFzhI7sNxXj7GdYC6lOALQGZE'}
      googleMapIcon={markerIcon}
      customIcon={{ color: 'red', borderColor: 'blue' }}
      onChange={getDealers}
      initSearch={'47711'}
    >
      {(dealer, closeDealer) => {
        return (
          <Info show={dealer.show} style={{ width: '15rem', fontSize: '1rem' }}>
            <div style={{ background: 'red', fontSize: '1rem' }}>
              {dealer.name}
              <div onClick={() => closeDealer(dealer.id)}>[x]</div>
            </div>
            <div>red</div>
            <div>red</div>
            <div>red</div>
            <div>red</div>
            <div>redß</div>
          </Info>
        );
      }}
    </Map>
    <style>{`
    .storeLocatorSearchInput {
      width: 300px;
      height: 40px;
      background: #fff;
      font-size: 16px;
      border: 1px solid #444;
      outline: none;
      text-align: center;
    }
    `}</style>
  </div>,
  containerEl
);
