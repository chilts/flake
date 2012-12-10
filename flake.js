var fs = require('fs');

function pad(str, length) {
    while ( str.length < length ) {
        str = '0' + str;
    }
    return str;
}

module.exports = function(macInterface) {
    var currentTimestamp = Date.now();

    var pidHex = process.pid.toString(16);
    pidHex = pad('' + pidHex, 4);

    var macHex = fs.readFileSync('/sys/class/net/' + macInterface +  '/address').toString('utf8');
    macHex = macHex.replace(/:/g, '').replace(/\s+/g, '');

    var counter = 0;

    return function() {
        var timestamp = Date.now();
        var tsHex = timestamp.toString(16);
        tsHex = pad('' + tsHex, 12);

        if ( timestamp !== currentTimestamp ) {
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
