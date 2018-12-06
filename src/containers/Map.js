import React, { Component } from 'react'
import GoogleMap from 'google-map-react'
import { fitBounds } from 'google-map-react/utils'
import geolib from 'geolib'

import Pin from './Pin'
import ClusterPin from './ClusterPin'
import Info from './Info'
import infoStyle from './InfoStyle'
import searchStyle from './SearchStyle'
import { createClusters } from '../utils/clustering'

export default class Map extends Component {
	constructor(props) {
		super(props)

		this.createMapOptions = this.createMapOptions.bind(this)
		this.changeMap = this.changeMap.bind(this)
		this.toggleLocation = this.toggleLocation.bind(this)
		this.closeLocation = this.closeLocation.bind(this)
		this.onPlacesChanged = this.onPlacesChanged.bind(this)
		this.handleMapLoad = this.handleMapLoad.bind(this)

		this.state = {
			updatedLocations: props.locations,
			foundLocations: [],
			center: null,
			zoom: null,
			places: null,
			mapLoaded: false
		}
	}

	changeMap(props) {
		if (!props) return
		const {
			bounds: { ne, nw, se, sw }
		} = props
		const { locations } = this.props
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
		// if clusterMarkers is enabled create clusters and set them to the state
		if (this.props.clusterMarkers) {
			this.setState({
				updatedLocations: createClusters(
					props,
					foundLocations.length > 0 ? foundLocations : locations
				)
			})
		}
		if (!props && !this.state.mapLoaded) return
		foundLocations.map(location => {
			const distanceMeters = geolib.getDistance(props.center, {
				lat: location.lat,
				lng: location.lng
			})
			const distanceMiles = (distanceMeters * 0.000621371).toFixed(2)
			location.distanceFromCenter = distanceMiles
			return { ...location }
		})
		if (!this.props.clusterMarkers) {
			this.setState({ updatedLocations: foundLocations })
		}
		if (this.props.onChange) {
			// this prevents empty array being passed before map has loaded
			if ((props || this.state.mapLoaded) && foundLocations) {
				this.props.onChange(foundLocations)
			}
		}
	}

	toggleLocation(id) {
		const locations = this.state.updatedLocations.map(location => ({
			...location,
			show: location.id === id ? !location.show : false
		}))
		this.setState({ updatedLocations: locations })
	}

	closeLocation(id) {
		const locations = this.state.updatedLocations.map(location => ({
			...location,
			show: false
		}))
		this.setState({ updatedLocations: locations })
	}

	createMapOptions() {
		return {
			styles: this.props.mapStyle
		}
	}

	onPlacesChanged() {
		let places = this.searchBox.getPlaces()
		if (places === this.state.places) places = undefined
		if (places) {
			if (this.props.submitSearch) {
				this.props.submitSearch()
			}
			this.setState({ places })
			if (places.length > 0) {
				const firstLocation = places[0]
				const { geometry } = firstLocation
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
				this.setState({
					center: center,
					zoom: zoom.toString().length > 1 ? 9 : zoom
				})
			}
		}
	}

	componentDidMount() {
		const { google } = this.props
		if (this.props.initSearch) {
			this.searchInput.value = this.props.initSearch
		}
		if (this.searchInput) {
			this.searchBox = new google.maps.places.SearchBox(this.searchInput)
			this.searchBox.addListener('places_changed', this.onPlacesChanged)
		}
		let defaultZoom = 8,
			defaultCenter = { lat: 0, lng: 180 }
		if (
			!this.props.initSearch &&
			(this.props.locations && this.props.locations.length > 0)
		) {
			if (this.props.locations.length === 1) {
				defaultCenter = {
					lat: parseFloat(this.props.locations[0].lat),
					lng: parseFloat(this.props.locations[0].lng)
				}
			}
			if (this.props.locations.length > 1) {
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
		}

		this.setState({
			zoom: defaultZoom,
			center: defaultCenter
		})
	}

	handleMapLoad({ map }) {
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
								bounds.extend(
									new google.maps.LatLng(location.lat, location.lng)
								)
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
		const { updatedLocations, zoom, center } = this.state
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
						onChange={this.onPlacesChanged}
						ref={input => (this.searchInput = input)}
						type="text"
						placeholder="Enter Your Location..."
					/>
				</div>
				<GoogleMap
					// ref={ref => (this.map = ref)}
					onGoogleApiLoaded={this.handleMapLoad}
					yesIWantToUseGoogleMapApiInternals
					center={this.props.center || center}
					zoom={this.props.zoom || zoom}
					options={this.createMapOptions}
					onChange={this.changeMap}
				>
					{updatedLocations.map(location => {
						if (location.cluster_id) {
							return (
								<ClusterPin
									key={location.id}
									lat={location.lat}
									lng={location.lng}
									{...location}
									pinProps={this.props.pin.pinProps || null}
								/>
							)
						}
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
												if (
													k === 'id' ||
													k === 'lat' ||
													k === 'lng' ||
													k === 'show'
												)
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
					})}
				</GoogleMap>
			</div>
		)
	}
}

Map.defaultProps = {
	pin: Pin,
	mapStyle: {},
	height: '800px',
	width: '100%'
}
