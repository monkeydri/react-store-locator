const strToFixed = (str, dec) => {
	return parseFloat(parseFloat(str).toFixed(dec))
}

export { strToFixed }
