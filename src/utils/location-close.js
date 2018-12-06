import axios from 'axios'
import geolib from 'geolib'

export default async ({ apiKey, query, locations }) => {
	if (!apiKey) {
		console.error(`No Api key provided`)
		return
	}
	if (!query) {
		console.error(`Must provide a query for a location to be found`)
		return
	}
	if (!locations || locations.length < 1) {
		console.error(`You must provide locations in order to find the closest one`)
		return
	}
	let location = null
	const geolocationUrl = await axios({
		method: `get`,
		url: `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${query}|country:US&key=${apiKey}`
	})
	const { data } = geolocationUrl
	const { results } = data
	if (results && results.length > 0) {
		const { geometry } = results[0]
		if (geometry) {
			location = geometry[`location`]
		}
	}

	if (!location) {
		console.error(`No location found by that query, please try again`)
		return
	}

	let updatedLocations = {}
	locations.forEach((loc, i) => {
		if (!loc[`lat`] || !loc[`lng`]) {
			console.warn(
				`${JSON.stringify(
					locations[i]
				)} will be omitted from the search, must have 'lat' and 'lng' fields`
			)
			return
		}
		if (!loc[`id`]) {
			console.warn(`Location must have an id: ${JSON.stringify(locations[i])}`)
			return
		}
		updatedLocations[loc[`id`]] = {
			...loc,
			latitude: loc[`lat`],
			longitude: loc[`lng`]
		}
	})

	if (Object.keys(updatedLocations).length < 1) {
		console.error(`No locations to compare with`)
		return
	}
	const nearestLocation = geolib.findNearest(location, updatedLocations)
	const foundLocation = locations.find(
		loc => loc[`id`] === nearestLocation[`key`]
	)
	if (!foundLocation) {
		console.error(`No nearest location found`)
		return
	}
	return foundLocation
}
