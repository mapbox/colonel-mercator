var raster = require('mapnik-omnivore/lib/raster');

module.exports.get_resolution = function(metadata, maxRes, snapping, callback) {
    var EPSLN = 1.0e-10;
    var units = raster.getUnitType(metadata.projection)
    var cellSize = raster.convertToMeters(metadata.raster.pixelSize, units).map(function(r) {
        return Math.max(r, maxRes);
    });

    var validSpatialResolutions = raster.getSpatialResolutions(cellSize);
    var spatialRes = raster.getValidSpatialResolutions(validSpatialResolutions, cellSize);

    var snapRes, snapSpatialRes;

    if (snapping) {
        var snapRes = spatialRes[spatialRes.length - 1] - EPSLN;

        var snapSpatialRes = raster.getValidSpatialResolutions(validSpatialResolutions, [snapRes, snapRes]);

    // Insurance agains recursive resampling
        if (spatialRes[spatialRes.length - 1] !== snapSpatialRes[snapSpatialRes.length - 1]) {
            throw new Error('Cellsize is over threshold');
        }

        cellSize = [snapSpatialRes[snapSpatialRes.length - 1], snapSpatialRes[snapSpatialRes.length - 1]]
    }

    return callback(null, cellSize);
}