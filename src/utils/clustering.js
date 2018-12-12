import supercluster from 'supercluster'

const createClusters = (mapProps, markers) => {
	const { bounds, zoom } = mapProps
	const index = new supercluster({
		radius: 60,
		extent: 256,
		nodeSize: 256
	})
	return index
		.load(
			markers.map(marker => {
				return {
					...marker,
					geometry: { coordinates: [marker.lng, marker.lat] }
				}
			})
		)
		.getClusters(
			[bounds.nw.lng, bounds.se.lat, bounds.se.lng, bounds.nw.lat],
			zoom
		)
		.map(cluster =>
			cluster.type === 'Feature'
				? {
						id: cluster.id,
						lat: cluster.geometry.coordinates[1],
						lng: cluster.geometry.coordinates[0],
						point_count: cluster.properties.point_count,
						cluster_id: cluster.properties.cluster_id,
						// onclick to get correct zoom
						getZoom: () =>
							index.getClusterExpansionZoom(cluster.properties.cluster_id)
				  }
				: cluster
		)
}

export { createClusters }
