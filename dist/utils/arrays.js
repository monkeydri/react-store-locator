"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var arraysAreEqual = function arraysAreEqual(array1, array2) {
	var areEqual = true;

	if (array1.length != array2.length) areEqual = false;else {
		var array2IncludesArray1 = array1.every(function (element) {
			return array2.includes(element);
		});
		var array1IncludesArray2 = array2.every(function (element) {
			return array1.includes(element);
		});
		areEqual = array1IncludesArray2 && array2IncludesArray1;
	}
	return areEqual;
};

exports.arraysAreEqual = arraysAreEqual;
//# sourceMappingURL=arrays.js.map