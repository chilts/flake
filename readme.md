Flake - generate unique (approximately sortable) IDs in a distributed environment.

## Usage ##

```
require('flake')('eth0', function(err, flakeGen) {
    console.log(flakeGen());
    console.log(flakeGen());
    console.log(flakeGen());
});
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

## License ##

The MIT License : http://opensource.org/licenses/MIT

Copyright (c) 2012 AppsAttic Ltd. http://appsattic.com/

(Ends)
