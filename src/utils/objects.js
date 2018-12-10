const objectsAreEqual = (a, b) => {
	let areEqual = true
	for (let aKey in a) {
		for (let bKey in b) {
			if (!a.hasOwnProperty(bKey)) {
				areEqual = false
				break
			}
			if (!b.hasOwnProperty(aKey)) {
				areEqual = false
				break
			}
			if (a[aKey] !== b[aKey]) {
				areEqual = false
				break
			}
			if (a[bKey] !== b[bKey]) {
				areEqual = false
				break
			}
		}
	}
	return areEqual
}

export { objectsAreEqual }
