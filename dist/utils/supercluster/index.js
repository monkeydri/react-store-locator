'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Forked to remove KDBush dependency in order to make backward compatible with ie11 */
// import KDBush from 'kdbush';

var defaultOptions = {
    minZoom: 0, // min zoom to generate clusters on
    maxZoom: 16, // max zoom level to cluster the points on
    radius: 40, // cluster radius in pixels
    extent: 512, // tile extent (radius is calculated relative to it)
    nodeSize: 64, // size of the KD-tree leaf node, affects performance
    log: false, // whether to log timing info

    // a reduce function for calculating custom cluster properties
    reduce: null, // (accumulated, props) => { accumulated.sum += props.sum; }

    // properties to use for individual points when running the reducer
    map: function map(props) {
        return props;
    } // props => ({sum: props.my_value})
};

var Supercluster = function () {
    function Supercluster(options) {
        (0, _classCallCheck3.default)(this, Supercluster);

        this.options = extend(Object.create(defaultOptions), options);
        this.trees = new Array(this.options.maxZoom + 1);
    }

    (0, _createClass3.default)(Supercluster, [{
        key: 'load',
        value: function load(points) {
            var _options = this.options,
                log = _options.log,
                minZoom = _options.minZoom,
                maxZoom = _options.maxZoom,
                nodeSize = _options.nodeSize;


            if (log) console.time('total time');

            var timerId = 'prepare ' + points.length + ' points';
            if (log) console.time(timerId);

            this.points = points;

            // generate a cluster object for each point and index input points into a KD-tree
            var clusters = [];
            for (var i = 0; i < points.length; i++) {
                if (!points[i].geometry) continue;
                clusters.push(createPointCluster(points[i], i));
            }
            this.trees[maxZoom + 1] = new window.KDBush(clusters, getX, getY, nodeSize, Float32Array);

            if (log) console.timeEnd(timerId);

            // cluster points on max zoom, then cluster the results on previous zoom, etc.;
            // results in a cluster hierarchy across zoom levels
            for (var z = maxZoom; z >= minZoom; z--) {
                var now = +Date.now();

                // create a new set of clusters for the zoom and index them with a KD-tree
                clusters = this._cluster(clusters, z);
                this.trees[z] = new window.KDBush(clusters, getX, getY, nodeSize, Float32Array);

                if (log) console.log('z%d: %d clusters in %dms', z, clusters.length, +Date.now() - now);
            }

            if (log) console.timeEnd('total time');

            return this;
        }
    }, {
        key: 'getClusters',
        value: function getClusters(bbox, zoom) {
            var minLng = ((bbox[0] + 180) % 360 + 360) % 360 - 180;
            var minLat = Math.max(-90, Math.min(90, bbox[1]));
            var maxLng = bbox[2] === 180 ? 180 : ((bbox[2] + 180) % 360 + 360) % 360 - 180;
            var maxLat = Math.max(-90, Math.min(90, bbox[3]));

            if (bbox[2] - bbox[0] >= 360) {
                minLng = -180;
                maxLng = 180;
            } else if (minLng > maxLng) {
                var easternHem = this.getClusters([minLng, minLat, 180, maxLat], zoom);
                var westernHem = this.getClusters([-180, minLat, maxLng, maxLat], zoom);
                return easternHem.concat(westernHem);
            }

            var tree = this.trees[this._limitZoom(zoom)];
            var ids = tree.range(lngX(minLng), latY(maxLat), lngX(maxLng), latY(minLat));
            var clusters = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = ids[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var id = _step.value;

                    var c = tree.points[id];
                    clusters.push(c.numPoints ? getClusterJSON(c) : this.points[c.index]);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return clusters;
        }
    }, {
        key: 'getChildren',
        value: function getChildren(clusterId) {
            var originId = clusterId >> 5;
            var originZoom = clusterId % 32;
            var errorMsg = 'No cluster with the specified id.';

            var index = this.trees[originZoom];
            if (!index) throw new Error(errorMsg);

            var origin = index.points[originId];
            if (!origin) throw new Error(errorMsg);

            var r = this.options.radius / (this.options.extent * Math.pow(2, originZoom - 1));
            var ids = index.within(origin.x, origin.y, r);
            var children = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = ids[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var id = _step2.value;

                    var c = index.points[id];
                    if (c.parentId === clusterId) {
                        children.push(c.numPoints ? getClusterJSON(c) : this.points[c.index]);
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            if (children.length === 0) throw new Error(errorMsg);

            return children;
        }
    }, {
        key: 'getLeaves',
        value: function getLeaves(clusterId, limit, offset) {
            limit = limit || 10;
            offset = offset || 0;

            var leaves = [];
            this._appendLeaves(leaves, clusterId, limit, offset, 0);

            return leaves;
        }
    }, {
        key: 'getTile',
        value: function getTile(z, x, y) {
            var tree = this.trees[this._limitZoom(z)];
            var z2 = Math.pow(2, z);
            var _options2 = this.options,
                extent = _options2.extent,
                radius = _options2.radius;

            var p = radius / extent;
            var top = (y - p) / z2;
            var bottom = (y + 1 + p) / z2;

            var tile = {
                features: []
            };

            this._addTileFeatures(tree.range((x - p) / z2, top, (x + 1 + p) / z2, bottom), tree.points, x, y, z2, tile);

            if (x === 0) {
                this._addTileFeatures(tree.range(1 - p / z2, top, 1, bottom), tree.points, z2, y, z2, tile);
            }
            if (x === z2 - 1) {
                this._addTileFeatures(tree.range(0, top, p / z2, bottom), tree.points, -1, y, z2, tile);
            }

            return tile.features.length ? tile : null;
        }
    }, {
        key: 'getClusterExpansionZoom',
        value: function getClusterExpansionZoom(clusterId) {
            var clusterZoom = clusterId % 32 - 1;
            while (clusterZoom <= this.options.maxZoom) {
                var children = this.getChildren(clusterId);
                clusterZoom++;
                if (children.length !== 1) break;
                clusterId = children[0].properties.cluster_id;
            }
            return clusterZoom;
        }
    }, {
        key: '_appendLeaves',
        value: function _appendLeaves(result, clusterId, limit, offset, skipped) {
            var children = this.getChildren(clusterId);

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var child = _step3.value;

                    var props = child.properties;

                    if (props && props.cluster) {
                        if (skipped + props.point_count <= offset) {
                            // skip the whole cluster
                            skipped += props.point_count;
                        } else {
                            // enter the cluster
                            skipped = this._appendLeaves(result, props.cluster_id, limit, offset, skipped);
                            // exit the cluster
                        }
                    } else if (skipped < offset) {
                        // skip a single point
                        skipped++;
                    } else {
                        // add a single point
                        result.push(child);
                    }
                    if (result.length === limit) break;
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return skipped;
        }
    }, {
        key: '_addTileFeatures',
        value: function _addTileFeatures(ids, points, x, y, z2, tile) {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = ids[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var i = _step4.value;

                    var c = points[i];
                    var f = {
                        type: 1,
                        geometry: [[Math.round(this.options.extent * (c.x * z2 - x)), Math.round(this.options.extent * (c.y * z2 - y))]],
                        tags: c.numPoints ? getClusterProperties(c) : this.points[c.index].properties
                    };
                    var id = c.numPoints ? c.id : this.points[c.index].id;
                    if (id !== undefined) {
                        f.id = id;
                    }
                    tile.features.push(f);
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
    }, {
        key: '_limitZoom',
        value: function _limitZoom(z) {
            return Math.max(this.options.minZoom, Math.min(z, this.options.maxZoom + 1));
        }
    }, {
        key: '_cluster',
        value: function _cluster(points, zoom) {
            var clusters = [];
            var _options3 = this.options,
                radius = _options3.radius,
                extent = _options3.extent,
                reduce = _options3.reduce;

            var r = radius / (extent * Math.pow(2, zoom));

            // loop through each point
            for (var i = 0; i < points.length; i++) {
                var p = points[i];
                // if we've already visited the point at this zoom level, skip it
                if (p.zoom <= zoom) continue;
                p.zoom = zoom;

                // find all nearby points
                var tree = this.trees[zoom + 1];
                var neighborIds = tree.within(p.x, p.y, r);

                var numPoints = p.numPoints || 1;
                var wx = p.x * numPoints;
                var wy = p.y * numPoints;

                var clusterProperties = reduce ? this._map(p) : null;

                // encode both zoom and point index on which the cluster originated
                var id = (i << 5) + (zoom + 1);

                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = neighborIds[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var neighborId = _step5.value;

                        var b = tree.points[neighborId];
                        // filter out neighbors that are already processed
                        if (b.zoom <= zoom) continue;
                        b.zoom = zoom; // save the zoom (so it doesn't get processed twice)

                        var numPoints2 = b.numPoints || 1;
                        wx += b.x * numPoints2; // accumulate coordinates for calculating weighted center
                        wy += b.y * numPoints2;

                        numPoints += numPoints2;
                        b.parentId = id;

                        if (reduce) {
                            reduce(clusterProperties, this._map(b));
                        }
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }

                if (numPoints === 1) {
                    clusters.push(p);
                } else {
                    p.parentId = id;
                    clusters.push(createCluster(wx / numPoints, wy / numPoints, id, numPoints, clusterProperties));
                }
            }

            return clusters;
        }
    }, {
        key: '_map',
        value: function _map(point) {
            return point.numPoints ? point.properties : this.options.map(this.points[point.index].properties);
        }
    }]);
    return Supercluster;
}();

exports.default = Supercluster;


function createCluster(x, y, id, numPoints, properties) {
    return {
        x: x, // weighted cluster center
        y: y,
        zoom: Infinity, // the last zoom the cluster was processed at
        id: id, // encodes index of the first child of the cluster and its zoom level
        parentId: -1, // parent cluster id
        numPoints: numPoints,
        properties: properties
    };
}

function createPointCluster(p, id) {
    var _p$geometry$coordinat = (0, _slicedToArray3.default)(p.geometry.coordinates, 2),
        x = _p$geometry$coordinat[0],
        y = _p$geometry$coordinat[1];

    return {
        x: lngX(x), // projected point coordinates
        y: latY(y),
        zoom: Infinity, // the last zoom the point was processed at
        index: id, // index of the source feature in the original input array,
        parentId: -1 // parent cluster id
    };
}

function getClusterJSON(cluster) {
    return {
        type: 'Feature',
        id: cluster.id,
        properties: getClusterProperties(cluster),
        geometry: {
            type: 'Point',
            coordinates: [xLng(cluster.x), yLat(cluster.y)]
        }
    };
}

function getClusterProperties(cluster) {
    var count = cluster.numPoints;
    var abbrev = count >= 10000 ? Math.round(count / 1000) + 'k' : count >= 1000 ? Math.round(count / 100) / 10 + 'k' : count;
    return extend(extend({}, cluster.properties), {
        cluster: true,
        cluster_id: cluster.id,
        point_count: count,
        point_count_abbreviated: abbrev
    });
}

// longitude/latitude to spherical mercator in [0..1] range
function lngX(lng) {
    return lng / 360 + 0.5;
}
function latY(lat) {
    var sin = Math.sin(lat * Math.PI / 180);
    var y = 0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI;
    return y < 0 ? 0 : y > 1 ? 1 : y;
}

// spherical mercator to longitude/latitude
function xLng(x) {
    return (x - 0.5) * 360;
}
function yLat(y) {
    var y2 = (180 - y * 360) * Math.PI / 180;
    return 360 * Math.atan(Math.exp(y2)) / Math.PI - 90;
}

function extend(dest, src) {
    for (var id in src) {
        dest[id] = src[id];
    }return dest;
}

function getX(p) {
    return p.x;
}
function getY(p) {
    return p.y;
}
module.exports = exports['default'];
//# sourceMappingURL=index.js.map