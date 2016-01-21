
var merc_res = require('../lib/merc_res');
var tape = require('tape');

tape('[LIB - get resolution] Test gets correct resolution', function(assert) {
    var metadata = {
        projection: '+proj=utm +zone=10 +datum=WGS84 +units=m +no_defs',
        raster: {
            pixelSize: [10.0, 10.0]
        }
    }
    var maxRes = 0;
    var snapping = false;
    merc_res.get_resolution(metadata, maxRes, snapping, function(err, res) {
        assert.error(err);
        assert.deepLooseEqual(res, [10, 10]);
        assert.end();
    });
});

tape('[LIB - get resolution] Test gets correct resolution, respects maxres', function(assert) {
    var metadata = {
        projection: '+proj=utm +zone=10 +datum=WGS84 +units=m +no_defs',
        raster: {
            pixelSize: [3.0, 3.0]
        }
    }
    var maxRes = 5.0;
    var snapping = false;
    merc_res.get_resolution(metadata, maxRes, snapping, function(err, res) {
        assert.error(err);
        assert.deepLooseEqual(res, [5, 5])
        assert.end();
    });
});

tape('[LIB - get resolution] Test gets correct resolution, snaps up', function(assert) {
    var metadata = {
        projection: '+proj=utm +zone=10 +datum=WGS84 +units=m +no_defs',
        raster: {
            pixelSize: [3.0, 3.0]
        }
    }
    var maxRes = 0;
    var snapping = 1;
    merc_res.get_resolution(metadata, maxRes, snapping, function(err, res) {
        assert.error(err);
        assert.deepLooseEqual(res, [ 4.777312278747559, 4.777312278747559 ]);
        assert.end();
    });
});


tape('[LIB - get resolution] Test gets correct above highest cellsize, snaps', function(assert) {
    var metadata = {
        projection: '+proj=utm +zone=10 +datum=WGS84 +units=m +no_defs',
        raster: {
            pixelSize: [0.001, 0.001]
        }
    }
    var maxRes = 0;
    var snapping = 0.5;
    merc_res.get_resolution(metadata, maxRes, snapping, function(err, res) {
        assert.error(err);
        assert.deepLooseEqual(res, [ 0.2985820174217224, 0.2985820174217224 ])
        assert.end();
    });
});

tape('[LIB - get metatile] Test gets correct metatile z', function(assert) {
    var resolution = 2.4;
    var breakzooms = [4, 7, 10, 13];
    var upzoom = 3;
    merc_res.metatile_size(resolution, breakzooms, upzoom, function(err, metatile) {
        assert.error(err);
        assert.deepLooseEqual(metatile, { thresh: 19.109249114990234, z: 10 });
        assert.end();
    });
});

tape('[LIB - get metatile] does not go over avail zooms', function(assert) {
    var resolution = 0.1;
    var breakzooms = [4, 7, 10, 13];
    var upzoom = 10;
    merc_res.metatile_size(resolution, breakzooms, upzoom, function(err, metatile) {
        assert.error(err);
        assert.deepLooseEqual(metatile, { thresh: 0.2985820174217224, z: 13 })
        assert.end();
    });
});

tape('[LIB - get metatile] Throws error if no breakzooms', function(assert) {
    var resolution = 2.4;
    var breakzooms = [];
    var upzoom = 3;
    merc_res.metatile_size(resolution, breakzooms, upzoom, function(err, metatile) {
        assert.equal(err.message, 'must have at least one zoom break');
        assert.end();
    });
});

tape('[LIB - get metatile] if over min threshold, return min zoom', function(assert) {
    var resolution = 1500;
    var breakzooms = [4, 7, 10, 13];
    var upzoom = 3;
    merc_res.metatile_size(resolution, breakzooms, upzoom, function(err, metatile) {
        assert.error(err);
        assert.deepLooseEqual(metatile, { thresh: 1222.991943359375, z: 4 })
        assert.end();
    });
});