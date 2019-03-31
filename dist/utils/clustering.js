'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.createClusters = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _supercluster = require('./supercluster');

var _supercluster2 = _interopRequireDefault(_supercluster);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createClusters = function createClusters(mapProps, markers, radius, extent, nodeSize, minZoom, maxZoom) {
	var bounds = mapProps.bounds,
	    zoom = mapProps.zoom;

	var index = new _supercluster2.default({
		radius: radius || 40,
		extent: extent || 512,
		nodeSize: nodeSize || 64,
		minZoom: minZoom || 0,
		maxZoom: maxZoom || 16
	});
	return index.load(markers.map(function (marker) {
		return (0, _extends3.default)({}, marker, {
			geometry: { coordinates: [marker.lng, marker.lat] }
		});
	})).getClusters([bounds.sw.lng, bounds.sw.lat, bounds.ne.lng, bounds.ne.lat], zoom).map(function (cluster) {
		return cluster.type === 'Feature' ? {
			id: cluster.id,
			lat: cluster.geometry.coordinates[1],
			lng: cluster.geometry.coordinates[0],
			point_count: cluster.properties.point_count,
			cluster_id: cluster.properties.cluster_id,
			// onclick to get correct zoom
			getZoom: function getZoom() {
				return index.getClusterExpansionZoom(cluster.properties.cluster_id);
			}
		} : cluster;
	});
};

exports.createClusters = createClusters;
//# sourceMappingURL=clustering.js.map