var tape = require('tape');
var exec = require('child_process').exec;

tape('[CLI - resolution (UTM)] Test gets correct resolution', function(assert) {
    exec('node bin/colonel-mercator resolution test/fixtures/tiny-utm.tif', function(err, stdout, stderr) {
        assert.error(err, 'Should not error');
        assert.looseEquals(stdout, 3.003153153153153);
        assert.end()
    })
});

tape('[CLI - resolution (UTM)] Test gets correct resolution, respects maxres', function(assert) {
    exec('node bin/colonel-mercator resolution test/fixtures/tiny-utm.tif --maxres 10.2', function(err, stdout, stderr) {
        assert.error(err, 'Should not error');
        assert.looseEquals(stdout, 10.2)
        assert.end()
    })
});

tape('[CLI - resolution (UTM)] Test gets correct resolution, ignores maxres if higher', function(assert) {
    exec('node bin/colonel-mercator resolution test/fixtures/tiny-utm.tif --maxres 1.01', function(err, stdout, stderr) {
        assert.error(err, 'Should not error');
        assert.looseEquals(stdout, 3.003153153153153);
        assert.end();
    })
});

tape('[CLI - resolution (UTM)] Test gets correct resolution, snaps down (coarser resolution)', function(assert) {
    exec('node bin/colonel-mercator resolution test/fixtures/tiny-utm.tif --snap 0', function(err, stdout, stderr) {
        assert.error(err, 'Should not error');
        assert.looseEquals(stdout, 4.777312278847559);
        assert.end();
    })
});

tape('[CLI - resolution (4326)] Test gets correct resolution', function(assert) {
    exec('node bin/colonel-mercator resolution test/fixtures/tiny-4326.tif', function(err, stdout, stderr) {
        assert.error(err, 'Should not error');
        assert.looseEquals(stdout, 28.362205605213955);
        assert.end()
    })
});

tape('[CLI - resolution (4326)] Test gets correct resolution, respects maxres', function(assert) {
    exec('node bin/colonel-mercator resolution test/fixtures/tiny-4326.tif --maxres 30.2', function(err, stdout, stderr) {
        assert.error(err, 'Should not error');
        assert.looseEquals(stdout, 30.2)
        assert.end()
    })
});

tape('[CLI - resolution (4326)] Test gets correct resolution, ignores maxres if higher', function(assert) {
    exec('node bin/colonel-mercator resolution test/fixtures/tiny-4326.tif --maxres 1.01', function(err, stdout, stderr) {
        assert.error(err, 'Should not error');
        assert.looseEquals(stdout, 28.362205605213955);
        assert.end();
    })
});

tape('[CLI - resolution (4326)] Test gets correct resolution, snaps down (coarser resolution)', function(assert) {
    exec('node bin/colonel-mercator resolution test/fixtures/tiny-4326.tif --snap 0', function(err, stdout, stderr) {
        assert.error(err, 'Should not error');
        assert.looseEquals(stdout, 38.21849823008047);
        assert.end();
    })
});

tape('[CLI - resolution (4326)] Test gets correct resolution, snaps down (finer resolution)', function(assert) {
    exec('node bin/colonel-mercator resolution test/fixtures/tiny-4326.tif --snap 1', function(err, stdout, stderr) {
        assert.error(err, 'Should not error');
        assert.looseEquals(stdout, 19.109249115090233);
        assert.end();
    })
});

tape('[CLI - resolution (4326)] Test gets correct resolution, snaps down with 0.5 threshold (finer resolution)', function(assert) {
    exec('node bin/colonel-mercator resolution test/fixtures/tiny-4326.tif --snap 0.5', function(err, stdout, stderr) {
        assert.error(err, 'Should not error');
        assert.looseEquals(stdout, 19.109249115090233);
        assert.end();
    })
});

tape('[CLI - metatile] Test gets correct metatile zoom', function(assert) {
    exec('node bin/colonel-mercator metatile 3.003153153153153', function(err, stdout, stderr) {
        assert.error(err, 'Should not error');
        assert.deepLooseEqual(JSON.parse(stdout), JSON.parse('{"z":10,"thresh":19.109249114990234}'));
        assert.end();
    })
});

tape('[CLI - metatile] Test gets correct metatile zoom w/ diff upzoom', function(assert) {
    exec('node bin/colonel-mercator metatile 3.003153153153153 --upzoom 6', function(err, stdout, stderr) {
        assert.error(err, 'Should not error');
        assert.deepLooseEqual(JSON.parse(stdout), JSON.parse('{"z":7,"thresh":19.109249114990234}'));
        assert.end();
    })
});

tape('[CLI - metatile] Test respects correct zoombreaks', function(assert) {
    exec('node bin/colonel-mercator metatile 3.003153153153153 --zoombreaks "[4, 7, 10, 13]"', function(err, stdout, stderr) {
        assert.error(err, 'Should not error');
        assert.deepLooseEqual(JSON.parse(stdout), JSON.parse('{"z":10,"thresh":19.109249114990234}'));
        assert.end()
    })
});

tape('[CLI - metatile] Test respects zoombreaks in any order', function(assert) {
    exec('node bin/colonel-mercator metatile 3.003153153153153 --zoombreaks "[7, 4, 13, 10]"', function(err, stdout, stderr) {
        assert.error(err, 'Should not error');
        assert.deepLooseEqual(JSON.parse(stdout), JSON.parse('{"z":10,"thresh":19.109249114990234}'));
        assert.end();
    })
});

tape('[CLI - err] Test should error if no subcommand', function(assert) {
    exec('node bin/colonel-mercator test/fixtures/tiny-utm.tif', function(err, stdout, stderr) {
        assert.equals(err.code, 1)
        assert.equals(stderr, 'Invalid subcommand\n');
        assert.end();
    });
});

tape('[CLI - err] Test should error if bad subcommand', function(assert) {
    exec('node bin/colonel-mercator yomomma test/fixtures/tiny-utm.tif', function(err, stdout, stderr) {
        assert.equals(err.code, 1);
        assert.equals(stderr, 'Invalid subcommand\n');
        assert.end();
    });
});