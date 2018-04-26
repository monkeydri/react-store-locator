# React Store Locator

## Short Description

This module is used for when you have a list of stores/dealers that you wish to put on a map and show information about each store/dealer.

## Getting started

```bash
yarn add react-store-locator

npm install --save react-store-locator
```

Make sure you have yarn installed if you wish to use it

## Usage

### Basic

```jsx
import { Map } from 'react-store-locator';

render(){
  const dealers = [
    {
    id: 1,
    lat: 50,
    lng: 25.1,
    show: false,
    name: 'First Marker'
  },
  {
    id: 2,
    lat: 50,
    lng: 25.2,
    show: true,
    name: 'Second Marker'
  },
  {
    id: 3,
    lat: 50,
    lng: 25.3,
    show: false,
    name: 'Third Marker'
  }
  ]
  return(
    <Map dealers={dealers}/>
  )
}
```

Default map:

![defaultMap](defaultMap.png)

This will show a map with default markers and default info windows.

You will need to include all of these props for a minimum for each of your stores/dealers. If you wish your information to `show` by default then set `show` to true otherwise set `show` to false.

By default the map will have a height of 800px and width of 100%. You can change these by passing through these values as props.

```jsx
//...
<Map height={'1000px'} width={'800px'}>
```

### Start customizing

You can add your own custom pin and information window. Examples below.

#### Pin

Adding your own pin is super easy and with little set up you can have an awesome looking pin.

We will pass through a function called `handleDealerClick` through props. If you wish to use the toggle feature for the `Info` window you will want to attach this to the parent element of your pin. If you wish for only a certain part of your pin to work then add it to that element. Make sure you pass through the id so the correct window will be toggled.

You will also need to pass through the children through the inside of your component, this way you can render the `Info` component. Style this component however you like or add an image instead.

Make sure you include the function `handleDealerClick` and pass through `id`.

Note: If you are using a class based component then you will use `this.props...` instead.

```jsx
//...
const myPin = (props) => (
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

<Map dealers={dealers} pin={myPin}>
```

Custom Pin:

![customPin](customPin.png)

#### Info

```jsx
import { Info } from 'react-store-locator';

//...

return (
  <Map dealers={dealers}>
    {(dealer, closeDealer) => {
      return (
        <Info show={dealer.show}>
          <div style={{ background: 'red' }}>
            {dealer.name}
            <div onClick={() => closeDealer(dealer.id)}>[x]</div>
          </div>
        </Info>
      );
    }}
  </Map>
);
```

`closeDealer` is a function that you must call on whatever you wish to close the `Info` window. Above we wrap `[x]` inside a div and apply an onClick to this div. When you click this it will close the `Info` window. We recommend adding a style of `cursor`: `pointer` to this element as well to make it more obvious that it does close the `Info` window.

You must pass `show` prop through the `Info` component if you want your info window to work correctly. Pass any jsx through the `Info` tag and it will be displayed. There you can style this however you wish.

Without any styles:

![customInfo](customInfo.png)

With styles:

![customInfoRed](customInfoRed.png)

If you want to change the size of the window itself please pass through a style object through as a prop into `Info`. The style prop of the `Info` window will take four props.

```jsx
//...
const infoStyle = {
  width: '150px',
  height: '30px',
  backgroundColor: 'yellow',
  pinWidth: 25  // width of your pin to help center Info window - Don't add if you aren't passing through a pin
}
<Info show={dealer.show} style={infoStyle}>
// Content here
</Info>


// If not using custom Info component

<Map dealers={dealers} infoStyle={infoStyle} />
```

## Other Features included

### Search

There will be a custom search bar to search your map. This will recenter and zoom the map to what location you search. It will place a google marker that you can customize you like on your current location.

Note: on map load there will not be a current location marker until you search, also when you search a new location your old marker will disappear.

### Adding Map styles

You can pass through map style like so. This uses a JSON object from https://mapstyle.withgoogle.com/. You can go here and copy and paste this through the `mapStyle` prop.

```jsx
<Map mapStyle={mapStyleObject} />
```

### Grabing stores/dealers within window

This is a feature that is very useful when wanting to get information about the dealers in your current window.

You will pass through a function through the `onChange` props and pass through `dealers` as param. The function will be called on map load and any other time you move the map.

Note: If you cover part of your map this will still count markers that you may end up covering. If this is the case, it would be best to resize your map instead.

```jsx
//...

onChange(dealers) {
 console.log(dealers) // dealers inside of current window
}

<Map onChange={this.onChange}>
```
