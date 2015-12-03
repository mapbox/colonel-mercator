var mapnikOmnivore = require('mapnik-omnivore'),
    path = require('path'),
    mercRes = require('./lib/merc_res');


module.exports.drill_raster = drill_raster;

function drill_raster(file, maxRes, snapping, callback) {
    mapnikOmnivore.digest(file, function(err, metadata){
        if (err) return callback(err);
        else {
            mercRes.get_resolution(metadata, maxRes, snapping, function(err, data) {
                return callback(null, data)
            })
        }
    });
}