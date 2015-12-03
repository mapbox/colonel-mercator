var mapnikOmnivore = require('mapnik-omnivore'),
    path = require('path'),
    mercRes = require('./lib/merc_res');


module.exports.drill_raster = drill_raster;

function drill_raster(file, maxRes, snapping, breaks, callback) {
    mapnikOmnivore.digest(file, function(err, metadata){
        if (err) return callback(err);
        else {
            mercRes.get_resolution(metadata, maxRes, snapping, function(err, res) {
                if (err) return callback(err);

                if (breaks) {
                    mercRes.metatile_size(res[0], breaks, function(err, data) {
                        if (err) return callback(err);
                        return callback(null, {
                            metatile: data[0].z,
                            resolution: res[0]
                        });
                    });
                } else {
                    return callback(null, {
                        resolution: res[0]
                    })
                }
            })
        }
    });
}