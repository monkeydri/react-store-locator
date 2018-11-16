import React, { Component } from 'react'
import GoogleMap from 'google-map-react'
import { fitBounds } from 'google-map-react/utils'
import geolib from 'geolib'
import Pin from './Pin'
import Info from './Info'
import GoogleMarker from './GoogleMarker'
import infoStyle from './InfoStyle'
import searchStyle from './SearchStyle'
import { Subscribe } from 'statable'
import { mapState } from '../state'

function findLocationIndex(id, locations) {
 for (let i = locations.length; i--; ) {
  if (locations[i].id === id) {
   return i
  }
 }
 return null
}

function arraysAreIdentical(array1, array2) {
  if (array1.length != array2.length) return false;
  else
  {
   const array2IncludesArray1 = array1.every(element => array2.includes(element));
   const array1IncludesArray2 = array2.every(element => array1.includes(element));
   return array1IncludesArray2 && array2IncludesArray1;
  }
}

export default class Map extends Component {
 constructor(props) {
  super(props)
  this.createMapOptions = this.createMapOptions.bind(this)
  this.changeMap = this.changeMap.bind(this)
  this.toggleLocation = this.toggleLocation.bind(this)
  this.closeLocation = this.closeLocation.bind(this)
  this.onPlaceChanged = this.onPlaceChanged.bind(this)
  this.initCenterMap = this.initCenterMap.bind(this)
  this.checkGoogleMarker = this.checkGoogleMarker.bind(this)
  this.handleMapLoad = this.handleMapLoad.bind(this)

  this.state = {
   locations: [],
   foundLocations: [],
   center: null,
   zoom: null,
   googleMarkers: [],
   place: null,
   googleMarkers: [],
   mapLoaded: false
  }
 }

 checkGoogleMarker() {
  for (let i = this.state.googleMarkers.length; i--; ) {
   // this removes each marker from the map
   this.state.googleMarkers[i].setMap(null)
  }

  this.setState({
   googleMarkers: []
  })
 }

 changeMap(props) {
  if (!this.state.mapLoaded) return
  const {
   bounds: { ne, nw, se, sw }
  } = props
  const { locations } = this.state
  // locations within the map bounds
  const foundLocations = locations.filter(location => {
   if (
    location.lat > se.lat &&
    sw.lat &&
    (location.lat < ne.lat && nw.lat) &&
    (location.lng > nw.lng && sw.lng) &&
    (location.lng < ne.lng && se.lng)
   ) {
    return location
   }
  })
  foundLocations.map(location => {
   const distanceMeters = geolib.getDistance(props.center, {
    lat: location.lat,
    lng: location.lng
   })
   const distanceMiles = (distanceMeters * 0.000621371).toFixed(2)
   location.distanceFromCenter = distanceMiles
   return { ...location }
  })
  this.setState({ foundLocations })
  if (this.props.onChange) {
   // this prevents empty array being passed before map has loaded
   if (this.state.mapLoaded) {
    this.props.onChange(foundLocations)
   } else {
    this.props.onChange(null)
   }
  }
  if (this.props.centerMarker) {
   console.warn('centerMarker will be depreciated in future versions')
   let marker = null
   // check to see if marker already exist at this location for search/center markers
   let createMarker = true

   if (this.state.googleMarkers.length > 0) {
    const newMarker = {
     lat: props.center.lat.toFixed(4),
     lng: props.center.lng.toFixed(4)
    }
    this.state.googleMarkers.forEach(googleMarker => {
     const position = {
      lat: googleMarker.position.lat().toFixed(4),
      lng: googleMarker.position.lng().toFixed(4)
     }
     if (newMarker.lng === position.lng && newMarker.lat === position.lat) {
      createMarker = false
     }
    })
   }
   if (foundLocations.length > 0) {
    foundLocations.forEach(foundLocation => {
     const distance = (
      geolib.getDistance(props.center, {
       lat: foundLocation.lat,
       lng: foundLocation.lng
      }) * 0.000621371
     ).toFixed(2)
     if (distance <= 6.5) {
      createMarker = false
     }
    })
   }
   if (createMarker) {
    marker = GoogleMarker(this.props.centerMarker, this.map, props.center)
   }

   // add the new marker to arr of googleMarkers and remove all other ones
   this.checkGoogleMarker()
   if (marker) {
    // this needs to be done to set the markers to null on the map, removing them
    // from the array will not remove them from the map
    this.setState({
     googleMarkers: [marker]
    })
   }
  }
 }

