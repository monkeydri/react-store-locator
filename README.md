# React Store Locator

Simple google map component used to locate stores within your viewing window. This uses the google-map-react module.

## Getting started

```bash
yarn add react-store-locator

npm install --save react-store-locator
```

Make sure you have yarn installed if you wish to use it

## Usage

```jsx
import StoreLocator from 'react-store-locator';

render(){
  return(
    <StoreLocator.map
      zoom={10}
      center={{ lat: 53, lng: -7.77 }}
      style={{}}
      height={'100vh'}
      width={'100%'}
      markers={markersArr} // --> pass markers array through here
      markerComponent={MarkerComp} // --> pass the marker component here
      markersInBounds={myFunc} // --> pass function here and call it with param of markers , i.e ( myFunc(markers) { console.log(markers)}) This will tell you what markers are in your screen
    />
  )
}
```

Most of these will have defaults if you don't pass anything through. You must pass a marker component in if you wish to see anything on the map.
