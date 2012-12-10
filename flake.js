var fs = require('fs');

function pad(str, length) {
    while ( str.length < length ) {
        str = '0' + str;
    }
    return str;
}

module.exports = function(macInterface, callback) {
    var currentTimestamp = Date.now();

    var pidHex = process.pid.toString(16);
    pidHex = pad('' + pidHex, 4);

    var macHex = fs.readFile('/sys/class/net/' + macInterface +  '/address', function(err, data) {
        if(err) return callback(err);

        macHex = data.toString('utf8').replace(/:/g, '').replace(/\s+/g, '');

        var counter = 0;

        callback(null, function() {
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
        });
    });
};
