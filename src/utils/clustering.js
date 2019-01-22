// import supercluster from 'supercluster'

const createClusters = (
	mapProps,
	markers,
	radius,
	extent,
	nodeSize,
	minZoom,
	maxZoom
) => {
	// const { bounds, zoom } = mapProps
	// const index = new supercluster({
	// 	radius: radius || 40,
	// 	extent: extent || 512,
	// 	nodeSize: nodeSize || 64,
	// 	minZoom: minZoom || 0,
	// 	maxZoom: maxZoom || 16
	// })
	// return index
	// 	.load(
	// 		markers.map(marker => {
	// 			return {
	// 				...marker,
	// 				geometry: { coordinates: [marker.lng, marker.lat] }
	// 			}
	// 		})
	// 	)
	// 	.getClusters(
	// 		[bounds.sw.lng, bounds.sw.lat, bounds.ne.lng, bounds.ne.lat],
	// 		zoom
	// 	)
	// 	.map(cluster =>
	// 		cluster.type === 'Feature'
	// 			? {
	// 					id: cluster.id,
	// 					lat: cluster.geometry.coordinates[1],
	// 					lng: cluster.geometry.coordinates[0],
	// 					point_count: cluster.properties.point_count,
	// 					cluster_id: cluster.properties.cluster_id,
	// 					// onclick to get correct zoom
	// 					getZoom: () =>
	// 						index.getClusterExpansionZoom(cluster.properties.cluster_id)
	// 			  }
	// 			: cluster
	// 	)
	return markers
}

export { createClusters }
