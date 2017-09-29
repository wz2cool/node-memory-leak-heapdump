# memory-leak-heapdump
[![License](http://img.shields.io/:license-apache-brightgreen.svg)](http://www.apache.org/licenses/LICENSE-2.0.html)
[![Build Status](https://travis-ci.org/wz2cool/node-memory-leak-heapdump.svg?branch=master)](https://travis-ci.org/wz2cool/node-memory-leak-heapdump)
[![Coverage Status](https://coveralls.io/repos/github/wz2cool/memory-leak-heapdump/badge.svg?branch=master)](https://coveralls.io/github/wz2cool/memory-leak-heapdump?branch=master)
[![npm version](https://badge.fury.io/js/memory-leak-heapdump.svg)](https://badge.fury.io/js/memory-leak-heapdump)  
`memory-leak-heapdump` is based on `memwatch-next` and `heapdump`. It can dump heapsnapshot if memory leak.
  
## Install
`npm install memory-leak-heapdump --save`
  
## Usage
### Dump heapsnapshot
- js
```js
var heapdump = require('memory-leak-heapdump').Heapdump;
heapdump.dumpFile('/tmp/test.heapsnapshot')
    .then(function (dumpFilepath) {
        console.log('dumpFilepath: ', dumpFilepath);
    })
    .catch(function (err) {
        console.error(err);
    });
```
- ts
```js
import { Heapdump } from "memory-leak-heapdump";
Heapdump.dumpFile("/tmp/test.heapsnapshot")
    .then((dumpFilepath) => {
        console.log('dumpFilepath: ', dumpFilepath);
    })
    .catch((err) => {
        console.error(err);
    });
```

### watch leak and dump file
- ts
```js
import { Watcher, WatcherConfig } from "memory-leak-heapdump";
const watcherConfig = new WatcherConfig();
watcherConfig.appName = "targetAppName";
watcherConfig.dumpDir = "/tmp";
watcherConfig.dumpMinInterval = 18000; // 3 min interval(avoid cpu usage issue).

const handleDumpFile = (err: Error, leakDumpFilepath: string): void => {
    if (util.isNullOrUndefined(err)) {
        console.info("dump file path: ", leakDumpFilepath);
    } else {
        console.error("dumpFileIfLeak:", err);
    }
};
watcher.dumpFileIfLeak(handleDumpFile);
```
