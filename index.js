var mapnikOmnivore = require('mapnik-omnivore'),
    path = require('path'),
    mercRes = require('./lib/merc_res');


module.exports.drill_raster = drill_raster;
module.exports.get_scene_zoom = get_scene_zoom;

function drill_raster(file, maxRes, snapping, callback) {
    mapnikOmnivore.digest(file, function(err, metadata){
        console.log(JSON.stringify(metadata))
        if (err) return callback(err);
        else {
            mercRes.get_resolution(metadata, maxRes, snapping, function(err, res) {
                if (err) return callback(err);
                return callback(null, res)
            })
        }
    });
}

function get_scene_zoom(res, zoombreaks, upzoom, callback) {
    mercRes.metatile_size(res, zoombreaks, upzoom, function(err, metatileZoom) {
        if (err) callback(err);
        return callback(null, metatileZoom);
    })
}