 toggleLocation(id) {
  const index = findLocationIndex(id, this.state.locations)
  if (index !== null) {
   const locations = this.state.locations
   locations.forEach(item => {
    item.show ? (item.show = false) : (item.show = item.show)
   })
   locations[index].show = !locations[index].show
   this.setState({ locations })
  }
 }

 closeLocation(id) {
  const index = findLocationIndex(id, this.state.locations)
  if (index !== null) {
   const locations = this.state.locations
   locations[index].show = false
   this.setState({ locations })
  }
 }

 createMapOptions(maps) {
  return {
   styles: this.props.mapStyle
  }
 }

 initCenterMap() {
  const { google } = this.props

  const { newBounds } = mapState.state
  let size = {}
  if (this.mapEl) {
   size = {
    width: this.mapEl.offsetWidth,
    height: this.mapEl.offsetHeight
   }
  }

  const { center, zoom } = fitBounds(newBounds, size)

  if (this.props.centerMarker) {
   console.warn('centerMarker will be depreciated in future versions')
   this.checkGoogleMarker()

   const marker = GoogleMarker(this.props.centerMarker, this.map, props.center)
   this.setState({
    googleMarkers: [...this.state.googleMarkers, marker]
   })
  }

  this.setState({
   center: center,
   zoom: zoom.toString().length > 1 ? 9 : zoom
  })
 }

 onPlaceChanged() {
  let place = this.searchBox.getPlace()
  if (place === this.state.place) place = undefined
  if (place) {
   if (this.props.submitSearch) {
    this.props.submitSearch()
   }
   this.setState({ place })
  const { geometry } = place
  const newBounds = {
    ne: {
    lat: geometry.viewport.getNorthEast().lat(),
    lng: geometry.viewport.getNorthEast().lng()
    },
    sw: {
    lat: geometry.viewport.getSouthWest().lat(),
    lng: geometry.viewport.getSouthWest().lng()
    }
  }
  let size = {}
  if (this.mapEl) {
    size = {
    width: this.mapEl.offsetWidth,
    height: this.mapEl.offsetHeight
    }
  }

  const { center, zoom } = fitBounds(newBounds, size)
  if (this.props.centerMarker) {
    console.warn('centerMarker will be depreciated in future versions')
    this.checkGoogleMarker()

    const marker = GoogleMarker(this.props.centerMarker, this.map, center)
    this.setState({
    googleMarkers: [...this.state.googleMarkers, marker]
    })
  }

  this.setState({
    center: center,
    zoom: zoom.toString().length > 1 ? 9 : zoom
  })
  }

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
  if (this.props.getValue) {
    this.props.getValue(updatedAddress)
   }
 }

 updateMap(place) {
  if (place === this.state.place) place = undefined
  if (place) {
  //  if (this.props.submitSearch) {
  //   this.props.submitSearch()
  //  }
   this.setState({ place })
  const { geometry } = place
  const newBounds = {
    ne: {
    lat: geometry.viewport.getNorthEast().lat(),
    lng: geometry.viewport.getNorthEast().lng()
    },
    sw: {
    lat: geometry.viewport.getSouthWest().lat(),
    lng: geometry.viewport.getSouthWest().lng()
    }
  }
  let size = {}
  if (this.mapEl) {
    size = {
    width: this.mapEl.offsetWidth,
    height: this.mapEl.offsetHeight
    }
  }

  const { center, zoom } = fitBounds(newBounds, size)
  if (this.props.centerMarker) {
    console.warn('centerMarker will be depreciated in future versions')
    this.checkGoogleMarker()

    const marker = GoogleMarker(this.props.centerMarker, this.map, center)
    this.setState({
    googleMarkers: [...this.state.googleMarkers, marker]
    })
  }

  this.setState({
    center: center,
    zoom: zoom.toString().length > 1 ? 9 : zoom
  })
  }
 }

