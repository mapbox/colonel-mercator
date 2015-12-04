var tape = require('tape');
var exec = require('child_process').exec;

tape('[CLI - resolution] Test gets correct resolution', function(assert) {
    exec('node bin/colonel-mercator resolution test/fixtures/tiny.tif', function(err, stdout, stderr) {
        assert.error(err, 'Should not error');
        assert.looseEquals(stdout, 3.003153153153153);
        assert.end()
    })
});

tape('[CLI - resolution] Test gets correct resolution, respects maxres', function(assert) {
    exec('node bin/colonel-mercator resolution test/fixtures/tiny.tif --maxres 10.2', function(err, stdout, stderr) {
        assert.error(err, 'Should not error');
        assert.looseEquals(stdout, 10.2)
        assert.end()
    })
});

tape('[CLI - resolution] Test gets correct resolution, ignores maxres if higher', function(assert) {
    exec('node bin/colonel-mercator resolution test/fixtures/tiny.tif --maxres 1.01', function(err, stdout, stderr) {
        assert.error(err, 'Should not error');
        assert.looseEquals(stdout, 3.003153153153153);
        assert.end();
    })
});

tape('[CLI - resolution] Test gets correct resolution, snaps', function(assert) {
    exec('node bin/colonel-mercator resolution test/fixtures/tiny.tif --snap', function(err, stdout, stderr) {
        assert.error(err, 'Should not error');
        assert.looseEquals(stdout, 4.777312278747559);
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
    exec('node bin/colonel-mercator test/fixtures/tiny.tif', function(err, stdout, stderr) {
        assert.equals(err.code, 1)
        assert.equals(stderr, 'Invalid subcommand\n');
        assert.end();
    });
});

tape('[CLI - err] Test should error if bad subcommand', function(assert) {
    exec('node bin/colonel-mercator yomomma test/fixtures/tiny.tif', function(err, stdout, stderr) {
        assert.equals(err.code, 1);
        assert.equals(stderr, 'Invalid subcommand\n');
        assert.end();
    });
});