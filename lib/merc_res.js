var r_utils = require('mapnik-omnivore/lib/utils');

module.exports.get_resolution = function(metadata, maxRes, snapping, callback) {

    var cellSize = metadata.raster.pixelSize.map(function(r) {
        return Math.max(r, maxRes);
    });

    var validSpatRef = r_utils.getSpatialResolutions();
    var spatialRes;

    if (snapping !== false) {
        spatialRes = r_utils.getValidSpatialResolutions(validSpatRef, cellSize[0], snapping);
        cellSize = [
            validSpatRef[Math.min(spatialRes.length, validSpatRef.length - 1)],
            validSpatRef[Math.min(spatialRes.length, validSpatRef.length - 1)]
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
        var breakZ = Math.min(z + upzoom, validSpatRef.length - 1);
        return {
            breakZ: breakZ,
            z: z,
            thresh: validSpatRef[breakZ]
        }
    });

    breakZooms = breakZooms.filter(function(r, l) {
        // Return if last OR if resolution is under the threshold AND if the next break has a different break
        return l === breakZooms.length - 1 || resolution < r.thresh && r.breakZ !== breakZooms[l + 1].breakZ;
    });

    return callback(null, breakZooms[0]);
}
