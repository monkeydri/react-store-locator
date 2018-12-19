const parsePlace = (place) => {
	let updatedAddress = {}
	if (place.address_components) {
		place.address_components.map(comp => {
			if (comp.types.includes('postal_code')) {
				updatedAddress.zip = comp.short_name
			}
			if (comp.types.includes('street_number')) {
				updatedAddress.address = comp.short_name
			}
			if (comp.types.includes('route')) {
				updatedAddress.address
				? (updatedAddress.address += ` ${comp.short_name}`)
				: (updatedAddress.address = comp.short_name)
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
	}
	if (place.formatted_address) {
		updatedAddress.formatted_address = place.formatted_address
	}
	if (place.name) {
		updatedAddress.searchInput = place.name
	}
	updatedAddress.place = place;

	return updatedAddress;
}

export { parsePlace }
