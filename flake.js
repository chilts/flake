var fs = require('fs');
var os = require('os');

function pad(str, length) {
    while ( str.length < length ) {
        str = '0' + str;
    }
    return str;
}

module.exports = function(macInterface, callback) {
    // remember the pid
    var pidHex = process.pid.toString(16);
    pidHex = pad('' + pidHex, 4);

    // start remembering where we are for the sake of incrementing the counter
    var currentTimestamp = Date.now();

    var interfaces = os.networkInterfaces();
    if ( macInterface in interfaces === false ) {
        throw new Error("Unknown interface " + macInterface);
    }
    var macHex = interfaces[macInterface][0].mac.replace(/:/g, '').toLowerCase();

    var counter = 0;

    return function() {
        var timestamp = Date.now();
        var tsHex = timestamp.toString(16);
        tsHex = pad('' + tsHex, 12);

        // if we check for 'less than' this also removes uncertainty if the clock goes backwards
        if ( currentTimestamp < timestamp ) {
            counter = 0;
            currentTimestamp = timestamp;
        }
        counterHex = pad('' + counter.toString(16), 4);

        counter++;
        if ( counter > 65535 ) {
            counter = 0;
        }

        return tsHex + '-' + counterHex + '-' + pidHex + '-' + macHex;
    };
};