 componentDidMount() {
  this.changeMap()

  if (mapState.state) {
   mapState.subscribe(state => {
    if (state.newBounds) {
     this.initCenterMap()
    }
   })
  }

  const { google, options } = this.props
  const input = this.searchInput
  if (this.props.initSearch) {
   input.value = this.props.initSearch
  }
  this.searchBox = new google.maps.places.Autocomplete(this.input, options)
  this.searchBox.addListener('place_changed', this.onPlaceChanged)

  let defaultZoom = 8,
   defaultCenter = { lat: 0, lng: 180 }
  if (
   !this.props.initSearch &&
   (this.props.locations && this.props.locations.length > 0)
  ) {
   const bounds = new google.maps.LatLngBounds()
   this.props.locations.map(location => {
    bounds.extend(new google.maps.LatLng(location.lat, location.lng))
   })
   const newBounds = {
    ne: {
     lat: bounds.getNorthEast().lat(),
     lng: bounds.getNorthEast().lng()
    },
    sw: {
     lat: bounds.getSouthWest().lat(),
     lng: bounds.getSouthWest().lng()
    }
   }
   let size = {}
   if (this.mapEl) {
    size = {
     width: this.mapEl.offsetWidth,
     height: this.mapEl.offsetHeight
    }
   }
   const { center, zoom } = fitBounds(newBounds, size)
   defaultZoom = zoom
   defaultCenter = center
  }

  this.setState({
   locations: this.props.locations,
   zoom: defaultZoom,
   center: defaultCenter
  })
 }

 componentWillUnmount() {
  mapState.unsubscribe()
 }

 componentDidUpdate(prevProps, prevState)
 {
   // update map place changes
   if (prevProps.place !== this.props.place)
   {
     this.updateMap(this.props.place);
   }

   // update locations copy in state
   // get ids of previous and current locations (props)
   const prevLocationsIds = prevProps.locations.map(location => location.id);
   const updatedLocationsIds = this.props.locations.map(location => location.id);
   // check if arrays differs
   if (!arraysAreIdentical(prevLocationsIds,updatedLocationsIds))
   {
     // get any additional locations (that were not in previous props)
     const additionalLocations = this.props.locations.filter(updatedLocation => !prevLocationsIds.includes(updatedLocation.id));
     // add any location 
     const previousAndAdditionalLocations = [...prevProps.locations, ...additionalLocations];
     // remove any location that were in state before and not in updated props
     const updatedLocations = previousAndAdditionalLocations.filter(location => updatedLocationsIds.includes(location.id));
     // update state
     this.setState({ locations: updatedLocations });
   }
 }

