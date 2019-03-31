"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var objectsAreEqual = function objectsAreEqual(a, b) {
	var areEqual = true;
	if (a === null && b !== null) {
		areEqual = false;
	}
	if (a !== null && b === null) {
		areEqual = false;
	}
	for (var aKey in a) {
		for (var bKey in b) {
			if (!a.hasOwnProperty(bKey)) {
				areEqual = false;
				break;
			}
			if (!b.hasOwnProperty(aKey)) {
				areEqual = false;
				break;
			}
			if (a[aKey] !== b[aKey]) {
				areEqual = false;
				break;
			}
			if (a[bKey] !== b[bKey]) {
				areEqual = false;
				break;
			}
		}
	}
	return areEqual;
};

exports.objectsAreEqual = objectsAreEqual;
//# sourceMappingURL=objects.js.map