function loadScript(src) {
	return new Promise((resolve, reject) => {
		let s
		s = document.createElement(`script`)
		s.src = src
		s.onload = resolve
		s.onerror = reject
		document.body.appendChild(s)
	})
}

export default ({ apiKey, query, locations }) => {
	const geolocationUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=47711`
}
