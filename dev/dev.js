import React from 'react'
import { render } from 'react-dom'
import Map from '../src/containers/MapContainer'
import AutoComplete from '../src/containers/AutoComplete'
import Search from '../src/containers/Search'
import Info from '../src/containers/Info'
import Marker from './Marker'
const markerIcon =
  'https://cdn2.iconfinder.com/data/icons/IconsLandVistaMapMarkersIconsDemo/256/MapMarker_PushPin_Right_Chartreuse.png'
const containerEl = document.createElement('div')
document.body.appendChild(containerEl)
const number = 5
let dealers = []
for (let i = number; i--; ) {
  const dealer = {
    id: i,
    lat: Math.random() * 10,
    lng: Math.random() * 100,
    show: false,
    name: `Marker ${i}`,
    address: '949 Tulip Ave.',
    city: 'Evansville',
    state: 'Indiana'
  }
  dealers.push(dealer)
}

const myPin = props => {
  return (
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
  )
}

const getDealers = dealers => {
  // console.log(dealers);
}
function myFunc(value) {
  // console.log(value)
}
render(
  <div>
    <AutoComplete
      getValue={myFunc}
      googleApiKey={'AIzaSyD2pAEWs2VMApgeuoNhy3dJoPWDvMOm49Y'}
      value={'hello'}
    />
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
)
