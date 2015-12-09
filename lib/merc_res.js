var r_utils = require('mapnik-omnivore/lib/utils');

module.exports.get_resolution = function(metadata, maxRes, snapping, callback) {
    var EPSLN = 1.0e-10;

    var cellSize = metadata.raster.pixelSize.map(function(r) {
        return Math.max(r, maxRes);
    });

    var validSpatRef = r_utils.getSpatialResolutions();

    var spatialRes = r_utils.getValidSpatialResolutions(validSpatRef, cellSize[0]);

    var snapRes, snapSpatialRes;

    if (snapping) {
        snapRes = spatialRes[spatialRes.length - 1] - EPSLN;
        snapSpatialRes = r_utils.getValidSpatialResolutions(validSpatRef, snapRes);

        // Insurance agains recursive resampling
        if (spatialRes[spatialRes.length - 1] !== snapSpatialRes[snapSpatialRes.length - 1]) {
            throw new Error('Cellsize is over threshold');
        }

        // Set cellsize to resolution @ mapnik-omnivore threshold - EPSLN
        cellSize = [
            snapSpatialRes[snapSpatialRes.length - 1],
            snapSpatialRes[snapSpatialRes.length - 1]
        ];
    }

    return callback(null, cellSize);
}

module.exports.metatile_size = function(resolution, breakZooms, upzoom, callback) {
    if (breakZooms.length === 0) return callback(new Error('must have at least one zoom break'))
    // sort by zoom
    breakZooms = breakZooms.sort(function(za, zb) {
        return za < zb;
    });

    var validSpatRef = r_utils.getSpatialResolutions();

    breakZooms = breakZooms.map(function(z) {
        return {
            z: z,
            thresh: validSpatRef[Math.min(z + upzoom, validSpatRef.length -1)]
        }
    });

    var minThresh = breakZooms[breakZooms.length -1]

    breakZooms = breakZooms.filter(function(r) {
        if (resolution < r.thresh) {
            return r
        }
    });

    if (breakZooms.length) {
        return callback(null, breakZooms[0]);
    } else {
        return callback(null, minThresh);
    }
}
