var test = require("tape");
var flake;

// --------------------------------------------------------------------------------------------------------------------
// basic tests

var name = 'wlan0';

test("load flake", function (t) {
    flake = require('../flake.js');
    t.ok(flake, 'flake loaded');
    t.end();
});

test("using " + name, function (t) {
    var flakeGen = flake(name);
    var id = flakeGen();
    console.log(id);
    t.ok(id, 'ID generated ok using ' + name);
    t.end();
});

// don't do this :)
test("using lo", function (t) {
    var flakeGen = flake('lo');
    var id = flakeGen();
    console.log(id);
    t.ok(id, 'ID generated OK using lo');
    t.end();
});

test("check ID has a particular format", function (t) {
    var flakeGen = flake(name);
    var id = flakeGen().replace(/[0-9a-f]/g, 'x');
    t.equal(id, 'xxxxxxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx', 'ID format OK');
    t.end();
});

test("check that the PIDs are the same", function (t) {
    var flakeGen = flake(name);
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
