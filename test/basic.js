var tap = require("tap");
var flake;

// --------------------------------------------------------------------------------------------------------------------
// basic tests

tap.test("load flake", function (t) {
    flake = require('../flake.js');
    t.ok(flake, 'flake loaded');
    t.end();
});

tap.test("using eth0", function (t) {
    flakeGen = flake('eth0');
    var id = flakeGen();
    console.log(id);
    t.ok(id, 'ID generated ok using eth0');
    t.end();
});

// don't do this :)
tap.test("using lo", function (t) {
    flakeGen = flake('lo');
    var id = flakeGen();
    console.log(id);
    t.ok(id, 'ID generated OK using lo');
    t.end();
});

tap.test("check ID has a particular format", function (t) {
    flakeGen = flake('eth0');
    var id = flakeGen().replace(/[0-9a-f]/g, 'x');
    t.equal(id, 'xxxxxxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx', 'ID format OK');
    t.end();
});

tap.test("check that the PIDs are the same", function (t) {
    flakeGen = flake('eth0');
    // may or may not be in the same timestamp
    var id1 = flakeGen();
    var id2 = flakeGen();
    id1 = id1.split('-');
    id2 = id2.split('-');
    t.equal(id1[0], id2[0], 'timestamp the same');
    t.equal(parseInt(id1[1], 16), parseInt(id2[1], 16) - 1, 'sequence increments fine');
    t.equal(id1[2], id2[2], 'pid the same');
    t.equal(id1[3], id2[3], 'mac address the same');
    t.end();
});

// --------------------------------------------------------------------------------------------------------------------
