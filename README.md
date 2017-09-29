# memory-leak-heapdump
[![License](http://img.shields.io/:license-apache-brightgreen.svg)](http://www.apache.org/licenses/LICENSE-2.0.html)
[![Build Status](https://travis-ci.org/wz2cool/node-memory-leak-heapdump.svg?branch=master)](https://travis-ci.org/wz2cool/node-memory-leak-heapdump)
[![Coverage Status](https://coveralls.io/repos/github/wz2cool/memory-leak-heapdump/badge.svg?branch=master)](https://coveralls.io/github/wz2cool/memory-leak-heapdump?branch=master)
[![npm version](https://badge.fury.io/js/memory-leak-heapdump.svg)](https://badge.fury.io/js/memory-leak-heapdump)  
`memory-leak-heapdump` is based on `memwatch-next` and `heapdump`. It can dump heapsnapshot if memory leak.
  
## Install
`npm install memory-leak-heapdump --save`
  
## Usage
### snapshot
- js
```js
var heapdump = require('memory-leak-heapdump').Heapdump;
heapdump.snapshot('/tmp/test.heapsnapshot')
    .then(function (filepath) {
        console.log('snapshot file path: ', filepath);
    })
    .catch(function (err) {
        console.error(err);
    });
```
- ts
```js
import { Heapdump } from "memory-leak-heapdump";
Heapdump.snapshot("/tmp/test.heapsnapshot")
    .then((filepath) => {
        console.log("snapshot file path: ", filepath);
    })
    .catch((err) => {
        console.error(err);
    });
```

### Watch leak and snapshot
- ts
```js
import { Watcher, WatcherConfig } from "memory-leak-heapdump";
const watcherConfig = new WatcherConfig();
watcherConfig.appName = "targetAppName";
watcherConfig.snapshotDir = "/tmp";
watcherConfig.snapshotMinInterval = 18000; // 3 min interval(avoid cpu usage issue).

const handleSnapshot = (err: Error, filepath: string): void => {
    if (util.isNullOrUndefined(err)) {
        console.info("snapshot file path: ", filepath);
    } else {
        console.error("handleSnapshot: ", err);
    }
};
watcher.snapshotIfLeak(handleSnapshot);
```
