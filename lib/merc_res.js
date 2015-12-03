var raster = require('mapnik-omnivore/lib/raster');


module.exports.get_resolution = function(metadata, maxRes, snapping, callback) {
    var EPSLN = 1.0e-10;
    var units = raster.getUnitType(metadata.projection);

    var cellSize = raster.convertToMeters(metadata.raster.pixelSize, units).map(function(r) {
        return Math.max(r, maxRes);
    });

    var validSpatRef = raster.getSpatialResolutions();

    var spatialRes = raster.getValidSpatialResolutions(validSpatRef, cellSize[0]);

    var snapRes, snapSpatialRes;

    if (snapping) {
        snapRes = spatialRes[spatialRes.length - 1] - EPSLN;
        snapSpatialRes = raster.getValidSpatialResolutions(validSpatRef, snapRes);

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

    var validSpatRef = raster.getSpatialResolutions();

    breakZooms = breakZooms.map(function(z) {
        return {
            z: z,
            thresh: validSpatRef[Math.min(z + upzoom, validSpatRef.length -1)]
        }
    });

    return callback(null, breakZooms.filter(function(r) {
        if (resolution < r.thresh) {
            return r
        }
    })[0])
}
