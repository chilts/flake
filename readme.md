# Flake #

<strong>Generate practically unique approximately sortable IDs in a distributed environment.</strong>

[![NPM](https://nodei.co/npm/flake.png)](http://npm.im/flake)

## Flake Numbers ##

There are 3.403e+38 (or 340,282,366,920,938,463,463,374,607,431,768,211,456) possible flake numbers. Use in distributed
environments where you don't have a central service which can be a single point of failure - perfect when you want
everything to be redundant and independent of each other.

## The make-up of a Flake ID ##

Example Flake IDs from two different machines:

```
013c798f75ac-0000-1154-984be1b8b104
013c798f75ac-0001-1154-984be1b8b104
013c798f75ad-0000-1154-984be1b8b104
013c798f75ad-0001-1154-984be1b8b104
013c798f75ad-0002-1154-984be1b8b104
013c798f75ad-0003-1154-984be1b8b104

013c7990a044-0000-08ff-00027298bef9
013c7990a045-0000-08ff-00027298bef9
013c7990a045-0001-08ff-00027298bef9
013c7990a045-0002-08ff-00027298bef9
013c7990a045-0003-08ff-00027298bef9
```

As you can see, the Flake Id is made up of: <code>timestamp-counter-pid-macaddress</code> and can be seen in the
following table:

```
+---------+--------------+---------+------+--------------+
| Machine | Timestamp    | Counter | PID  | Mac Address  |
+---------+--------------+---------+------+--------------+
|    A    | 013c798f75ac | 0000    | 1154 | 984be1b8b104 |
|    A    | 013c798f75ac | 0001    | 1154 | 984be1b8b104 |
|    A    | 013c798f75ad | 0000    | 1154 | 984be1b8b104 |
|    A    | 013c798f75ad | 0001    | 1154 | 984be1b8b104 |
|    A    | 013c798f75ad | 0002    | 1154 | 984be1b8b104 |
|    A    | 013c798f75ad | 0003    | 1154 | 984be1b8b104 |
|    B    | 013c7990a044 | 0000    | 11ff | 00027298bef9 |
|    B    | 013c7990a045 | 0000    | 11ff | 00027298bef9 |
|    B    | 013c7990a045 | 0001    | 11ff | 00027298bef9 |
|    B    | 013c7990a045 | 0002    | 11ff | 00027298bef9 |
|    B    | 013c7990a045 | 0003    | 11ff | 00027298bef9 |
+---------+--------------+---------+------+--------------+
```

As you can see, each Flake ID is 128 bits long, consisting of a 48 bit timestamp, 16 bit counter, 16 bit PID and a 48
bit mac address.

All of these FlakeIDs are <code>approximately sortable</code> and <code>practically unique</code>.

## Usage ##

Firstly, find a network interface you can use so you can obtain a mac address:

```
var os = require('os');

var interfaces = os.networkInterfaces();
console.log(Object.keys(interfaces));
```

Look for something like 'eth0', 'en0', 'wlan0', 'venet0' or 'net0' (Note: you may have a number other than 0.) Don't
choose something like 'lo' or 'tun0'. Experiment to make sure it works. :)

In the following example, I'm using ```eth0```, but this is not guaranteed to work on your machine. You need to change
it to something which exists on your machine.

```
var flake = require('flake')('eth0');
console.log(flake());
console.log(flake());
console.log(flake());
```

Would give something like:

```
013b829b1520-0000-18f0-984be1b8b104
013b829b1527-0000-18f0-984be1b8b104
013b829b1527-0001-18f0-984be1b8b104
```

Running it again might give:

```
013b829b9680-0000-18f3-984be1b8b104
013b829b9680-0001-18f3-984be1b8b104
013b829b9685-0000-18f3-984be1b8b104
```

As you can see, the time has increased by a few seconds and the PID is different. The mac address is the same and the
sequence always resets.

Note: these unique IDs are not the same as UUIDs or can be used in place of one.

## Format of each Unique ID ##

Each unique ID has 4 sections which are:

```
013b83165f6a-00f9-314b-984be1b8b104
= 013b83165f6a -> timestamp in ms since epoch
= 00f9         -> counter
= 314b         -> PID of the current process
= 984be1b8b104 -> MAC address of the interface provided (e.g. 'eth0')
```

Unlike Twitter's Snowflake, we also use the PID since we want to be able to generate unique IDs on the same machine at
the same time. This is because we're generating them within the program which needs them and not in a client/server
architecture.

## Approximately Sortable ##

If you were to generate IDs in multiple processes on the same machine and on multiple machines, then whilst we can't
guarantee that the IDs will be exactly sortable, they will be approximately sortable. In fact, to the millisecond
(assuming your clocks aren't skew from each other).

e.g. some IDs generated on the same machine in two processes, using 'eth0' and 'wlan0' as the MAC address could be, and
printing out alternately:

```
013b83571852-0000-4ae8-984be1b8b104
013b83571853-0000-4ae8-00027298bef9
013b83571853-0000-4ae9-984be1b8b104
013b83571853-0001-4ae8-00027298bef9
013b83571853-0001-4ae9-984be1b8b104
013b83571853-0002-4ae8-00027298bef9
013b83571853-0002-4ae9-984be1b8b104
013b83571853-0003-4ae8-00027298bef9
013b83571853-0003-4ae9-984be1b8b104
```

As you can see, the IDs are firstly sorted by timestamp, then sequence, the PID then mac address.

## Non-Monotomic Clocks ##

Currently there is a possibility to generate the same ID in the same process on the same machine. This is described by
[System Clock Depedency](https://github.com/twitter/snowflake#system-clock-dependency).

This situation hasn't yet been solved but is known about. Therefore, you should run NTP in a mode which doesn't move
the clock backwards.

## Author ##

Written by [Andrew Chilton](http://chilts.org/) - [Blog](http://chilts.org/blog/) -
[Twitter](https://twitter.com/andychilton).

## License ##

Copyright (c) 2012 Andrew Chilton.

MIT License : http://chilts.mit-license.org/2012/

(Ends)