 handleMapLoad({ map, maps }) {
  this.map = map
  if (this.props.initSearch) {
   const service = new google.maps.places.PlacesService(map)
   service.findPlaceFromQuery(
    {
     query: this.props.initSearch,
     fields: [
      'photos',
      'formatted_address',
      'name',
      'rating',
      'opening_hours',
      'geometry'
     ]
    },
    (results, status) => {
     const result = results ? results[0] : null
     if (!result || results.length < 1) {
      console.warn('No locations with given query')
      let defaultZoom = 8,
       defaultCenter = { lat: 0, lng: 180 }
      if (this.props.locations && this.props.locations.length > 0) {
       const bounds = new google.maps.LatLngBounds()
       this.props.locations.map(location => {
        bounds.extend(new google.maps.LatLng(location.lat, location.lng))
       })
       const newBounds = {
        ne: {
         lat: bounds.getNorthEast().lat(),
         lng: bounds.getNorthEast().lng()
        },
        sw: {
         lat: bounds.getSouthWest().lat(),
         lng: bounds.getSouthWest().lng()
        }
       }
       let size = {}
       if (this.mapEl) {
        size = {
         width: this.mapEl.offsetWidth,
         height: this.mapEl.offsetHeight
        }
       }
       const { center, zoom } = fitBounds(newBounds, size)
       defaultZoom = zoom
       defaultCenter = center
      }
      this.setState({
       locations: this.props.locations,
       zoom: defaultZoom,
       center: defaultCenter,
       mapLoaded: true
      })
     } else {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
       const { geometry } = result
       const newBounds = {
        ne: {
         lat: geometry.viewport.getNorthEast().lat(),
         lng: geometry.viewport.getNorthEast().lng()
        },
        sw: {
         lat: geometry.viewport.getSouthWest().lat(),
         lng: geometry.viewport.getSouthWest().lng()
        }
       }
       const size = {
        width: this.mapEl.offsetWidth,
        height: this.mapEl.offsetHeight
       }
       const { center, zoom } = fitBounds(newBounds, size)
       this.setState({
        center: center,
        zoom: zoom.toString().length > 1 ? 9 : zoom,
        mapLoaded: true
       })
      }
     }
    }
   )
  }
  if (this.props.mapLoaded) {
   this.props.mapLoaded()
  }
  this.setState({ mapLoaded: true })
 }

 render() {
  let Pin = this.props.pin.component || this.props.pin
  const { foundLocations } = this.state

  const updatedLocations =
   foundLocations.length > 0 ? foundLocations : this.props.locations
  return (
   <div
    style={{
     height: this.props.height,
     width: this.props.width,
     position: 'relative'
    }}
    ref={mapEl => (this.mapEl = mapEl)}
   >
    <div
     style={{
      position: 'absolute',
      top: 5,
      left: 5,
      zIndex: 2
     }}
    >
     <input
      className="storeLocatorInput"
      style={searchStyle.searchInput}
      onChange={this.onPlaceChanged}
      ref={input => (this.searchInput = input)}
      type="text"
      placeholder="Enter Your Location..."
     />
    </div>
    <GoogleMap
     // ref={ref => (this.map = ref)}
     onGoogleApiLoaded={this.handleMapLoad}
     yesIWantToUseGoogleMapApiInternals
     center={this.props.center || this.state.center}
     zoom={this.props.zoom || this.state.zoom}
     options={this.createMapOptions}
     onChange={this.changeMap}
    >
     {Array.isArray(this.props.locations)
      ? updatedLocations.map(location => {
         return (
          <Pin
           key={location.id}
           handleLocationClick={this.toggleLocation}
           lat={location.lat}
           lng={location.lng}
           {...location}
           {...this.props}
           pinProps={this.props.pin.pinProps || null}
          >
           {!this.props.children ? (
            <Info show={location.show} style={this.props.infoStyle}>
             <div style={infoStyle.main}>
              {Object.keys(location).map((k, i) => {
               if (k === 'id' || k === 'lat' || k === 'lng' || k === 'show')
                return
               return (
                <div
                 key={k}
                 style={
                  k === 'name'
                   ? { marginBottom: '12px' }
                   : { marginBottom: '2px' }
                 }
                >
                 {`${location[k]}`}
                </div>
               )
              })}
              <div
               style={infoStyle.close}
               onClick={() => this.closeLocation(location.id)}
              >
               ×
              </div>
             </div>
            </Info>
           ) : (
            this.props.children(location, this.closeLocation)
           )}
          </Pin>
         )
        })
      : console.warn('Locations must be an array of markers')}
    </GoogleMap>
   </div>
  )
 }
}

Map.defaultProps = {
 pin: Pin,
 mapStyle: {},
 height: '800px',
 width: '100%',
 customIcon: {
  path:
   'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
  color: '#FE7569',
  borderColor: '#000'
 }
}
